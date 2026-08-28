/**
 * S25 — CRÉDITOS · Registro A · rolagem lenta
 *
 * Depois do fade, o preto permanece por alguns segundos. Então os créditos
 * sobem, no registro pixel, em fonte bitmap, com espaçamento largo e cor
 * baixa. Rolagem automática e lenta, sem música triunfal.
 *
 * A obra fecha na mesma paleta em que abriu: preto e um único ciano.
 *
 * Ao final, a tela fica preta e parada. Uma tecla ou clique retorna à S00.
 *
 * Esta é a única cena em que o relógio manda sem ser microgame: os créditos
 * sobem sozinhos, e é assim que créditos funcionam. O leitor não os rola.
 */

import { drawText, LINE_H, measure } from '../visual/bitfont';
import { CREDITOS } from '../content/credits';
import { P_TITLE } from '../visual/palettes';
import { A_H, A_W } from '../visual/registers';
import type { Scene, SceneFrame } from '../engine/scene';

/** O preto que fica antes de qualquer coisa subir, em ms. */
const SILENCIO = 2600;
/**
 * Pixels internos por segundo. Lento de propósito, mas não a ponto de cobrar
 * a paciência de quem já acabou.
 *
 * Em 11 px/s os créditos duravam setenta segundos — a lista da Fase 6 supunha
 * cinquenta e dois, e o número real era pior. Em 16 são quarenta e nove, e
 * cada linha ainda cruza a tela em onze segundos, que é muito mais tempo do
 * que qualquer uma delas precisa. A piada da redundância continua tendo o
 * acúmulo de que precisa; o que sai é a espera depois dela.
 */
const VELOCIDADE = 16;
/** Espaçamento largo entre linhas. */
const ENTRELINHA = LINE_H + 5;
/** O quanto o preto fica depois que a última linha sai. */
const REPOUSO = 1800;

const rolagem = { ms: 0, fim: false, pediuVoltar: false };

const ALTURA_TOTAL = CREDITOS.length * ENTRELINHA;

export const S25: Scene = {
  id: 'S25',
  register: 'A',
  viewports: 2,
  palette: P_TITLE,

  draw({ registers, input, dt }: SceneFrame): void {
    const c = P_TITLE.colors;
    const ctx = registers.beginA(c.void);

    rolagem.ms += dt;

    const correu = Math.max(0, rolagem.ms - SILENCIO);
    const deslocamento = (correu / 1000) * VELOCIDADE;
    const topo = A_H - deslocamento;

    // A última linha saiu por cima: acabou.
    if (topo + ALTURA_TOTAL < -REPOUSO / 1000 * VELOCIDADE) rolagem.fim = true;

    if (!rolagem.fim) {
      for (let i = 0; i < CREDITOS.length; i++) {
        const linha = CREDITOS[i];
        if (!linha) continue;
        const y = Math.round(topo + i * ENTRELINHA);
        if (y < -LINE_H || y > A_H) continue;
        // O título e o "FIM" vão no ciano; o resto fica na cor baixa.
        const destaque = i === 0 || linha.trimEnd().endsWith('FIM');
        drawText(ctx, linha, Math.round((A_W - measure(linha)) / 2), y, destaque ? c.cyan : c.cyanDim);
      }
    }

    // Ao final, a tela fica preta e parada. Uma tecla ou clique retorna à S00.
    if (rolagem.fim) {
      const pediu =
        input.wasPressed('enter') || input.wasPressed('space') || input.pointer.clicked;
      if (pediu && !rolagem.pediuVoltar) {
        rolagem.pediuVoltar = true;
        rolagem.ms = 0;
        rolagem.fim = false;
        window.scrollTo({ top: 0, behavior: 'auto' });
        // Deixa o gesto seguinte funcionar de novo, se ele voltar aqui.
        window.setTimeout(() => {
          rolagem.pediuVoltar = false;
        }, 400);
      }
    }

    registers.presentA();
  },

  hold(): number | null {
    // Os créditos sobem sozinhos: o leitor não os rola. Ele fica aqui até
    // eles acabarem, e depois a página termina.
    return rolagem.fim ? null : 0.04;
  },
};

export default S25;
