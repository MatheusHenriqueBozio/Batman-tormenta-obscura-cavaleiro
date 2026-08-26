# DOCUMENTO DE IMPLEMENTAÇÃO — CLAUDE CODE
### Novela gráfica interativa por scroll — Batman / obsessão

Este documento é a especificação completa do projeto. Ele contém direção criativa, direção de arte, regras narrativas, arquitetura técnica e as 24 cenas.

Leia inteiro antes de escrever qualquer código.

---

## PARTE I — FUNDAMENTOS

### 1. O que é este projeto

Uma experiência narrativa para navegador desktop que conta uma história curta em prosa através de scroll. Não é um site com animações e não é um jogo. É uma obra onde a leitura é conduzida por scroll cinematográfico e interrompida, cinco vezes, por interações jogáveis curtas que expressam mecanicamente o estado mental do protagonista.

**A regra que governa tudo:**

> **Não projete páginas. Projete cenas.**

Uma cena pode ocupar cinco alturas de viewport. Outra pode ocupar meia. Outra pode travar o scroll por noventa segundos. Nunca transforme um parágrafo em uma `<section>`.

**O critério de sucesso:** ao terminar, o leitor deve poder dizer que em alguns momentos não leu o que Bruce sentia — a própria interface o fez sentir a lógica em que Bruce estava preso.

### 2. Regra de propriedade intelectual — inviolável

Este projeto é uma obra pessoal, não comercial, derivada de personagens de terceiros.

**Nenhuma imagem de quadrinho, screenshot de jogo ou arte de terceiros pode existir no projeto final.** Não copie, não trace, não reproduza, não recrie composição de painel específico e não imite o traço de nenhum artista identificável.

Toda a arte é gerada por código, do zero, dentro do sistema visual definido na Parte II. As referências de composição que existiam foram traduzidas para descrição escrita neste documento — trabalhe a partir da descrição, não de imagem alguma.

Se em algum momento você precisar de uma imagem que não consegue gerar em código, resolva com silhueta, forma abstrata ou vazio. Nunca com arte de terceiros.

### 2.1 Traduzir, não copiar

As descrições de composição neste documento vêm de referências de quadrinho que **não estão anexadas de propósito**. Elas descrevem conceito, não desenho.

A tarefa nunca é reproduzir uma imagem. É traduzir a lógica dela para a linguagem deste projeto.

| Errado | Certo |
|---|---|
| Recriar o painel do Batman dentro da própria cabeça | Criar uma arquitetura mental espiralada, original, que o jogador atravessa e que sugere repetição e prisão cognitiva |
| Fazer uma versão da escada da referência | Criar uma estrutura vertical de escala monumental, sombra profunda e sensação de descida interior |
| Copiar a figura se decompondo painel a painel | Inventar uma deterioração própria de uma identidade que tenta desesperadamente continuar existindo |

Não copie enquadramento reconhecível, linework, acabamento pictórico, design de página ou pose icônica.

**Regra de decisão:** se uma tradução sua ficar parecida demais com a origem conceitual, **abandone a semelhança e preserve apenas o conceito**. Entre fidelidade à referência e originalidade coerente com o projeto, escolha sempre a originalidade.

O resultado final deve deixar perceber a influência de quadrinho psicológico e de narrativa interativa íntima, sem que nenhuma imagem pareça adaptação direta de uma arte específica. **Este projeto precisa parecer uma obra original, porque é.**

### 3. Ordem de trabalho obrigatória

Não comece pela implementação.

1. Leia a história original inteira.
2. Produza a revisão literária conforme a Parte III e salve em arquivo próprio.
3. Monte o sistema visual da Parte II como código reutilizável e valide com uma cena de teste de cada registro.
4. Implemente as cenas na ordem narrativa.
5. Faça uma passada de ritmo do início ao fim, sem tocar em código.
6. Remova todo efeito que não tenha função narrativa.

Não pergunte a cada decisão pequena. Você tem liberdade criativa dentro destas regras. Quando duas soluções forem igualmente boas, escolha a mais simples.

### 4. Desktop-only

Este projeto é deliberadamente desktop. Não crie versão mobile, não crie controles virtuais, não adapte gameplay para touch, e não comprometa composição, escala ou interação por causa de tela pequena.

**Gate:** se a viewport for menor que 1024px de largura, não carregue a experiência. Mostre uma tela única, no Registro A (pixel), fundo escuro, com um sprite pequeno de morcego em idle lento e o texto:

> Esta experiência foi criada exclusivamente para desktop.
> Acesse pelo computador para jogar.

Leve, sem motion pesado, sem carregar assets da experiência principal.

---

## PARTE II — SISTEMA VISUAL

Esta é a decisão estruturante do projeto. Ela deve ser implementada como sistema antes de qualquer cena.

### 5. Os dois registros

O registro visual não é decoração. Ele informa **onde Bruce está**.

#### REGISTRO A — MUNDO (pixel art)

Tudo que acontece fisicamente: Batcaverna, base da Bárbara, telhados, corredor da casa, Mansão Wayne.

O que define este registro é que **o espaço é quantizado**. Grid rígido, posição inteira, cor livre.

Especificação:
- Resolução interna fixa de **320 × 180**, desenhada em canvas offscreen.
- Blit para o viewport com `imageSmoothingEnabled = false`, em fator de escala **inteiro**.
- Paleta indexada, máximo **16 cores por cena**.
- Sprites de personagem com **24px de altura**. Batman, Alfred, Bárbara e Coringa no mesmo padrão.
- Nenhum movimento subpixel. Toda posição arredondada para inteiro antes de desenhar.
- Nenhum anti-aliasing, nenhuma transparência parcial exceto dithering.
- Cenário em três camadas de parallax, no máximo.

**Por que pixel:** o mundo físico é o único lugar onde Bruce ainda consegue categorizar as coisas. Pixel art é ordem. É um mundo em grid.

