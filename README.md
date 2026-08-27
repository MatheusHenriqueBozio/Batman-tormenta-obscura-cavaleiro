# Batman e a Tormenta Obscura do Cavaleiro

Uma novela gráfica interativa para navegador desktop. Uma história em prosa
contada por scroll cinematográfico, interrompida cinco vezes por microgames que
expressam mecanicamente o estado mental do protagonista.

**Não é um site com animações. Não é um jogo. É uma obra narrativa interativa.**

A especificação completa — direção criativa, direção de arte, tratamento do
texto e as 26 cenas — está em [`DIRECAO.md`](DIRECAO.md). O raciocínio por trás
das decisões está em [`MAPA-DE-CENAS.md`](MAPA-DE-CENAS.md).

---

## Como rodar

```bash
npm install
npm run dev      # servidor de desenvolvimento
```

O Vite recarrega sozinho. Editar um parágrafo em `src/content/narrative.ts` e
ver o resultado no navegador não exige rebuild.

```bash
npm run build    # gera dist/
npm run preview  # confere o build de produção localmente
npm run og       # regera a imagem de preview e o favicon
```

## Estado atual — Fase 3

O trabalho é dividido em fases (`DIRECAO.md` §3 e `CLAUDE.md`). As fases 1 a 3
entregam o setup, o sistema visual da Parte II, e as cenas **S00 a S14** —
incluindo os dois primeiros microgames, o trecho jogável e as duas conversas
em sprite.

| Cena | Título | Registro | Estado |
|---|---|---|---|
| S00 | Título | A | pronta |
| S01 | A Caverna | A | pronta |
| S02 | Alguma Coisa Está Repetindo | A degradando | pronta |
| S03 | Idiota | B | pronta |
| S04 | A Escolha do Ouvinte | A | pronta |
| S05 | O Vazio Preto | B | pronta |
| S06 | Bárbara | A puro | pronta |
| S07 | A Mola — **microgame 1** | B | pronta |
| S08 | Interlúdio | limiar | pronta |
| S09 | Alfred | A | pronta |
| S10 | A Corrida — **jogável** | A | pronta |
| S11 | O Corredor | A degradando | pronta |
| S12 | Luzes | A/C | pronta |
| S13 | Toc. Toc. — **microgame 2** | A | pronta |
| S14 | A Luz Tentadora | limiar | pronta |
| S15–S25 | — | — | fases 4 e 5 |

### O texto

A revisão 90/10 aprovada pelo autor está em [`TEXTO-REVISADO.md`](TEXTO-REVISADO.md),
na raiz. Ele é a **fonte**: o texto das cenas é transferido de lá para
`src/content/narrative.ts` sem alteração de uma palavra.

Todo o texto já está no código: `narrative.ts` traz a narração, os pensamentos
e as falas das cenas em prosa, e `dialogue.ts` traz as conversas em caixa
(S06, S07 e S09).

As cenas ainda não implementadas já estão com o texto no lugar, mas com janelas
de progresso provisórias, marcadas como tal no arquivo. Afinar uma janela é
trabalho da fase que constrói a cena, e não mexe no texto.

Ao editar um parágrafo, edite nos dois lugares — as duas versões precisam
continuar iguais.

---

## Onde editar o quê

| Quero mudar | Arquivo |
|---|---|
| Um parágrafo da narração | `src/content/narrative.ts` |
| Uma fala de diálogo | `src/content/dialogue.ts` |
| A cor de uma cena | `src/visual/palettes.ts` |
| Um sprite | `src/visual/sprites.ts` |
| A fonte bitmap | `src/visual/bitfont.ts` |
| Uma fala de conversa | `src/content/dialogue.ts` |
| O comportamento de uma cena | `src/scenes/S0X_Nome.ts` |
| A mecânica de um microgame | `src/games/*.ts` |
| A ordem ou a duração das cenas | `src/scenes/index.ts` |

