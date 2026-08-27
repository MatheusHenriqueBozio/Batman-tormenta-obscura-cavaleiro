/**
 * Entrada — DIRECAO.md §15.
 *
 * SCROLL narrativa e tempo, sempre. ← → movimento quando a cena pedir.
 * SPACE pulo ou ação contextual. ENTER avanço de diálogo.
 *
 * As teclas não podem ter efeito fora das cenas que as usam. Por isso nada
 * aqui age sozinho: o motor só registra estado, e a cena ativa decide se olha.
 */

export type Key = 'left' | 'right' | 'space' | 'enter';

const KEY_MAP: Record<string, Key> = {
  ArrowLeft: 'left',
  KeyA: 'left',
  ArrowRight: 'right',
  KeyD: 'right',
  Space: 'space',
  Enter: 'enter',
};

export interface Pointer {
  /** Posição em pixels de CSS, relativa ao viewport. */
  readonly x: number;
  readonly y: number;
  /** Houve clique neste quadro. */
  readonly clicked: boolean;
  /** O ponteiro está sobre a janela. */
  readonly over: boolean;
}

export class Input {
  private readonly down = new Set<Key>();
  private readonly pressed = new Set<Key>();
  /** Teclas que o leitor já usou pelo menos uma vez. */
  private readonly used = new Set<Key>();
  private attached = false;

  private px = -1;
  private py = -1;
  private over = false;
  private clicked = false;
  /** O leitor já clicou alguma vez. */
  private hasClickedEver = false;

  private readonly onKeyDown = (e: KeyboardEvent): void => {
    const key = KEY_MAP[e.code];
    if (!key) return;
    // Só o espaço precisa ser contido — ele rola a página por padrão.
    if (key === 'space') e.preventDefault();
    if (!this.down.has(key)) this.pressed.add(key);
    this.down.add(key);
    this.used.add(key);
  };

  private readonly onKeyUp = (e: KeyboardEvent): void => {
    const key = KEY_MAP[e.code];
    if (key) this.down.delete(key);
  };

  private readonly onMove = (e: PointerEvent): void => {
    this.px = e.clientX;
    this.py = e.clientY;
    this.over = true;
  };

  private readonly onLeave = (): void => {
    this.over = false;
  };

  private readonly onDown = (e: PointerEvent): void => {
    this.px = e.clientX;
    this.py = e.clientY;
    this.over = true;
    this.clicked = true;
    this.hasClickedEver = true;
  };

  attach(): void {
    if (this.attached) return;
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('pointermove', this.onMove, { passive: true });
    window.addEventListener('pointerdown', this.onDown);
    window.addEventListener('pointerleave', this.onLeave);
    this.attached = true;
  }

  detach(): void {
    if (!this.attached) return;
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('pointermove', this.onMove);
    window.removeEventListener('pointerdown', this.onDown);
    window.removeEventListener('pointerleave', this.onLeave);
    this.attached = false;
    this.down.clear();
    this.pressed.clear();
  }

  get pointer(): Pointer {
    return { x: this.px, y: this.py, clicked: this.clicked, over: this.over };
  }

  /** O leitor já clicou alguma vez — apaga a dica de clique. */
  hasClicked(): boolean {
    return this.hasClickedEver;
  }

  /** A tecla está segurada agora. */
  isDown(key: Key): boolean {
    return this.down.has(key);
  }

  /** A tecla foi apertada neste quadro. Consumida ao ser lida. */
  wasPressed(key: Key): boolean {
    return this.pressed.has(key);
  }

  /**
   * O leitor já usou esta tecla alguma vez.
   *
   * É o que apaga a dica de comando: ela aparece discretamente e some assim
   * que o jogador usa a tecla pela primeira vez. Nunca faça tutorial.
   */
  hasUsed(key: Key): boolean {
    return this.used.has(key);
  }

  /** Chamado pelo motor ao fim de cada quadro. */
  endFrame(): void {
    this.pressed.clear();
    this.clicked = false;
  }
}