#### REGISTRO B — MENTE (linguagem gráfica psicológica)

Tudo que acontece dentro dele: o vazio, o loop, a floresta, os pais, a figura interna, o navio.

Este registro precisa ser **original**. Não é quadrinho pintado, não é imitação do traço de ninguém, não é adaptação de página nenhuma. É uma linguagem gráfica abstrata que nasce deste projeto.

O que a define é o **inverso exato do pixel**: aqui o espaço é livre e contínuo, e **a cor é que está quantizada**.

Especificação:
- Desenho em resolução nativa do viewport. Sem grid, sem quantização espacial, sem sprite.
- **Duas ou três cores por cena.** Sem paleta cheia, sem degradê decorativo, sem iluminação realista.
- Formas por **massa e silhueta**, nunca por desenho. Nada de linework, contorno, anatomia detalhada ou acabamento pictórico.
- As massas podem e devem ser **orgânicas e fluidas**: mancha de tinta, carvão, fumaça, névoa, sombra escorrendo, luz recortada. Gere-as por **campo de ruído com corte por limiar**, não por gradiente suave. Isso mantém a cor chapada e ainda assim dá forma viva e imprevisível.
- **Grão permanente:** tile de ruído pré-renderizado, 4% a 8% de opacidade, com offset aleatório por frame.
- **Camadas levemente fora de registro**, deslocadas de 1 a 3px entre si, como impressão mal alinhada.
- Escala livre e violenta. Uma figura pode ter 12px ou ocupar três viewports.
- **Tipografia e caixas de texto podem deformar junto do espaço** quando a cena pedir.

**Referência de gênero, não de arte:** pense em motion graphic psicológico e animação independente de recorte, não em página de HQ. Se um resultado seu parecer um painel de quadrinho, está errado — mesmo que esteja bonito.

**Por que esta linguagem:** é o oposto formal do pixel, e carrega o significado sozinha. No mundo físico, Bruce controla onde as coisas ficam. Na mente, ele perde o espaço e só resta a cor.

#### REGISTRO C — LIMIAR

A passagem entre os dois. Não é transição técnica, é evento narrativo.

**A → B (entrando na mente):** o fator de escala do blit sobe progressivamente, de 6 para 40 ou mais, ao longo de 600 a 900ms de scroll. O pixel dilata até virar mancha. Simultaneamente a paleta colapsa das 16 cores para 2. No fim, o grão entra e o desalinhamento de camadas começa.

**B → A (voltando ao mundo):** o inverso. A quantização espacial reentra, a paleta reexpande, o grão sai.

Implemente isso como uma função única e parametrizada. Ela é usada seis vezes na obra e precisa ser sempre a mesma.

### 6. Paleta por cena

Registro A usa paletas de até 16 cores. Registro B usa exatamente as duplas ou trios indicados.

| Cena | Registro | Paleta |
|---|---|---|
| S00 Título | A | preto + um único ciano |
| S01–S02 Batcaverna | A | azuis frios, ciano dos monitores, preto |
| S03 Idiota | B | preto + vermelho |
| S04 Caverna | A | igual S01 |
| S05 Vazio | B | preto + branco |
| S06 Bárbara | A | verde-acinzentado + âmbar |
| S07 Mola | B | preto + azul elétrico |
| S09 Alfred | A | âmbar quente |
| S10 Corrida | A | azul-noite + silhueta preta |
| S11–S13 Corredor | A | verde doentio + roxo |
| S14 Luz | C | preto + amarelo |
| S15 Floresta | B | preto + verde-escuro + amarelo (só as tochas) |
| S16 Branco | B | branco + cinza — **única cena de fundo claro** |
| S17–S18 Figura | B | preto + branco |
| S19 Levantar | B | **transição de azul-frio para dourado** |
| S20 Corredor | A | volta ao verde/roxo |
| S21 Escuro | — | nada |
| S22 Mansão | A suavizado | âmbar e rosa de madrugada, contraste baixo |
| S23 Navio | B | azul-claro + branco + dourado |
| S24 Fim | B | dessatura até branco |
| S25 Créditos | A | preto + um único ciano, igual à S00 |

**O dourado aparece duas vezes na obra inteira:** S19 e S23. Em nenhum outro lugar. É a cor da agência recuperada e ela precisa ser rara para significar.

### 7. O arco visual

```
controle → repetição → ruído → fragmentação → labirinto
→ confronto → silêncio → espaço → leveza
```

No início há muita informação tecnológica na tela. No meio tudo fica congestionado. No fim: menos UI, menos texto, menos objetos, mais espaço, mais ar.

**A própria interface muda ao longo da obra.** Quando Bruce busca certeza, a interface pede confirmação. Quando quer controlar demais, o jogador recebe controles demais. Quando finalmente aceita não controlar, a interface simplifica.

### 8. Tipografia

Duas fontes, uma por registro.

- **Registro A:** fonte bitmap monoespaçada, renderizada no grid de 320×180, sem antialiasing. Texto revelado caractere a caractere nas caixas de diálogo.
- **Registro B:** uma sans-serif de peso alto, apertada, em caixa alta ou baixa conforme a cena. Sem serifa, sem itálico, sem sombra. Ela também deve receber o grão e o desalinhamento de camada.

No Registro B o texto **não entra com fade-up.** Ele simplesmente está no frame seguinte, como um balão de quadrinho. Essa é a diferença entre parecer site e parecer página.

---

## PARTE III — O TEXTO

### 9. Regra 90/10

A história é do autor e a identidade dela deve permanecer. Faça uma revisão literária cuidadosa, não uma reescrita.

Preserve aproximadamente **90%** da voz, acontecimentos, intenção, diálogos e estrutura. No máximo cerca de 10% pode mudar, e só estilisticamente.

