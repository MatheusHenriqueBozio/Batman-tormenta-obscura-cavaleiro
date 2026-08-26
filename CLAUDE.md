# Batman e a Tormenta Obscura do Cavaleiro

Novela gráfica interativa para navegador desktop. Uma história em prosa contada
por scroll cinematográfico, interrompida cinco vezes por microgames que expressam
mecanicamente o estado mental do protagonista.

**Não é um site com animações. Não é um jogo. É uma obra narrativa interativa.**

## Antes de qualquer tarefa

Leia `DIRECAO.md` na raiz. Ele é a especificação completa: direção criativa,
direção de arte, tratamento do texto, arquitetura técnica e as 26 cenas (S00 a S25).
Releia sempre que perder contexto. Ele é a fonte de verdade, não o histórico do chat.

`MAPA-DE-CENAS.md`, se presente, é documento de apoio com o raciocínio por trás
das decisões. Consulte quando precisar entender o porquê de alguma regra.

## Regras que não se negociam

- **Nenhuma arte de terceiros no projeto, em nenhuma forma.** Toda a arte é gerada
  em código. Não copie, não trace, não recrie painel de quadrinho, não imite o traço
  de nenhum artista. Se uma tradução sua ficar parecida demais com a referência
  conceitual, abandone a semelhança e preserve só o conceito.
- **Regra 90/10 do texto.** A história é do autor. Revisão literária cuidadosa,
  nunca reescrita. Nada de literatura rebuscada.
- **Desktop-only.** Sem versão mobile, sem controles touch. Viewport abaixo de
  1024px recebe uma tela de aviso e nada mais.
- **Sem Phaser, sem PixiJS, sem Three.js.** Canvas 2D resolve tudo. A justificativa
  está na seção 12 de `DIRECAO.md`.
- **Sem tela de vitória, sem score, sem HUD, sem boss fight, sem moral escrita.**
- Simplificar execução é preferível a simplificar conceito.

## Stack

Vite + React + TypeScript + GSAP ScrollTrigger + Canvas 2D.
Um único canvas, um único requestAnimationFrame, um registro de cenas.

## Comandos

```
npm install
npm run dev      # servidor de desenvolvimento
npm run build    # gera dist/ — precisa funcionar, o projeto publica na Vercel
npm run preview  # confere o build de produção localmente
```

## Deploy

Conectado à Vercel. Build `npm run build`, output `dist`, sem variável de ambiente.
Todo push gera preview automático. Não quebre o build.

## Trabalho em fases

Não implemente as 26 cenas de uma vez. As fases são:

1. Setup, sistema visual (Parte II), texto revisado, cenas S00–S02
2. S03–S09 — primeiro microgame e os dois diálogos em sprite
3. S10–S14 — a corrida e o corredor
4. S15–S19 — floresta, pais, figura interna, microgame central
5. S20–S25 — ending, créditos
6. Passada de ritmo do início ao fim, sem código novo

Ao fim de cada fase, pare e aguarde o autor testar pelo preview da Vercel.

## Estrutura

```
src/
  content/     narrative.ts, dialogue.ts — texto editável sem tocar em visual
  visual/      registers.ts, palettes.ts, grain.ts, sprites.ts
  scenes/      uma por cena, nomeada pelo ID (S01_Cave.ts…)
  games/       Confirm, Knock, Forest, Feed, Ship, Run
  engine/      canvas.ts, scroll.ts, input.ts
```

Nada de componente gigante. O autor precisa conseguir editar um parágrafo sem
quebrar animação, e trocar um sprite sem reconstruir componente.

## Referência por ID

Toda cena tem ID fixo (S00 a S25). O autor pede ajustes por ID. Não renomeie.
