# Fase 6 — passada de ritmo

A Fase 6 é a última: uma passada do início ao fim, **sem código novo**
(`DIRECAO.md` §3, passo 5). Este arquivo é a lista do que ficou para ser
decidido com a obra inteira montada, porque nenhuma dessas decisões pode ser
tomada olhando uma cena isolada.

Cada item traz o que foi feito, por que foi feito assim, e o que precisa ser
reavaliado. Ao resolver um item, apague-o daqui.

---

## Duração de cena

**Cenas que ficaram mais longas que a especificação.**
O padrão é sempre o mesmo: o texto revisado é mais longo do que o documento
supunha quando estimou as durações, e na duração original os blocos não caberiam.

| Cena | Especificado | Implementado | Motivo |
|---|---|---|---|
| S14 | 2 viewports | 4 | dezessete falas; em duas, cada bloco teria menos de cem pixels de rolagem |
| S17 | 2 viewports | 3 | doze falas, uma delas de 241 caracteres |
| S22 | "longa e lenta" | 4 | sete falas, e a cena pede a desaceleração mais forte da obra |

A S14 ficou decidida — o autor confirmou as quatro viewports na Fase 3. A S17
segue aberta. Reavaliar as duas com a obra montada.

**Comprimento total.** O mapa estimava 25 a 35 minutos. As 26 cenas somam
**64,5 viewports** de rolagem, mais o tempo dos cinco microgames e da corrida.
Vale medir o número real numa leitura de verdade e decidir se alguma cena está
longa demais para o que entrega.

**S25 — os créditos levam cerca de 52 segundos.** É rolagem automática e lenta,
como a §S25 pede, e a piada da redundância precisa de acumulação para
funcionar. Mas 50 segundos é muito para quem já terminou: vale ver se o ritmo
se sustenta depois da S24.

---

## Interação

**S06 — a conversa com a Bárbara tem cerca de 45 avanços de Enter.**
É a extensão natural do texto paginado em três linhas por caixa. É a cena mais
longa da obra em interação. Se parecer demais, dá para aumentar as linhas por
página sem tocar no texto.

---

## Coisas que só se veem de ponta a ponta

- **Onde o leitor cansa.** Marcar o ponto em que a atenção cai e decidir se é
  cena longa demais ou ritmo repetido.
- **A curva dos microgames.** Confirmação (S07), Toc. Toc. (S13), Floresta
  (S15) e Lutar Piora (S18) precisam escalar em peso, e não se repetir em
  sensação.
- **A relação S10 ↔ S18.** O SPACE honesto da corrida existe para que a
  mentira do microgame central funcione. Conferir se a distância entre as duas
  é suficiente para o leitor ter esquecido, e curta o bastante para lembrar.
- **As duas aparições do dourado** (S19 e S23). Conferir se a raridade se
  sustenta e se nenhuma outra cena vazou a cor.
- **As três aparições do Jason** (S03, S14, fala do Coringa). Conferir se a
  primeira é sutil demais para ser notada até na terceira leitura, e se a
  segunda é notada sem ser apontada.
- **A leveza da S23 depois do peso da S18.** As duas cenas usam o mesmo
  vocabulário visual com sentidos opostos. Conferir se a virada se sente, ou
  se a distância entre elas dilui o contraste.
- **Efeitos sem função narrativa.** O passo 6 da §3 manda remover todos. Fazer
  a varredura no fim, não durante.

---

## Varredura do §23 — critério de pronto

Feita ao fim da fase intermediária, com a obra inteira montada. O §23 diz:

> A V1 está pronta quando a experiência puder ser jogada do início ao fim, sem
> travar, sem beco sem saída, a 60fps, com os cinco microgames funcionando e o
> texto revisado editável em arquivo separado.

| Critério | Resultado |
|---|---|
| Jogável do início ao fim | passa |
| Sem travar | passa |
| Sem beco sem saída | passa |
| **A 60fps** | **não passa em cinco cenas** — ver abaixo |
| Os cinco microgames funcionando | passa |
| Texto revisado editável em arquivo separado | passa |

Nada disto foi consertado: a lista existe para a Fase 6 decidir o que fazer.

### O que não passa: 60fps em cinco cenas

Medido no navegador, mediana de três amostras de dois segundos por cena, em
1440×810:

| Cena | fps | Cena | fps |
|---|---|---|---|
| S03 Idiota | 45,5 | S18 Lutar Piora | 47,4 |
| S14 A Luz Tentadora | 45,9 | S23 O Navio | 43,5 |
| S15 A Floresta | 42,2 | | |

As outras 21 cenas ficam em 59,9–60,2.

**A causa é taxa de preenchimento, e não geometria.** A mesma medição em
viewports menores:

| Cena | 1440×810 | 1280×720 | 1024×576 |
|---|---|---|---|
| S03 | 46,7 | 58,5 | 59,9 |
| S15 | 43,5 | 52,6 | 59,9 |
| S23 | 46,5 | 56,8 | 59,9 |
| S05 (controle) | 59,9 | 59,9 | 59,9 |

O custo cai junto com a área, não com o número de formas. As cinco cenas lentas
são as que enchem o viewport várias vezes por quadro: massas grandes com alfa,
somadas ao grão, que é uma passada de `overlay` sobre a tela inteira.

Duas hipóteses foram testadas e **descartadas**:

- *A segunda passada de grão.* Remover uma das duas passadas da S03 devolveu
  cerca de 1fps — dentro do ruído. Não é isso.
- *O número de silhuetas.* A S03 mede o mesmo com zero e com quatro cópias em
  tela, e a S17 desenha uma silhueta gigante a 60fps.

### O aviso que precisa vir antes de qualquer conserto

**Estes números vêm de um Chromium sem aceleração de vídeo, num contêiner.**
O que está estabelecido é o comparativo: quais cenas são mais pesadas, e que o
peso acompanha a área. O número absoluto, não — numa máquina com GPU as cinco
podem muito bem passar de 60fps sem que se toque em nada.

**Antes de otimizar qualquer coisa, meça no preview da Vercel, na máquina de
verdade.** Otimizar um gargalo que só existe em software rendering seria
gastar a Fase 6 num problema que não existe, e as cinco cenas envolvidas estão
entre as mais fortes da obra — S03, S14, S15, S18 e S23 não deveriam perder
massa por causa de um número medido no lugar errado.

Se a medição na máquina real confirmar a queda, o caminho mais barato é reduzir
área de alfa antes de reduzir formas.

### O resto do §23, medido

- **Primeiro carregamento:** 327 kB em 10 requisições, **zero requisições a
  domínios externos**. Nenhuma fonte de CDN, nenhum arquivo de imagem no
  código-fonte: só o `og.png` e o `favicon.png`, ambos gerados por `npm run og`.
- **Code splitting por cena:** ativo. As cenas entram por `import()` dinâmico.
- **Gate desktop:** confirmado por acidente durante a medição — a viewport de
  720×405 do teste de área não carregou cena nenhuma, que é exatamente o
  comportamento da §4.
- **Metatags de compartilhamento:** 11 tags Open Graph e Twitter Card.
- **Lista do §21:** varredura por termo não encontrou score, vidas, game over,
  tela de vitória nem parabéns. As únicas ocorrências são comentários do
  código dizendo que essas coisas não existem.
- **Movimento reduzido:** percurso completo, sem travar e sem erro de console.