**Refine:** construções excessivamente literais, frases juvenis, redundâncias, exposição desnecessária, diálogo que explica o tema ao leitor, escolha de palavra pouco natural, transição abrupta, pontuação, ritmo.

**Não faça:** literatura rebuscada. Bruce não é um poeta filosófico. A linguagem permanece acessível, sombria e introspectiva. Nada de "Bruce contemplava o inexorável abismo de sua própria existência".

Tudo em **português brasileiro**.

**Entregue a versão revisada em arquivo separado** (`src/content/narrative.ts` ou equivalente), estruturada por ID de cena, de modo que qualquer parágrafo possa ser editado depois sem tocar em componente visual.

### 10. Tratamento do tema

O centro da história é Bruce percebendo que sua capacidade de planejamento, controle e contingência adquiriu características que o aprisionam.

**Nunca transforme o projeto em explicação didática sobre transtornos.** Nenhum diagnóstico explícito, nenhuma psicoeducação, nenhuma moral escrita.

**Evite o clichê visual:** organização, limpeza, objetos alinhados, contar coisas, interruptores. A provocação do Coringa com a luz pode existir justamente porque é a leitura simplista e debochada *dele*. O sofrimento real acontece em outra camada.

O que a obra representa é: necessidade de certeza, ruminação, checagem mental, responsabilidade inflada, medo das consequências de parar de pensar, rituais internos, intolerância à incerteza.

### 11. Jason Todd

Jason não é a causa do problema. Ele é o material mais eficiente que a obsessão encontra para trabalhar.

Aparece três vezes, sempre breve, nunca nomeado em cena:
- **S03:** uma das silhuetas duplicadas tem a forma errada — menor, capa mais curta — por três ou quatro frames. E some.
- **S14:** a mesma silhueta errada volta, maior, e fica parada no escuro enquanto o Coringa fala. Não é mostrada. É notada.
- **Fala do Coringa,** preservada do original.

Nada de fan service. Ele representa responsabilidade transformada em culpa.

---

## PARTE IV — ARQUITETURA TÉCNICA

### 12. Stack

- **Vite + React + TypeScript**
- **GSAP + ScrollTrigger** para toda a cinematografia, pinning, scrub e travessia horizontal
- **Canvas 2D** para todo o desenho, nos dois registros
- **DOM** para texto narrativo, por acessibilidade e seleção

**Não use Phaser. Não use PixiJS. Não use Three.js.**

Justificativa, para que você não reintroduza: nenhum dos cinco microgames precisa de motor de jogo. Não há física, tilemap, sistema de entidades ou colisão complexa. O trecho mais "jogo" da obra é um pulo com colisão de retângulo. Um segundo runtime significaria um segundo loop, um segundo pipeline de asset e uma troca de contexto seis vezes ao longo da leitura. Além disso, a S15 precisa **transformar** um corredor em floresta sem corte, o que é trivial num canvas único e quase impossível entre dois runtimes.

Se você concluir que alguma cena específica realmente exige mais, implemente-a mesmo assim em Canvas 2D e deixe uma nota. Não instale a biblioteca.

### 13. Motor

Um único `<canvas>` em tela cheia, um único `requestAnimationFrame`, um registro de cenas.

- Cada cena é um objeto com `id`, `registro`, `draw(ctx, progress, state)` e opcionalmente `input`.
- O ScrollTrigger de cada cena alimenta um `progress` normalizado de 0 a 1. A cena só desenha em função disso. Nenhuma cena deve depender de relógio, exceto durante microgames.
- **Consequência desejada:** se o leitor para de rolar, o mundo para. Se rola para trás, o mundo volta. Isso ensina, sem texto, que o scroll é tempo.
- Registro A desenha num canvas offscreen de 320×180 e é blitado. Registro B desenha direto. O limiar interpola entre os dois modos.
- Somente a cena ativa e as adjacentes desenham. Todas as outras são descartadas.

### 14. Estrutura de arquivos

```
src/
  content/
    narrative.ts        texto revisado, por cena
    dialogue.ts         diálogos das cenas em caixa
  visual/
    registers.ts        Registro A, B e limiar
    palettes.ts         paletas por cena
    grain.ts            ruído e desalinhamento
    sprites.ts          sprites gerados/definidos
  scenes/
    S01_Cave.ts
    S02_Repeat.ts
    ...                 uma por cena
  games/
    Confirm.ts          S07
    Knock.ts            S13
    Forest.ts           S15
    Feed.ts             S18
    Ship.ts             S23
    Run.ts              S10
  engine/
    canvas.ts
    scroll.ts
    input.ts
```

Nada de componente gigante. O autor precisa conseguir editar um parágrafo sem quebrar animação, e trocar um sprite sem reconstruir componente.

### 15. Controles

- **SCROLL** — narrativa e tempo, sempre
- **← →** — movimento quando a cena pedir
- **SPACE** — pulo ou ação contextual
- **ENTER** — avanço de diálogo

As teclas **não podem** ter efeito fora das cenas que as usam. Quando um comando entra em jogo, ele aparece discretamente na tela e **some assim que o jogador o usa pela primeira vez**. Nunca faça tutorial.

### 16. Scroll

Vertical é a navegação principal. Algumas cenas são pinned e, enquanto o leitor continua rolando verticalmente, a câmera atravessa horizontalmente uma composição. Isso acontece em S01, S11 e S15.

**Não faça scrolljacking agressivo.** Nada de atraso artificial enorme, scroll que parece quebrado, impedir o retorno, ou movimento que causa enjoo. O leitor deve sempre conseguir voltar.

Implemente `prefers-reduced-motion` com uma versão simplificada: sem pinning longo, sem travessia horizontal, microgames reduzidos a uma interação única cada, história completável do início ao fim.

**Progresso:** salve o ponto da leitura em `localStorage` e ofereça retomar. Não crie menu de capítulos — retomar sim, pular não. Um indicador de progresso pode existir, mas como uma linha fina na borda, quase invisível.

