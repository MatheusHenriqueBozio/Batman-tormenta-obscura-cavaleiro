/**
 * O botão de mute — DIRECAO.md §22.
 *
 * "Sempre com botão de mute, nunca exigido, nunca autoplay."
 *
 * Ele só é renderizado quando existe algum arquivo de som registrado. Na V1
 * não existe nenhum, então o botão não aparece: um controle que não controla
 * nada seria ruído numa obra que passou 26 cenas tirando ruído da tela.
 *
 * A partir do primeiro arquivo registrado em `CATALOGO` ele aparece sozinho,
 * sem que nada mais precise mudar.
 */

import { useEffect, useState } from 'react';
import { AUDIO } from '../engine/audio';

export default function MuteButton(): JSX.Element | null {
  const [mudo, setMudo] = useState(() => AUDIO.estaMudo());

  useEffect(() => AUDIO.observar(setMudo), []);

  if (!AUDIO.disponivel()) return null;

  return (
    <button
      type="button"
      className="som"
      onClick={() => AUDIO.alternarMudo()}
      aria-pressed={!mudo}
      aria-label={mudo ? 'Ligar o som' : 'Desligar o som'}
    >
      {mudo ? 'som off' : 'som on'}
    </button>
  );
}
