/**
 * Gate desktop — DIRECAO.md §4.
 *
 * Se a viewport for menor que 1024px de largura, a experiência não carrega.
 * Mostra uma tela única, no Registro A, fundo escuro, com um sprite pequeno de
 * morcego em idle lento.
 *
 * Leve, sem motion pesado, sem carregar assets da experiência principal — o
 * gate é avaliado antes de qualquer `import()` de cena.
 */

import { useEffect, useRef } from 'react';
import { drawText, LINE_H } from '../visual/bitfont';
import { P_TITLE } from '../visual/palettes';
import { BAT_FRAMES, drawSprite } from '../visual/sprites';

const W = 320;
const H = 180;

const LINE_1 = 'Esta experiencia foi criada';
const LINE_2 = 'exclusivamente para desktop.';
const LINE_3 = 'Acesse pelo computador para jogar.';

export default function MobileGate(): JSX.Element {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const c = P_TITLE.colors;
    const wing = { figureDark: c.cyanDim, figureMid: c.cyanDim, figureEdge: c.cyan };
    let frame = 0;

    const paint = (): void => {
      canvas.width = W;
      canvas.height = H;
      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = c.void;
      ctx.fillRect(0, 0, W, H);

      const bat = BAT_FRAMES[frame % BAT_FRAMES.length];
      // Um pixel de sobe-e-desce, e só. Idle lento é idle lento.
      const bob = frame % 2 === 0 ? 0 : 1;
      drawSprite(ctx, bat, (W - bat.w) / 2, 52 + bob, P_TITLE, wing);

      drawText(ctx, LINE_1, W / 2, 92, c.cyan, { align: 'center' });
      drawText(ctx, LINE_2, W / 2, 92 + LINE_H, c.cyan, { align: 'center' });
      drawText(ctx, LINE_3, W / 2, 92 + LINE_H * 2 + 6, c.cyanDim, { align: 'center' });
    };

    paint();
    // Três quadros por segundo. Nada aqui precisa de requestAnimationFrame.
    const id = window.setInterval(() => {
      frame++;
      paint();
    }, 340);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="gate">
      <canvas ref={ref} className="gate__canvas" width={W} height={H} />
      <p className="gate__fallback">
        Esta experiência foi criada exclusivamente para desktop. Acesse pelo computador para jogar.
      </p>
    </div>
  );
}
