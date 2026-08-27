/**
 * Bancada de validação dos registros — DIRECAO.md §3, passo 3.
 *
 * "Monte o sistema visual da Parte II como código reutilizável e valide com
 * uma cena de teste de cada registro."
 *
 * As cenas da Fase 1 (S00–S02) são todas Registro A. Esta bancada existe para
 * que o Registro B e o limiar também executem antes de a Fase 2 depender
 * deles. Não faz parte da obra: entra por `?validar=registros`, é carregada
 * sob demanda e nunca é baixada por quem só lê a história.
 */

import { useEffect, useRef, useState } from 'react';
import { applyGrain, misregister, renderMass } from '../visual/grain';
import { P_CAVE, P_IDIOT, P_VOID } from '../visual/palettes';
import { Registers, threshold, thresholdPalette } from '../visual/registers';
import { drawText } from '../visual/bitfont';
import { BATMAN_BACK, drawSilhouette } from '../visual/sprites';
import { A_H, A_W } from '../visual/registers';

type Modo = 'A' | 'B' | 'limiar';

export default function ValidarRegistros(): JSX.Element {
  const ref = useRef<HTMLCanvasElement>(null);
  const [modo, setModo] = useState<Modo>('A');
  const [t, setT] = useState(0.5);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const regs = new Registers(canvas);
    let raf = 0;

    // Uma massa do Registro B, gerada por corte de limiar sobre ruído.
    const massa = renderMass(520, 380, P_IDIOT.colors.red, {
      scale: 0.009,
      threshold: 0.08,
      octaves: 4,
    });

    const desenhar = (): void => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      regs.resize(window.innerWidth, window.innerHeight, dpr);

      if (modo === 'B') {
        // Registro B: espaço livre, duas cores, massa e silhueta, grão.
        const ctx = regs.beginB(P_IDIOT.colors.void);
        const { w, h } = regs.viewport;
        misregister(ctx, 2, -1, 0.4, () => {
          ctx.drawImage(massa, w / 2 - 260, h / 2 - 190);
        });
        ctx.fillStyle = P_VOID.colors.white;
        ctx.font = '800 clamp(2rem, 4vw, 4rem) system-ui, sans-serif';
        ctx.fillText('REGISTRO B', 60, h - 80);
        regs.endB(0.06);
      } else {
        // Registro A, com ou sem limiar aplicado no blit.
        const cores = modo === 'limiar' ? thresholdPalette(P_CAVE, t) : null;
        const fundo = cores ? cores[0] : P_CAVE.colors.void;
        const ctx = regs.beginA(fundo);

        const chaves = Object.keys(P_CAVE.colors);
        for (let i = 0; i < chaves.length; i++) {
          ctx.fillStyle = cores ? cores[i] : P_CAVE.colors[chaves[i]];
          ctx.fillRect(10 + i * 19, 24, 17, 40);
        }
        drawSilhouette(ctx, BATMAN_BACK, A_W / 2 - 8, A_H - 70, P_CAVE.colors.figureDark);
        drawText(ctx, modo === 'limiar' ? 'LIMIAR' : 'REGISTRO A', A_W / 2, 90, P_CAVE.colors.screenHot, {
          align: 'center',
        });

        regs.presentA(modo === 'limiar' ? threshold(t) : undefined);
        if (modo === 'limiar') {
          applyGrain(regs.mainCtx, regs.viewport.w, regs.viewport.h, threshold(t).grain);
        }
      }
      raf = requestAnimationFrame(desenhar);
    };
    desenhar();
    return () => cancelAnimationFrame(raf);
  }, [modo, t]);

  return (
    <div className="validar">
      <canvas ref={ref} className="stage" />
      <div className="validar__controles">
        {(['A', 'B', 'limiar'] as Modo[]).map((m) => (
          <button key={m} type="button" onClick={() => setModo(m)} data-ativo={modo === m}>
            {m}
          </button>
        ))}
        {modo === 'limiar' && (
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={t}
            onChange={(e) => setT(Number(e.target.value))}
            aria-label="posição do limiar"
          />
        )}
      </div>
    </div>
  );
}