### 17. Performance

Priorize `transform` e `opacity`. Nada de DOM gigantesco. O grão deve vir de um tile pré-renderizado com offset por frame, nunca de ruído calculado por pixel em tempo real. Timelines reaproveitáveis. Cenas não ativas descartadas.

Alvo: 60fps constantes num notebook comum.

---

## PARTE V — AS 24 CENAS

Cada cena tem ID fixo. Não renomeie.

---

**S00 — TÍTULO** · Registro A · tela cheia, sem scroll

A obra abre aqui. Fundo preto quase absoluto, apenas a sugestão de uma caverna ao fundo, muito escura. No centro, em fonte bitmap:

> **BATMAN**
> **E A TORMENTA OBSCURA DO CAVALEIRO**

Abaixo, menor e discreto:

> uma obra de Matheus Henrique Bozio

Nada mais. Sem menu, sem botões, sem "novo jogo / continuar", sem logo animado.

**Entrada:** o próprio scroll começa a experiência. O título sobe e sai de quadro conforme o leitor rola, e a S01 já está atrás dele. Nada de tela de loading e nada de clique obrigatório. Se houver progresso salvo, uma única linha discreta aparece embaixo oferecendo retomar.

**Motion:** mínimo. Uma gota caindo em loop lento, ou o brilho de um monitor pulsando ao fundo. Nada além disso. A obra inteira depende de o leitor entrar em silêncio.

---

**S01 — A CAVERNA** · Registro A · 4–5 viewports · vertical lento

Abre quase preto, sem informação. A câmera desce conforme o scroll, revelando a caverna de cima para baixo, como quem desce uma escada. Bruce é um sprite de 24px na base, de costas, diante de uma parede de monitores. A escala entre figura e ambiente é absurda de propósito — é a primeira aula de gramática que o leitor recebe.

Monitores ligam e desligam em ciclo irregular. Gotas caem em cadência amarrada ao scroll.

**Contaminação:** por volta da terceira viewport, um único monitor passa a repetir exatamente o mesmo frame a cada dois ciclos. Sem destaque, sem som, sem texto.

Texto: do início até "intenso e… Repetitivo."

Revisão: a abertura é funcional mas expositiva. "Uma caverna escura, cujo silêncio não era perpétuo" é a construção menos natural do parágrafo. Simplifique. Preserve integralmente a ideia dos monitores ligando e desligando — ela já é cinema.

---

**S02 — ALGUMA COISA ESTÁ REPETINDO** · Registro A degradando · 2 viewports · pinned

O scroll continua respondendo, mas a caverna não avança. O leitor rola e Bruce anda três passos até a bancada. Rola mais e ele anda os mesmos três passos, do mesmo ponto de partida.

Acontece **exatamente três vezes**. Na quarta ele completa o movimento e a cena solta.

**A execução decide esta cena.** Não pode parecer bug. Cada repetição avança dois ou três pixels a mais que a anterior — progride, mas quase nada. A sensação-alvo é "acho que já vi isso", nunca "o site travou". Sem texto, sem som, sem destaque.

Texto: "Sempre se sentira tranquilo com o fato de ser diferente…" até "…ir atrás de algumas respostas."

---

**S03 — IDIOTA** · Registro B · preto + vermelho · 1,5 viewport · pinned, rápido

Corte seco. O pixel desaparece. Fundo chapado, sem cenário.

Uma silhueta de Batman. Uma segunda atravessa a primeira. A cada atravessamento nasce uma cópia deslocada, e uma palavra interna de acusação reaparece — pode ser uma pergunta, não precisa ser um xingamento. Autocorreção virando autopunição.

Aqui entra Jason pela primeira vez, conforme a regra 11.

Texto: quase nenhum, de propósito. "…pensou Bruce, com os punhos firmes."

---

**S04 — A ESCOLHA DO OUVINTE** · Registro A · 2 viewports · sem pin

Volta a caverna. Respiro deliberado, quase sem motion. Depois da S03 o leitor precisa de ar.

Texto: "Preciso conversar com alguém…" até "Preciso de um 'Oráculo'!"

Revisão: Bruce explica o próprio raciocínio ao leitor em "cuja alcunha, por coincidência, é válida para casos onde homens perdidos procuram por respostas". O trocadilho funciona melhor se não for apontado — deixe a palavra Oráculo cair sozinha. O descarte do Alfred está longo; a ideia boa é o cálculo frio de que Alfred está perto demais para ser instrumento limpo. Mantenha em menos palavras.

---

**S05 — O VAZIO PRETO** · Registro B · preto + branco · 3 viewports · pinned longo

Preto absoluto. Sem cenário, sem personagem, sem interface, sem cor. Só frases surgindo em posições diferentes da tela — algumas próximas e grandes, outras distantes e pequenas. Uma ou outra desaparece antes de terminar.

Frases não entram com fade. Elas estão lá no frame seguinte.

Isso precisa transmitir intimidade e vazio, não espetáculo. A tentação será encher a tela. Não encha.

Texto: a paranoia sobre o Alfred e a transição para a base da Bárbara.

---

**S06 — BÁRBARA** · Registro A puro · longa · avanço por Enter, não por scroll

A cena mais estável e organizada da obra inteira. Dois sprites de corpo inteiro, dois retratos de 32×32, caixa de diálogo na base, texto caractere a caractere, idle mínimo, muito espaço negativo.

É a única cena em que alguém de fora está olhando para o problema. A ordem visual aqui é conforto, e o leitor precisa senti-lo para sentir a falta depois.

**Revisão — a mais importante do projeto.**

