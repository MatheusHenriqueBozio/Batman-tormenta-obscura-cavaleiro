/**
 * A experiência: o canvas único, a trilha de rolagem e o texto em DOM.
 *
 * O canvas cobre a tela e desenha tudo (§13). O texto narrativo é DOM, por
 * acessibilidade e seleção (§12). As seções da trilha só existem para dar ao
 * scroll a altura de cada cena — elas não desenham nada.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { Engine } from '../engine/canvas';
import { clearProgress, loadProgress, viewportsOf, type SavedProgress } from '../engine/scroll';
import { blocksOf } from '../content/narrative';
import { SCENES } from '../scenes';

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function Experience(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const reduced = useMemo(prefersReducedMotion, []);
  const [saved, setSaved] = useState<SavedProgress | null>(() => loadProgress());

  useEffect(() => {
    const canvas = canvasRef.current;
    const track = trackRef.current;
    if (!canvas || !track) return;

    const sections = new Map<string, HTMLElement>();
    for (const el of track.querySelectorAll<HTMLElement>('[data-section]')) {
      const id = el.dataset.section;
      if (id) sections.set(id, el);
    }

    const engine = new Engine(canvas, SCENES, reduced);
    engineRef.current = engine;
    engine.start(sections, track);

    // A linha de progresso: fina, na borda, quase invisível (§16).
    let raf = 0;
    const onScroll = (): void => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? window.scrollY / max : 0;
        document.documentElement.style.setProperty('--lida', String(p));
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
      engine.stop();
      engineRef.current = null;
    };
  }, [reduced]);

  const resume = (): void => {
    const engine = engineRef.current;
    const track = trackRef.current;
    if (!engine || !track || !saved) return;
    const sections = new Map<string, HTMLElement>();
    for (const el of track.querySelectorAll<HTMLElement>('[data-section]')) {
      const id = el.dataset.section;
      if (id) sections.set(id, el);
    }
    engine.scroll.restore(saved, sections);
    setSaved(null);
  };

  const dismiss = (): void => {
    clearProgress();
    setSaved(null);
  };

  return (
    <>
      <canvas ref={canvasRef} className="stage" aria-hidden="true" />

      <div className="track" ref={trackRef}>
        {SCENES.map((entry) => (
          <section
            key={entry.id}
            data-section={entry.id}
            className="track__scene"
            style={{ height: `${viewportsOf(entry, reduced) * 100}vh` }}
          >
            {blocksOf(entry.id).map((b) => (
              <div
                key={b.id}
                data-scene={b.scene}
                data-from={b.from}
                data-to={b.to}
                className={[
                  'bloco',
                  `bloco--${b.register.toLowerCase()}`,
                  `bloco--${b.place ?? 'left'}`,
                  b.placeholder ? 'bloco--pendente' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {b.paragraphs.map((text, i) => (
                  <p key={i}>{text}</p>
                ))}
              </div>
            ))}
          </section>
        ))}
      </div>

      <div className="lida" aria-hidden="true" />

      {saved && saved.sceneId !== SCENES[0].id && (
        <div className="retomar">
          <button type="button" onClick={resume}>
            retomar de onde parou
          </button>
          <button type="button" className="retomar__nao" onClick={dismiss}>
            começar de novo
          </button>
        </div>
      )}
    </>
  );
}
