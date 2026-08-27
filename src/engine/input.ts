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

export class Input {
  private readonly down = new Set<Key>();
  private readonly pressed = new Set<Key>();
  /** Teclas que o leitor já usou pelo menos uma vez. */
  private readonly used = new Set<Key>();
  private attached = false;

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

  attach(): void {
    if (this.attached) return;
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    this.attached = true;
  }

  detach(): void {
    if (!this.attached) return;
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    this.attached = false;
    this.down.clear();
    this.pressed.clear();
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
  }
}
