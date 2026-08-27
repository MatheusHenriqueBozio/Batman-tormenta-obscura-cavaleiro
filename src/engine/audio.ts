/**
 * Som — DIRECAO.md §22.
 *
 * "Opcional na V1, mas deixe a arquitetura pronta. Se implementar: gotas, hum
 * dos monitores, passos, a batida na porta, floresta, vento do ending. Sempre
 * com botão de mute, nunca exigido, nunca autoplay."
 *
 * Este arquivo é a arquitetura, e nada mais: **a V1 não tem um único arquivo
 * de áudio**. O catálogo abaixo está vazio de propósito. As cenas já declaram
 * o que soaria nelas, e cada declaração é um `no-op` enquanto não houver
 * arquivo — a obra roda idêntica com som, sem som, e com som pela metade.
 *
 * As três regras que o desenho respeita, e que não podem ser afrouxadas:
 *
 * - **Nunca autoplay.** O padrão é mudo, e nada é buscado da rede antes de o
 *   leitor pedir. O primeiro som só existe depois de um gesto dele.
 * - **Nunca exigido.** Um arquivo que falta, um que falha ao carregar e um
 *   navegador que recusa tocar são todos casos normais, tratados em silêncio.
 *   Nenhum deles interrompe a leitura nem aparece na tela.
 * - **Sempre com mute.** A escolha do leitor persiste entre sessões.
 *
 * PARA ACRESCENTAR SOM: ponha os arquivos em `public/audio/` e registre-os em
 * `CATALOGO`. O botão de mute aparece sozinho a partir do primeiro registro, e
 * as cenas não precisam mudar — elas já dizem o que querem ouvir.
 */

/** Os sons que a §22 nomeia. A lista é fechada: o que não está aqui não toca. */
export type SoundId =
  | 'gota'
  | 'hum'
  | 'passos'
  | 'batida'
  | 'floresta'
  | 'vento';

export interface SoundSpec {
  /** Caminho a partir da raiz do site, por exemplo `/audio/gota.mp3`. */
  readonly src: string;
  /** Ambiências são laços; efeitos tocam uma vez. */
  readonly loop?: boolean;
  /** 0 a 1. O som desta obra nunca é protagonista. */
  readonly volume?: number;
}

/**
 * O catálogo de arquivos.
 *
 * Vazio na V1. Enquanto estiver vazio, `AUDIO.disponivel()` é falso, o botão
 * de mute não é renderizado e toda chamada de som é descartada sem custo.
 */
export const CATALOGO: Partial<Record<SoundId, SoundSpec>> = {
  // gota:     { src: '/audio/gota.mp3', volume: 0.35 },
  // hum:      { src: '/audio/hum.mp3', loop: true, volume: 0.2 },
  // passos:   { src: '/audio/passos.mp3', loop: true, volume: 0.3 },
  // batida:   { src: '/audio/batida.mp3', volume: 0.5 },
  // floresta: { src: '/audio/floresta.mp3', loop: true, volume: 0.25 },
  // vento:    { src: '/audio/vento.mp3', loop: true, volume: 0.25 },
};

const CHAVE_MUDO = 'tormenta:mudo';

interface Faixa {
  readonly el: HTMLAudioElement;
  readonly spec: SoundSpec;
}

/**
 * O tocador. Uma instância só, criada em `AUDIO`.
 *
 * Ele não sabe nada sobre cenas: recebe pedidos e decide se pode atendê-los.
 * Quem sabe o que soa em cada cena é a própria cena.
 */
class Tocador {
  private mudo = true;
  private readonly faixas = new Map<SoundId, Faixa>();
  private readonly falhou = new Set<SoundId>();
  private ambiencia: readonly SoundId[] = [];
  private ouvintes: Array<(mudo: boolean) => void> = [];

  constructor() {
    // A escolha do leitor persiste. Na dúvida — sem valor salvo, sem
    // localStorage — o padrão é mudo, porque autoplay é proibido.
    try {
      this.mudo = localStorage.getItem(CHAVE_MUDO) !== 'nao';
    } catch {
      this.mudo = true;
    }
  }