```
src/
  content/
    narrative.ts     texto por cena, editável sem tocar em visual
    dialogue.ts      diálogos das cenas em caixa
  visual/
    registers.ts     Registro A, Registro B e o limiar
    palettes.ts      paletas por cena
    grain.ts         ruído, grão, desalinhamento e massas por limiar
    sprites.ts       sprites e retratos, escritos como mapas de pixel
    figures.ts       figuras por massa, para o Registro B
    bitfont.ts       a fonte bitmap do Registro A
    dialoguebox.ts   a caixa de diálogo: paginação e revelação
  scenes/
    index.ts         o registro de cenas, em ordem narrativa
    cave.ts          a Batcaverna, compartilhada por S01, S02 e S04
    corridor.ts      o corredor, compartilhado por S11, S12, S13 e S20
    dialoguescene.ts a gramática comum das conversas (S06 e S09)
    S00_Title.ts     uma por cena, nomeada pelo ID
    S01_Cave.ts
    S02_Repeat.ts
    S03_Idiot.ts
    S04_Listener.ts
    S05_Void.ts
    S06_Barbara.ts
    S07_Spring.ts
    S08_Interlude.ts
    S09_Alfred.ts
    S10_Run.ts
    S11_Hallway.ts
    S12_Lights.ts
    S13_Knock.ts
    S14_Light.ts
  games/
    Confirm.ts       microgame 1 — A Confirmação (S07)
    Run.ts           a corrida (S10)
    Knock.ts         microgame 2 — Toc. Toc. (S13)
  engine/
    canvas.ts        o motor: um canvas, um rAF, um registro de cenas
    scroll.ts        faixas de rolagem, progresso e retomada
    input.ts         teclado
    scene.ts         o contrato de cena
    math.ts          utilidades numéricas
  ui/
    Experience.tsx   canvas, trilha de rolagem e texto em DOM
    MobileGate.tsx   o gate desktop
```

Cada cena tem ID fixo (S00 a S25). Os ajustes são pedidos por ID. **Não
renomeie.**

---

## Como funciona

**Um canvas, um `requestAnimationFrame`, um registro de cenas.** Cada cena
recebe um `progress` normalizado vindo do scroll e desenha em função dele.
Nenhuma cena depende de relógio, exceto microgames — a consequência é desejada:
se o leitor para de rolar, o mundo para; se rola para trás, o mundo volta.

**Dois registros visuais.** O Registro A (mundo) desenha num canvas interno de
320×180 e é blitado em fator de escala inteiro, sem suavização: o espaço é
quantizado. O Registro B (mente) desenha em resolução nativa com duas ou três
cores chapadas: aqui o espaço é livre e a cor é que está quantizada. O limiar
entre os dois é uma função única e parametrizada, usada seis vezes na obra.

**Toda a arte é gerada em código.** Não há um único arquivo de imagem no
projeto — a rocha nasce de ruído, os sprites são mapas de pixel escritos à mão,
a fonte bitmap é uma tabela de glifos, e até a imagem de preview e o favicon
saem de `npm run og`, que importa os mesmos módulos que a obra usa em execução.
Nenhuma fonte vem de CDN. Nenhuma requisição externa.

**O limiar é uma função só.** A passagem entre os dois registros dilata o
pixel e colapsa a paleta ao mesmo tempo, e é a mesma função em todas as seis
travessias da obra. A S14 é a primeira a usá-la para valer: o corredor não é
redesenhado, ele apenas recebe uma paleta que vai virando preto e amarelo
enquanto o grid cresce até virar mancha.

**O scroll pode ser segurado, nunca sequestrado.** Uma cena declara até onde o
leitor pode avançar — é assim que a conversa com a Bárbara espera o Enter e que
a S07 trava a rolagem enquanto o leitor alimenta a confirmação. Só o teto é
aparado: voltar continua funcionando sempre, e nenhuma cena impede o retorno.

**Desktop-only.** Abaixo de 1024px de largura a experiência não carrega: o gate
é avaliado antes de qualquer `import()` de cena.

**Acessibilidade.** O texto narrativo é DOM, não canvas, para leitura por
leitor de tela e seleção. `prefers-reduced-motion` entrega uma versão
simplificada, completável do início ao fim.

## Deploy

Conectado à Vercel. Framework Vite detectado automaticamente, build
`npm run build`, output `dist`, sem variável de ambiente. Todo push gera preview.

## Créditos e licença

Obra de **Matheus Henrique Bozio**. Veja [`LICENSE`](LICENSE) — é uma obra de fã
não comercial.