Remova o diagnóstico. Nada parecido com "Bruce, talvez você esteja sofrendo transtorno obsessivo-compulsivo". Diagnóstico fecha a cena, e Bárbara é boa demais para nomear antes de entender. Ela descreve o que reconhece: a necessidade de certeza, a checagem que acontece dentro da cabeça e não nas mãos, a responsabilidade inflada, o medo do que acontece se ele parar de pensar. A expressão "padrão obsessivo" pode aparecer uma vez, como hipótese, de leve, e nunca mais.

Remova também a menção a procurar ajuda especializada. Soa como aviso de serviço público dentro da ficção.

**A virada da cena:** em algum ponto Bárbara percebe que Bruce não foi até ela atrás de uma resposta. Ele foi porque precisava **ter certeza de que precisava de uma resposta**. Ela diz isso, curto. Bruce não responde. A cena corta.

Isso é o inverso do diagnóstico: em vez de nomear a doença, ela nomeia o movimento que ele acabou de fazer na frente dela.

---

**S07 — A MOLA** · Registro B · preto + azul elétrico · 3–4 viewports pinned · **MICROGAME 1**

O quarto se desfaz. Um Batman minúsculo sobe uma estrutura vertical repetitiva. O leitor rola, ele sobe. Rola, sobe. Rola, e ele está de volta ao ponto de partida sem ter descido.

Depois de três voltas, **a câmera se afasta** e a estrutura inteira se revela como o interior de uma cabeça. Este é o único momento da obra com revelação de câmera desse tipo. Não repita o recurso em nenhuma outra cena.

**Microgame — A Confirmação**

Uma única palavra clicável no centro:

```
CONFIRMAR → TEM CERTEZA? → VERIFICAR → E SE NÃO FOR? → CONFIRMAR NOVAMENTE
```

Cada confirmação gera a próxima. A sequência **nunca termina**. Após a quinta ou sexta, o scroll — que estava travado — volta a funcionar **em silêncio**. Sem aviso, sem dica, sem seta.

A saída não é completar. É rolar. É parar de alimentar.

**Anti-travamento:** a partir da oitava confirmação, o botão perde opacidade a cada clique e o texto da cena seguinte começa a assomar na borda inferior do viewport. Não é tutorial, é gravidade.

Texto: "Eu estou em uma espécie de loop mental…" e o trecho dos rituais.

---

**S08 — INTERLÚDIO** · limiar · meia viewport

Preto. O asterisco triplo do texto original vira imagem. É a única formatação autoral do manuscrito e merece existir na tela.

---

**S09 — ALFRED** · Registro A · âmbar quente · média · avanço por Enter

Mesma gramática da S06, enquadramento mais fechado, paleta mais quente. Bárbara foi clínica. Alfred é doméstico.

Revisão: Alfred fala como manual em "Talvez dialogar com outras pessoas lhe dê novas perspectivas para refletir sobre sua maneira de pensar". Conselho genérico, e Alfred nunca é genérico.

**Substitua por observação, não conselho:** durante anos, quando Bruce ficava calado por horas, Alfred presumiu que ele estivesse planejando. Ele acaba de entender que às vezes Bruce estava preso. Isso reposiciona Alfred como testemunha de uma vida inteira.

**Preserve exatamente, sem tocar:**
> — Eu temo que não consiga resolver isto sozinho, Alfred…
> — E não precisa.

Fim da cena: Bruce ajusta o uniforme, a conversa sobre o Coringa e a Harleen entra curta, a caverna escurece de baixo para cima.

---

**S10 — A CORRIDA** · Registro A · azul-noite + silhueta · 25–35 segundos · **JOGÁVEL**

Side-scroll. Batman correndo em silhueta sobre telhados de Gotham, parallax de três camadas. Sem HUD, sem score, sem vidas.

SPACE pula. O comando aparece uma vez, discreto, e some ao primeiro pulo.

**Função narrativa:** os obstáculos não são inimigos. São as mesmas frases da S07 aparecendo no caminho como formas. Ele não está lutando, está atravessando.

**E esta é a única cena em que a solução realmente é pular, sem armadilha e sem ironia.** O leitor precisa aprender o que é um controle honesto antes que a S18 minta para ele. **A relação S10 ↔ S18 é estrutural. Não enfraqueça nenhuma das duas e não remova nenhuma delas.**

Colisão: sem game over. A câmera volta alguns metros e ele corre de novo — o que inclusive reforça o tema. Após três colisões seguidas, o trecho fica mais fácil em silêncio. Nunca punir.

Texto: "Preciso voltar àquela casa abandonada…"

---

**S11 — O CORREDOR** · Registro A degradando · 2 viewports pinned · **travessia horizontal**

O leitor rola para baixo e a câmera anda para o lado ao longo do corredor. Janelas passando, madeira apodrecida, luz em fatias.

Coringa é sprite, pequeno, longe, no fim do corredor. Permanece pequeno durante toda a S11 e só cresce na S12.

**Preserve a piada:**
> — Retornou cedo, caro Bats! Precisava descansar? Estava machucado? Ou precisava verificar algo? O fogão ligado?!

Ela é boa porque é rasa de propósito. É o Coringa caricaturando aquilo que ele *acha* que está acontecendo. Ele ainda não entendeu o problema.

Revisão: o pensamento de Bruce que vem em seguida explica a estratégia antes de ela acontecer. Corte quase inteiro e preserve só a parte boa — se o Coringa o induz, e ele nunca concordou com o Coringa em nada, então discordar dele vira bússola.

---

**S12 — LUZES** · Registro A/C · 2 viewports pinned

Iluminação inteira amarrada ao scroll. Alguns frames completamente pretos. Quando a luz volta, o Coringa está em outra posição — nunca com movimento visível entre uma posição e outra.

**Sem jumpscare, sem susto sonoro, sem glitch.** O desconforto vem do ritmo irregular.

**Detalhe que faz a cena:** Bruce fica **um frame atrasado** em relação ao cenário. A luz muda e ele muda logo depois. Ninguém percebe conscientemente. Todo mundo sente.

