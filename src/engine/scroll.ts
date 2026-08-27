/**
 * Scroll — DIRECAO.md §16.
 *
 * Vertical é a navegação principal. Cada cena ocupa uma faixa de rolagem e
 * recebe dela um `progress` normalizado. Nada de scrolljacking agressivo:
 * nenhum atraso artificial, nenhum bloqueio de retorno. O leitor sempre
 * consegue voltar.
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SceneEntry } from './scene';

gsap.registerPlugin(ScrollTrigger);

const SAVE_KEY = 'tormenta:progresso';
/** Com movimento reduzido nenhuma cena passa disto. Sem pinning longo. */
const REDUCED_MAX_VIEWPORTS = 1.5;

/**
 * Folga de uma viewport no fim da trilha.
 *
 * A página só rola até `altura - viewport`. Sem esta folga, a última cena
 * pararia no meio do próprio progresso e o último parágrafo dela nunca
 * apareceria. A folga não desenha nada: ela só devolve o curso que falta.
 */
export const TRAILING_SPACER = 1;

export interface SavedProgress {
  sceneId: string;
  progress: number;
  savedAt: number;
}

export function loadProgress(): SavedProgress | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedProgress;
    if (typeof parsed?.sceneId !== 'string') return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearProgress(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    /* localStorage indisponível — a obra funciona sem ele. */
  }
}

/** Altura da cena em viewports, já considerando movimento reduzido. */
export function viewportsOf(entry: SceneEntry, reduced: boolean): number {
  return reduced ? Math.min(entry.viewports, REDUCED_MAX_VIEWPORTS) : entry.viewports;
}

export class ScrollDirector {
  private readonly triggers: ScrollTrigger[] = [];
  private readonly progress = new Map<string, number>();
  private readonly entries: readonly SceneEntry[];
  private lastSave = 0;

  /** Índice da cena ativa na ordem narrativa. */
  activeIndex = 0;

  constructor(entries: readonly SceneEntry[]) {
    this.entries = entries;
    for (const e of entries) this.progress.set(e.id, 0);
  }

  /** Liga cada seção do DOM à sua cena. */
  attach(sections: Map<string, HTMLElement>): void {
    this.detach();
    this.entries.forEach((entry, index) => {
      const el = sections.get(entry.id);
      if (!el) return;
      const trigger = ScrollTrigger.create({
        trigger: el,
        // A cena corre do momento em que o topo dela encosta no topo da tela
        // até o momento em que o rodapé dela encosta no mesmo topo. Assim o
        // progresso cobre a altura inteira da seção: uma cena de 5 viewports
        // recebe 5 viewports de curso, e não 4.
        //
        // Isso só fecha porque a trilha termina com uma folga de uma viewport
        // (ver `TRAILING_SPACER`). Sem ela a última cena jamais alcançaria o
        // fim do próprio curso, porque a página para de rolar antes.
        start: 'top top',
        end: 'bottom top',
        // `scrub` não é usado aqui de propósito: o progresso é lido direto,
        // sem suavização artificial, para que parar de rolar pare o mundo.
        onUpdate: (self) => {
          this.progress.set(entry.id, self.progress);
          if (self.isActive) this.activeIndex = index;
        },
        onToggle: (self) => {
          if (self.isActive) this.activeIndex = index;
        },
      });
      this.triggers.push(trigger);
    });
    ScrollTrigger.refresh();
  }

  detach(): void {
    for (const t of this.triggers) t.kill();
    this.triggers.length = 0;
  }

  refresh(): void {
    ScrollTrigger.refresh();
  }

  progressOf(id: string): number {
    return this.progress.get(id) ?? 0;
  }

  get activeId(): string {
    return this.entries[this.activeIndex]?.id ?? this.entries[0].id;
  }

  /**
   * Salva o ponto da leitura. Retomar sim, pular não — por isso guardamos a
   * posição e nunca um índice de capítulo navegável.
   */
  save(now: number): void {
    if (now - this.lastSave < 1000) return;
    this.lastSave = now;
    const id = this.activeId;
    try {
      localStorage.setItem(
        SAVE_KEY,
        JSON.stringify({ sceneId: id, progress: this.progressOf(id), savedAt: Date.now() }),
      );
    } catch {
      /* sem localStorage, a obra segue — só não retoma. */
    }
  }

  /** Rola até o ponto salvo, sem animação longa. */
  restore(saved: SavedProgress, sections: Map<string, HTMLElement>): void {
    const el = sections.get(saved.sceneId);
    if (!el) return;
    const top = el.offsetTop + el.offsetHeight * saved.progress * 0.98;
    window.scrollTo({ top, behavior: 'auto' });
  }
}
