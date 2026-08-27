/**
 * O motor — DIRECAO.md §13 e §17.
 *
 * Um único `<canvas>` em tela cheia, um único requestAnimationFrame, um
 * registro de cenas. Somente a cena ativa e as adjacentes existem em memória;
 * todas as outras são descartadas.
 */

import { Registers } from '../visual/registers';
import { SCENE_PALETTES } from '../visual/palettes';
import { Input } from './input';
import { ScrollDirector } from './scroll';
import type { Scene, SceneEntry, SceneFrame } from './scene';

/** Um bloco de texto do DOM preso à faixa de rolagem de uma cena. */
interface TextBlock {
  el: HTMLElement;
  sceneId: string;
  from: number;
  to: number;
  visible: boolean;
}

export class Engine {
  private readonly registers: Registers;
  private readonly input = new Input();
  private readonly director: ScrollDirector;
  private readonly entries: readonly SceneEntry[];
  private readonly loaded = new Map<string, Scene>();
  private readonly loading = new Set<string>();
  private readonly states = new Map<string, Record<string, unknown>>();
  private blocks: TextBlock[] = [];
  /**
   * A cena que está segurando o leitor.
   *
   * Precisa ser lembrada por nome, e não deduzida da cena ativa: um único
   * giro de roda pula uma seção inteira, e nesse quadro a cena que queria
   * segurar já não é a ativa — ninguém aplicaria o limite e o leitor
   * escaparia. Enquanto este campo estiver preenchido, a cena continua
   * carregada e continua sendo consultada.
   */
  private held: string | null = null;
  private raf = 0;
  private last = 0;
  private running = false;
  readonly reduced: boolean;

  constructor(canvas: HTMLCanvasElement, entries: readonly SceneEntry[], reduced: boolean) {
    this.registers = new Registers(canvas);
    this.entries = entries;
    this.reduced = reduced;
    this.director = new ScrollDirector(entries);
  }

  get scroll(): ScrollDirector {
    return this.director;
  }

  start(sections: Map<string, HTMLElement>, root: HTMLElement): void {
    if (this.running) return;
    this.running = true;
    this.input.attach();
    this.director.attach(sections);
    this.collectBlocks(root);
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.tick);
  }

  stop(): void {
    if (!this.running) return;
    this.running = false;
    cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.handleResize);
    this.input.detach();
    this.director.detach();
    for (const [, scene] of this.loaded) scene.exit?.();
    this.loaded.clear();
  }

  /** Os blocos de texto são lidos do DOM uma vez; depois só trocam de classe. */
  private collectBlocks(root: HTMLElement): void {
    this.blocks = Array.from(root.querySelectorAll<HTMLElement>('[data-scene]')).map((el) => ({
      el,
      sceneId: el.dataset.scene ?? '',
      from: Number(el.dataset.from ?? '0'),
      to: Number(el.dataset.to ?? '1'),
      visible: false,
    }));
  }

  private readonly handleResize = (): void => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.registers.resize(window.innerWidth, window.innerHeight, dpr);
    this.director.refresh();
  };

  private ensureLoaded(index: number): void {
    const entry = this.entries[index];
    if (!entry || this.loaded.has(entry.id) || this.loading.has(entry.id)) return;
    this.loading.add(entry.id);
    void entry
      .load()
      .then((scene) => {
        this.loaded.set(entry.id, scene);
        scene.enter?.();
      })
      .finally(() => this.loading.delete(entry.id));
  }

  /** Descarta o que estiver fora da janela ativa. */
  private prune(active: number): void {
    const keep = new Set(
      [active - 1, active, active + 1].map((i) => this.entries[i]?.id).filter(Boolean) as string[],
    );
    // Quem está segurando o leitor não pode ser descartado: é ela que sabe
    // quando soltar.
    if (this.held) keep.add(this.held);
    for (const [id, scene] of this.loaded) {
      if (!keep.has(id)) {
        scene.exit?.();
        this.loaded.delete(id);
        this.states.delete(id);
      }
    }
  }

  /** Monta o quadro que uma cena recebe. */
  private frameFor(scene: Scene, now: number, dt: number): SceneFrame {
    let state = this.states.get(scene.id);
    if (!state) {
      state = {};
      this.states.set(scene.id, state);
    }
    return {
      progress: this.director.progressOf(scene.id),
      time: now,
      dt,
      palette: scene.palette,
      registers: this.registers,
      input: this.input,
      state,
      reduced: this.reduced,
    };
  }

  /**
   * Aplica o limite de rolagem da cena que estiver segurando o leitor.
   *
   * A cena ativa é consultada primeiro. Se ela pedir para segurar, passa a ser
   * a cena que segura. Se uma outra já vinha segurando e o leitor escapou dela
   * por um salto de rolagem, ela continua sendo consultada até soltar — e o
   * limite traz o leitor de volta para dentro dela.
   */
  private applyHold(active: Scene | undefined, now: number, dt: number): void {
    if (active) {
      const teto = active.hold?.(this.frameFor(active, now, dt));
      if (teto !== null && teto !== undefined) {
        this.held = active.id;
        this.director.clampTo(active.id, teto);
        return;
      }
      if (this.held === active.id) this.held = null;
    }

    if (!this.held) return;
    const seguradora = this.loaded.get(this.held);
    if (!seguradora) {
      this.held = null;
      return;
    }
    const teto = seguradora.hold?.(this.frameFor(seguradora, now, dt));
    if (teto === null || teto === undefined) {
      this.held = null;
      return;
    }
    this.director.clampTo(seguradora.id, teto);
  }

  private readonly tick = (now: number): void => {
    const dt = Math.min(now - this.last, 100);
    this.last = now;

    const active = this.director.activeIndex;
    // A cena seguinte carrega enquanto o leitor ainda lê a atual.
    this.ensureLoaded(active);
    this.ensureLoaded(active + 1);
    this.ensureLoaded(active - 1);
    this.prune(active);

    const entry = this.entries[active];
    const scene = entry ? this.loaded.get(entry.id) : undefined;

    if (scene) {
      scene.draw(this.frameFor(scene, now, dt));
    } else if (entry) {
      // Ainda carregando: pinta o vazio da paleta da cena, nunca branco.
      const p = SCENE_PALETTES[entry.id];
      this.registers.clear(p ? Object.values(p.colors)[0] : '#04060a');
    }

    // A cena pode segurar o leitor. O motor não decide nada: só aplica.
    this.applyHold(scene, now, dt);

    this.updateBlocks(entry?.id ?? '');
    this.director.save(now);
    this.input.endFrame();
    this.raf = requestAnimationFrame(this.tick);
  };

  /**
   * Presença do texto. Sem fade-up, sem translate: o texto simplesmente está
   * no quadro seguinte, como um balão de quadrinho (§8).
   */
  private updateBlocks(activeId: string): void {
    for (const b of this.blocks) {
      // O bloco só existe enquanto a cena dele é a cena ativa. Sem esta
      // guarda, o progresso de uma cena já vencida fica parado em 1 e o
      // último bloco dela nunca sai da tela — dois textos sobrepostos.
      const p = this.director.progressOf(b.sceneId);
      const should = b.sceneId === activeId && p >= b.from && p <= b.to;
      if (should !== b.visible) {
        b.visible = should;
        b.el.classList.toggle('is-present', should);
      }
    }
  }
}