Revisão: aqui o Coringa precisa parar de caricaturar e começar a acertar. Ele percebe que o problema não é checar interruptor — é não suportar que algo terrível aconteça porque Batman não pensou o suficiente. **No momento em que ele entende isso, ele para de brincar com a luz.** Isso é mais assustador do que continuar.

---

**S13 — TOC. TOC.** · Registro A · ~30 segundos · **MICROGAME 2**

O corredor congela. No centro, discreto:

```
ATENDER?
SIM        NÃO
```

**SIM** → a porta abre. Não há nada atrás dela. O corredor continua.
**NÃO** → nada acontece. O corredor continua.

Nenhuma indicação de qual era certa. Nenhuma consequência. Nenhuma ramificação. **Não existe opção certa e isso jamais é dito.**

Os dois caminhos duram o mesmo tempo, têm o mesmo peso visual, e o Coringa comenta a mesma coisa em ambos. A simetria é o que comunica intenção em vez de bug.

O valor da cena está nos dois segundos que o jogador gasta escolhendo.

---

**S14 — A LUZ TENTADORA** · limiar · preto + amarelo · 2 viewports

O corredor perde o pixel. O grid dilata até virar mancha. Bruce de joelhos, mãos no chão. Um único ponto de luz no fundo do preto.

Jason volta aqui, conforme a regra 11.

**Preserve:** "Se você ouvisse mais sua voz interior, talvez seu amiguinho Robin estivesse vivo!"

**A frase-tese da obra está neste trecho e é do autor:** "Não posso seguir a luz, se ela for meu conforto, cairei na armadilha mais uma vez." Ela deve ser a única frase da cena a aparecer grande.

**Motion:** quando ele decide não seguir a luz, **a luz não apaga**. Ela continua lá. Ele é que anda para o outro lado. Isso é muito mais preciso do que apagá-la.

---

**S15 — A FLORESTA** · Registro B · preto + verde-escuro + amarelo · 60–90s · **MICROGAME 3**

A transição acontece **durante o scroll, sem corte**: o corredor ganha vegetação, as tábuas viram troncos, as sombras verticais viram árvores. Esta continuidade é a razão técnica de existir um canvas único.

Batman vira sprite pequeno numa floresta noturna. Figuras carregando tochas caminham em procissão — sem rosto, fatigadas, silhuetas. Não interagem, não ameaçam, não olham. Só andam.

**Microgame — Seguir a luz**

← → caminha. O jogador vê pontos de luz ao longe e naturalmente vai até eles. Cada luz o traz de volta à mesma clareira. Duas ou três vezes.

Depois existe uma direção **sem luz nenhuma**. Segui-la exige caminhar de **seis a oito segundos no escuro sem nenhuma confirmação visual** de que a direção está certa.

Quem aguentar, sai.

**Este é o coração conceitual do projeto.** É incerteza convertida em mecânica. O jogo não confirma.

Regras: nenhum texto na tela durante o trecho escuro. Se o jogador voltar para as luzes, tudo bem, pode tentar de novo. Não punir, não julgar, não explicar nunca.

Texto: "Eu não posso entrar nesse ciclo, nessa floresta perdida…"

---

**S16 — BRANCO** · Registro B · branco + cinza · 2 viewports · muito lento

Branco total. Depois da floresta isso vai machucar os olhos, e deve. **Única cena de fundo claro da obra.**

Bruce criança, pequeno, no centro. Os pais distantes.

**O horror não é que eles sejam monstros. É que eles estão calmos.** Distantes, imóveis, íntegros e desapontados. Não os transforme em criaturas.

Composição: as figuras vêm de cima, a criança ocupa a base do quadro, muito espaço vazio entre eles.

Eles **não falam**. As frases de desapontamento aparecem como texto flutuante que Bruce **atribui** a eles — visualmente ligado a ele, não a eles. Depois evaporam de baixo para cima, devagar. Ele levanta a cabeça para a última olhada.

E encontra o Batman.

---

**S17 — A FIGURA** · Registro B · preto + branco · 2 viewports pinned

Sólido, enorme, simétrico. **Perfeito demais** — simetria exata, sem grão, sem desalinhamento de camada, contra um fundo que tem os dois. É a única coisa limpa da tela, e essa limpeza é sinistra justamente porque toda a obra até aqui teve grão.

**Direção de personagem, o ponto mais importante desta cena:** esta figura não é vilã. É o sistema que salvou Bruce a vida inteira, e ela **tem razão sobre o passado**. É por isso que largá-la é difícil. Se ela soar como monstro desde o início, a cena inteira se perde.

Revisão: a figura argumenta bem por três falas e depois vira chantagem emocional rápido demais. A curva precisa ser mais lenta — razoável, depois insistente, depois carente, depois grotesca. Cada degrau merece uma fala própria.

**Preserve:** "Separar-se é tão difícil quanto superar." É a melhor linha do texto original.

---

**S18 — LUTAR PIORA** · Registro B · preto + branco degradando · 60–90s · **MICROGAME CENTRAL**

O jogo oferece um comando único:

```
SPACE — atacar
```

O jogador ataca. A criatura **cresce**. Ataca de novo, cresce mais, mais rápida, mais irregular. A caixa de texto dela deforma. A tipografia perde legibilidade.

Após quatro ou cinco ataques ela diz o que precisa dizer, equivalente a: não adianta lutar, ela fica mais forte a cada golpe.

**Então, e só então, os controles se ampliam:**

```
← →
```

E a solução é andar embora.

Conforme Bruce se afasta sem voltar: ela encolhe, a voz fica distante, os contornos se desfazem, as palavras perdem legibilidade até virarem forma sem sentido, e ela vira cinza.

**Se o jogador voltar para atacar, ela recupera tamanho instantaneamente.** Sem punição, sem texto, só o fato.