  /** Há algum arquivo registrado. Falso na V1. */
  disponivel(): boolean {
    return Object.keys(CATALOGO).length > 0;
  }

  estaMudo(): boolean {
    return this.mudo;
  }

  /** Avisa quem desenha o botão. Devolve como cancelar a inscrição. */
  observar(fn: (mudo: boolean) => void): () => void {
    this.ouvintes.push(fn);
    return () => {
      this.ouvintes = this.ouvintes.filter((o) => o !== fn);
    };
  }

  alternarMudo(): void {
    this.definirMudo(!this.mudo);
  }

  definirMudo(mudo: boolean): void {
    this.mudo = mudo;
    try {
      localStorage.setItem(CHAVE_MUDO, mudo ? 'sim' : 'nao');
    } catch {
      /* sem localStorage a escolha vale só para esta sessão. */
    }
    if (mudo) {
      for (const [, f] of this.faixas) f.el.pause();
    } else {
      // Ao desmutar, a ambiência da cena atual volta — e é só aqui que algo
      // chega a ser buscado da rede pela primeira vez.
      for (const id of this.ambiencia) this.tocar(id);
    }
    for (const o of this.ouvintes) o(mudo);
  }

  /**
   * Carrega sob demanda. Nada é buscado enquanto o leitor não pedir som, e um
   * arquivo que falha é marcado e nunca mais tentado.
   */
  private faixa(id: SoundId): Faixa | null {
    if (this.falhou.has(id)) return null;
    const existente = this.faixas.get(id);
    if (existente) return existente;

    const spec = CATALOGO[id];
    if (!spec) {
      this.falhou.add(id);
      return null;
    }
    const el = new Audio(spec.src);
    el.loop = spec.loop ?? false;
    el.volume = spec.volume ?? 0.3;
    el.preload = 'none';
    el.addEventListener('error', () => {
      // Um arquivo que falta não é erro de execução: é uma obra sem som.
      //
      // Pausar antes de esquecer: um elemento que falha depois de já ter
      // começado — a rede caiu no meio do laço — sai do mapa e ninguém mais o
      // alcança. Sem isto, o mute e o `pararTudo` deixariam de silenciá-lo, e
      // sobraria som tocando que o leitor não consegue desligar.
      el.pause();
      this.falhou.add(id);
      this.faixas.delete(id);
    });
    const f = { el, spec };
    this.faixas.set(id, f);
    return f;
  }

  /** Toca um som. Silencioso e sem custo quando não há como tocar. */
  tocar(id: SoundId): void {
    if (this.mudo) return;
    const f = this.faixa(id);
    if (!f) return;
    // `play()` devolve uma promessa que o navegador rejeita quando a política
    // de autoplay impede. Isso é esperado, e não é problema de ninguém.
    void f.el.play().catch(() => {
      /* o navegador recusou. A obra segue. */
    });
  }

  /** Dispara um efeito do começo. Usado pela batida na porta da S13. */
  disparar(id: SoundId): void {
    if (this.mudo) return;
    const f = this.faixa(id);
    if (!f) return;
    f.el.currentTime = 0;
    void f.el.play().catch(() => {});
  }

  parar(id: SoundId): void {
    const f = this.faixas.get(id);
    if (!f) return;
    f.el.pause();
    f.el.currentTime = 0;
  }

  /**
   * Troca a ambiência ao mudar de cena. O motor chama isto; as cenas só
   * declaram o que querem ouvir.
   */
  definirAmbiencia(ids: readonly SoundId[]): void {
    const antes = new Set(this.ambiencia);
    const agora = new Set(ids);
    for (const id of antes) if (!agora.has(id)) this.parar(id);
    this.ambiencia = ids;
    if (this.mudo) return;
    for (const id of agora) if (!antes.has(id)) this.tocar(id);
  }

  /** Silencia tudo, sem mexer na escolha do leitor. */
  pararTudo(): void {
    for (const [, f] of this.faixas) {
      f.el.pause();
      f.el.currentTime = 0;
    }
    this.ambiencia = [];
  }
}

export const AUDIO = new Tocador();