**Proibido:** qualquer tela de vitória, qualquer parabéns, qualquer frase do tipo "você aprendeu a não alimentar seus pensamentos". Quando a criatura acaba, a tela fica vazia e o scroll volta. Nada mais.

**Por que este é o melhor momento da obra:** o jogo mentiu para o jogador. Ofereceu um botão e o botão era a armadilha. O jogador descobre isso do mesmo jeito que Bruce — tentando e piorando. Isso só funciona porque a S10 estabeleceu um SPACE honesto antes.

---

**S19 — LEVANTAR** · Registro B · **azul-frio → dourado** · 1,5 viewport · lento

Contraluz. Ele está de costas contra a luz, e a transformação de criança para adulto acontece **na silhueta, durante o scroll, sem corte e sem efeito**. Só a postura mudando e a escala crescendo.

**A paleta é a cena.** A progressão vai de um azul-esverdeado frio para dourado ao longo do scroll, em quatro estágios discretos e chapados — não interpolados suavemente, mas trocados como quem troca a tinta da serigrafia. A postura muda junto com a cor: encolhido, sentado, de pé de costas, de pé de frente contra a luz.

**Direção:** isso não é transformação heroica. Não tem capa esvoaçando, não tem pose, não tem trilha. É alguém que estava no chão e agora não está. A diferença entre as duas coisas é tudo.

O dourado desta cena e o do navio são as duas únicas aparições da cor na obra.

---

**S20 — O FINAL QUE ME DEIXA LIVRE** · limiar → Registro A · curta

O preto se resolve em pixel de novo. Batman ofegante no chão do corredor. O Coringa observando, e **pela primeira vez ele não está rindo**. Braços cruzados. Curioso.

**Preserve exatamente:**
> — Este não é o final perfeito.
> — É o final que me deixa livre.

**Não existe boss fight.** Nem aqui nem em lugar nenhum da obra. A batalha da noite foi a S18 e já acabou. Uma luta convencional aqui destruiria o projeto inteiro.

Fim: luzes apagam, passos correndo, o Coringa vai embora. A tela fica preta com o corredor ainda presente por um instante.

---

**S21 — ESCURO** · 1 viewport

Preto. Sem texto, sem imagem, sem interação, sem som.

O leitor rola e não acontece nada por uma tela inteira. É o único momento da obra em que o scroll não produz nada, e por isso significa alguma coisa.

Não encurte esta cena. Não coloque nada nela.

---

**S22 — MANSÃO** · Registro A suavizado · âmbar e rosa de madrugada · longa e lenta

A mansão aparece em pixel, mas diferente de tudo que veio antes: **grid maior, paleta quente, contraste baixo, sem linha dura**. O pixel amolecendo. Jardim, madrugada começando, a janela enorme.

Os textos entram mais devagar que em qualquer outra cena. Menos motion, menos input, mais espaço. A desaceleração deve ser sentida fisicamente.

Revisão: o discurso do diamante é bonito e é do autor, mas está explicado demais. **Alfred menciona o diamante e para.** Não conclui, deixa a comparação no ar e muda de assunto. Ele é inglês e é mordomo — nunca terminaria de explicar a própria metáfora, seria indelicado.

A ideia final dele fica quase intacta: nem tudo que carregamos precisa continuar junto só porque um dia protegeu.

---

**S23 — O NAVIO** · Registro B · azul-claro + branco + dourado · ~60s · **MICROGAME 5**

A mansão dissolve. Um navio impossível, pesado, baixo, entre nuvens. Carregado de caixas, baús, objetos sem nome.

Clique ou drag solta um objeto. Cada objeto que cai, o navio sobe. Devagar. **Sem quantidade certa, sem contador, sem falha possível, sem fim obrigatório.** O jogador solta quantos quiser e a cena segue quando ele parar.

**Regra absoluta: nada escrito nas caixas.** Nada de "CULPA", "MEDO", "TRAUMA". São caixas. O significado já está na ação.

**Esta é a razão de existir todo o sistema de registros.** É a primeira vez na obra que o vocabulário visual da mente — silhueta, escala livre, cor chapada, grão — não é opressivo. O mesmo idioma que significou aprisionamento, repetição, distorção e peso passa a significar espaço, altura, silêncio e leveza. Sem uma palavra de explicação.

É também a única cena com movimento ascendente contínuo. Tudo antes desceu, travou, repetiu ou andou para o lado.

---

**S24 — VOAR** · Registro B dessaturando · o quanto precisar

> — Afinal…

pausa longa

> — Um morcego também precisa voar.

Sem trilha triunfal, sem animação heroica, sem logo, sem créditos animados. A câmera continua subindo depois da frase. O navio some nas nuvens. Talvez uma silhueta pequena atravesse o quadro.

Fade. Fim.

---

**S25 — CRÉDITOS** · Registro A · rolagem lenta

Depois do fade, o preto permanece por alguns segundos. Então os créditos sobem, no registro pixel, em fonte bitmap, com espaçamento largo e cor baixa. Rolagem automática e lenta, sem música triunfal.

A piada dos créditos é a redundância. Ela funciona por acumulação, então mantenha o ritmo constante e deixe uma única linha quebrar o padrão.

```
BATMAN E A TORMENTA OBSCURA DO CAVALEIRO


HISTÓRIA ORIGINAL ......... MATHEUS HENRIQUE BOZIO
ROTEIRO ................... MATHEUS HENRIQUE BOZIO
DIREÇÃO CRIATIVA .......... MATHEUS HENRIQUE BOZIO
DIREÇÃO DE ARTE ........... MATHEUS HENRIQUE BOZIO
DIREÇÃO NARRATIVA ......... MATHEUS HENRIQUE BOZIO
GAME DESIGN ............... MATHEUS HENRIQUE BOZIO
PESQUISA DE REFERÊNCIA .... MATHEUS HENRIQUE BOZIO
CONTROLE DE QUALIDADE ..... MATHEUS HENRIQUE BOZIO
DEPARTAMENTO JURÍDICO ..... MATHEUS HENRIQUE BOZIO


ASSISTÊNCIA DE PROJETO .... CLAUDE
ASSISTÊNCIA DE PROJETO .... CHATGPT
IMPLEMENTAÇÃO ............. CLAUDE CODE


INSPIRADO, EM ESPÍRITO, POR
RAINY DAY, DE THAIS WEILLER


BATMAN, CORINGA, ALFRED PENNYWORTH,
BÁRBARA GORDON E JASON TODD SÃO
PROPRIEDADE DA DC COMICS.

ESTA É UMA OBRA DE FÃ, SEM FINS LUCRATIVOS,
FEITA POR AFETO.


TODA A ARTE DESTE PROJETO É ORIGINAL
E FOI GERADA EM CÓDIGO.


                                        FIM
```

A linha do departamento jurídico é a que quebra o padrão. Não acrescente outras piadas — uma só funciona, duas viram esquete.

Ao final, a tela fica preta e parada. Uma tecla ou clique retorna à S00.

---

## PARTE VI — REGRAS FINAIS

### 18. Princípio de motion

**Motion não decora o texto. Motion interpreta o texto.**

- Se Bruce pensa repetidamente → algo repete
- Se ele perde escala → ele diminui
- Se perde referência → a câmera perde referência
- Se busca certeza → a interface pede confirmação
- Se tenta controlar demais → o jogador recebe controles demais
- Quando aceita não controlar → a interface simplifica

### 19. Liberdade criativa

Você pode propor interações que não estão aqui. Toda interação passa por uma pergunta:

> **Esta mecânica expressa alguma coisa sobre o que Bruce está vivendo?**

Se a resposta for não, não coloque. Cinco interações memoráveis valem mais que vinte banais. Nunca adicione microgame para aumentar duração.

### 20. Escopo da V1

Mantenha **as 26 seções (S00 a S25), os cinco microgames, a corrida, a relação S10/S18, o scroll cinematográfico, as trocas de registro, o ending completo e os créditos**.

Se algo ficar tecnicamente pesado, procure execução mais simples antes de qualquer outra coisa.

> **Simplificar execução é preferível a simplificar conceito.**

### 21. Proibido

Site institucional com scroll animations. Parallax genérico. Cards. Carrosséis. Glassmorphism. Estética SaaS. Todos os textos entrando com fade-up. Partículas sem propósito. Glitch constante. Terror clichê. Excesso de vermelho. HUD. Barra de vida. Score. Moedas. Achievements. Escolhas falsas apresentadas como reais. Explicação terapêutica. Moral da história escrita. Tela de vitória em qualquer microgame. Boss fight. Diagnóstico explícito. Palavras nas caixas do navio. Arte de terceiros em qualquer forma.

### 22. Som

Opcional na V1, mas deixe a arquitetura pronta. Se implementar: gotas, hum dos monitores, passos, a batida na porta, floresta, vento do ending. Sempre com botão de mute, nunca exigido, nunca autoplay.

### 23. Critério de pronto

A V1 está pronta quando a experiência puder ser jogada do início ao fim, sem travar, sem beco sem saída, a 60fps, com os cinco microgames funcionando e o texto revisado editável em arquivo separado.

E quando alguém que a terminou puder dizer:

> "Eu não fiquei apenas lendo o que Bruce estava sentindo. Em alguns momentos, a própria interface me fez sentir a lógica na qual ele estava preso."

---

## PARTE VII — EXECUÇÃO, TESTE E PUBLICAÇÃO

Este projeto será publicado. Ele vai para o GitHub e depois para a Vercel, e outras pessoas vão jogá-lo. Trate isso como requisito, não como detalhe.

### 24. Teste local

O projeto precisa rodar com dois comandos, sem configuração manual:

```
npm install
npm run dev
```

Ao terminar cada etapa significativa, **suba o servidor de desenvolvimento e informe a URL local** para que o autor possa abrir e testar no navegador. Não entregue código sem que ele esteja rodando.

Aproveite o `hot reload` do Vite: o autor vai querer editar texto em `src/content/narrative.ts` e ver o resultado imediatamente, sem rebuild.

### 25. Repositório

Inicialize o Git desde o começo, com commits pequenos e descritivos por cena implementada. Inclua:

- `.gitignore` cobrindo `node_modules`, `dist` e `.env`
- `README.md` com o que é o projeto, como rodar, a estrutura de pastas, e onde editar o texto e as cenas
- `LICENSE` ou uma nota clara de obra de fã não comercial

### 26. Deploy na Vercel

Configure para que a Vercel funcione sem ajuste manual:

- Build command `npm run build`, output `dist`, framework Vite detectado automaticamente
- Nenhuma variável de ambiente obrigatória
- `base` do Vite compatível com deploy na raiz do domínio
- Nada de caminho absoluto de arquivo local em asset algum

### 27. Peso e carregamento

Como é uma página pública, o primeiro carregamento importa.

- **Toda a arte é gerada em código.** Não há assets de imagem para baixar, o que já resolve a maior parte do problema. Mantenha assim.
- As fontes bitmap e a sans-serif devem ser subsetadas e carregadas localmente, não por CDN externa.
- Faça code splitting por cena, com carregamento das cenas adiante enquanto o leitor lê a atual.
- O gate mobile deve ser avaliado antes de carregar qualquer parte da experiência principal.

### 28. Compartilhamento

Inclua metatags Open Graph e Twitter Card com o título completo, uma descrição curta e uma imagem de preview **gerada pelo próprio projeto** — um frame do Registro A, exportado do canvas, nunca arte de terceiros. Quando alguém colar o link, precisa parecer uma obra e não um repositório.
