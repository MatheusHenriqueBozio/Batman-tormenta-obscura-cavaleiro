# MAPA DE CENAS — v1
### Batman / TOC subjetivo — novela gráfica interativa por scroll

Documento de trabalho. Não é o prompt final do Claude Code.
Serve para você revisar **estrutura, ritmo, direção visual e gameplay** antes de qualquer linha de código.

Cada seção tem um **ID fixo**. Use o ID para pedir alterações depois ("mexe só na S12").
Os IDs não mudam mesmo que a ordem mude.

---

## 0. DECISÃO ESTRUTURAL — OS TRÊS REGISTROS

Este é o ponto que eu disse que ia te propor primeiro.

Suas referências vêm de dois mundos opostos: quadrinho pintado, expressionista, escala quebrada, cor violenta de um lado; pixel art 16-bit, grid rígido, paleta limitada, sprite pequeno do outro. Isso parece um conflito. Não é. É a gramática da obra inteira, se a gente tratar de propósito.

**Proposta: o registro visual não é decoração, é indicação de onde Bruce está.**

### REGISTRO A — MUNDO (pixel 16-bit)
Tudo que acontece fisicamente. Batcaverna, base da Bárbara, corredor da casa abandonada, Mansão Wayne.
Sprite pequeno, grid visível, paleta curta, caixa de diálogo com retrato no canto, movimento idle, cenário em camadas.

Por quê: o mundo físico é o único lugar onde Bruce ainda consegue categorizar as coisas. Ele é ordenado, quantizado, legível. Pixel art *é* ordem. É um mundo em grid.

### REGISTRO B — MENTE (pintado / abstrato / sem grid)
Tudo que acontece dentro dele. O vazio preto, o loop, a floresta, os pais, a figura do Batman.
Silhueta, alto contraste, escala impossível, sem pixel, sem grid, sem UI. Vetor, máscara, gradiente, grão.

Por quê: é exatamente onde ele perde a capacidade de organizar. A imagem também perde.

### REGISTRO C — LIMIAR (a dissolução entre os dois)
O momento da passagem. O pixel se degrada, o grid se dilata, os sprites perdem quantização e viram mancha. Ou o contrário: a mancha se resolve em pixel quando ele volta ao mundo.

Isso não é transição técnica, é evento narrativo. Toda vez que o registro muda, o leitor sente sem que ninguém explique.

### O arco dos registros

| Fase | Registro dominante |
|---|---|
| Intro Batcaverna | A com contaminação de B |
| Bárbara | A puro (o mais estável da obra) |
| Loop mental | B |
| Alfred | A |
| Corrida noturna | A |
| Corredor / Coringa | A se degradando em C |
| Floresta / Pais / Figura | B puro |
| Retorno ao corredor | C se resolvendo em A |
| Mansão | A, mas suavizado — grid maior, paleta quente, menos contraste |
| Navio | B, pela primeira vez leve |

O último B da obra é o navio. Depois de dez cenas em que a mente foi o lugar hostil, ela finalmente é o lugar bonito. Esse é o ending inteiro, resolvido só com linguagem visual.

### Consequência prática para a arte

Isso resolve boa parte do problema que eu levantei lá atrás.
- **Registro A** é gerável em código. Pixel art programática, paleta indexada, sprites simples.
- **Registro B** é gerável em código. Silhueta, máscara, gradiente, ruído, escala.
- **Suas ilustrações** deixam de ser obrigatórias e viram um recurso pontual. Sugiro reservá-las para 4 ou 5 momentos do Registro B, onde a mão humana faz diferença real: a figura do Batman se deteriorando, os pais, a floresta, o navio.

Você desenha pouco e desenha o que importa.

---

## 1. ÍNDICE DE SEÇÕES

| ID | Nome | Registro | Tipo |
|---|---|---|---|
| S01 | A caverna | A→ | leitura + motion |
| S02 | Alguma coisa está repetindo | A/C | motion |
| S03 | Idiota | B | motion |
| S04 | A escolha do ouvinte | A | leitura |
| S05 | O vazio preto | B | leitura |
| S06 | Bárbara | A | diálogo sprite |
| S07 | A mola | B | **microgame** |
| S08 | Interlúdio | C | transição |
| S09 | Alfred | A | diálogo sprite |
| S10 | A corrida | A | **jogável** |
| S11 | O corredor | A | leitura + motion |
| S12 | Luzes | A/C | motion |
| S13 | TOC. TOC. | A | **microinteração** |
| S14 | A luz tentadora | C | motion |
| S15 | A floresta | B | **microgame** |
| S16 | Branco | B | leitura |
| S17 | A figura | B | leitura + motion |
| S18 | Lutar piora | B | **microgame central** |
| S19 | Levantar | B→C | motion |
| S20 | O final que me deixa livre | A | diálogo |
| S21 | Escuro | — | silêncio |
| S22 | Mansão | A suavizado | leitura |
| S23 | O navio | B leve | **microinteração** |
| S24 | Voar | — | ending |

24 seções. 4 microgames de peso, 2 microinterações contemplativas, 1 trecho jogável de corrida.

---

## 2. SEÇÕES

---

### S01 — A CAVERNA
**Registro A, com a primeira contaminação de B**
**Duração:** 4 a 5 alturas de viewport. Scroll vertical lento.
**Referência:** `vibes_intro`

**Texto de origem:** do início até "…intenso e… Repetitivo."

**Visual:** abre quase preto. Nenhuma informação. Conforme o scroll desce, a caverna se revela de cima para baixo, como se a câmera estivesse descendo a escada. Bruce é um sprite muito pequeno na base, de costas, diante de uma parede de monitores. Escala absurda entre figura e ambiente — essa é a primeira aula de gramática que o leitor recebe.

**Motion:** monitores ligam e desligam em ciclo irregular. Gotas caem em cadência amarrada ao scroll, não ao relógio: se o leitor para de rolar, a caverna para de pingar. Isso é sutil e ninguém percebe conscientemente, mas ensina que o scroll é tempo.

**A contaminação:** por volta da terceira viewport, um dos monitores começa a repetir exatamente o mesmo frame de dois em dois ciclos. Só um. Sem destaque, sem som, sem texto.

**Revisão de texto:** a frase de abertura está funcional mas expositiva. "Uma caverna escura, cujo silêncio não era perpétuo" é a construção mais rebuscada do parágrafo e a menos natural. Vale simplificar. Preservar integralmente a ideia dos monitores que ligam e desligam, porque ela já é cinema.

---

### S02 — ALGUMA COISA ESTÁ REPETINDO
**Registro A degradando**
**Duração:** 2 viewports. Pinned.
**Referência:** `momento_loop` (lógica de fragmentação)

**Texto de origem:** "Sempre se sentira tranquilo com o fato de ser diferente… precisa ir atrás de algumas respostas."

**Visual:** a cena para. O scroll continua respondendo, mas a caverna não avança. O leitor rola e Bruce anda três passos até a bancada. Rola mais e ele anda os mesmos três passos de novo, do mesmo ponto de partida.

**Regra:** isso acontece três vezes, nunca mais. Na quarta, ele completa o movimento e a cena solta. Sem texto explicando. Sem efeito sonoro. Se o leitor não perceber, tudo bem — ele vai perceber na S07.

**Nota:** este é o momento mais fácil de errar do projeto. A tentação vai ser deixar óbvio. Não pode ser óbvio. Tem que dar a sensação de "eu acho que já vi isso" e não a de "o site travou". A distinção é o pequeno avanço: cada repetição avança dois ou três pixels a mais que a anterior. Progride, mas quase nada.

---

### S03 — IDIOTA
**Registro B**
**Duração:** 1 viewport e meia. Pinned, rápido.
**Referência:** `auto_punindo`

**Texto de origem:** "…pensou Bruce, com os punhos firmes, sabendo o quão custoso lhe seria…"
**Adição sua:** Jason Todd entra aqui.

**Visual:** corte seco. O pixel desaparece. Fundo chapado, alto contraste, sem cenário. Uma silhueta de Batman. Uma segunda silhueta atravessa a primeira. A cada atravessamento nasce uma cópia deslocada, e a palavra interna reaparece — não necessariamente "IDIOTA", pode ser uma pergunta.

**Jason:** uma das cópias, por três ou quatro frames apenas, tem a silhueta errada. Menor. Capa mais curta. E some. Não se nomeia, não se explica, não se volta a ela até a S14. Se o leitor não pegar na primeira, pega na terceira leitura, e isso é bom.

**Por que aqui:** você pediu para inserir a culpa por Jason e este é o encaixe certo. Não porque Jason causou o problema — ele não causou — mas porque este é o primeiro momento em que a obra mostra a autocobrança virando autopunição, e a culpa antiga é o combustível mais eficiente que essa lógica encontra.

**Revisão de texto:** nenhuma. Esta cena tem quase nada escrito, de propósito.

---

### S04 — A ESCOLHA DO OUVINTE
**Registro A**
**Duração:** 2 viewports. Scroll normal, sem pin.

**Texto de origem:** "Preciso conversar com alguém sobre…" até "Preciso de um 'Oráculo'!"

**Visual:** volta a caverna. Respiro. Quase nada de motion — deliberadamente. Depois da S03, o leitor precisa de ar.

**Revisão de texto:** este é o trecho que você mesmo marcou como literal demais, e você tem razão. O problema específico é que Bruce explica o próprio raciocínio para o leitor: "cuja alcunha, por coincidência, é válida para casos onde homens perdidos procuram por respostas". O trocadilho com Oráculo funciona melhor se ele não for apontado. Deixar a palavra cair sozinha e seguir.

O descarte do Alfred também está longo. A ideia boa ali é o cálculo: ele não descarta o Alfred por desconfiança, descarta porque o Alfred está perto demais para ser um instrumento limpo. Isso é frio e ótimo. Vale manter em menos palavras.

---

### S05 — O VAZIO PRETO
**Registro B**
**Duração:** 3 viewports. Pinned longo.
**Referência:** `imagem_ref_história_02` — esta é a referência mais valiosa do conjunto

**Texto de origem:** o trecho de paranoia sobre o Alfred, mais a transição para a base da Bárbara.

**Visual:** preto absoluto. Sem cenário, sem personagem, sem interface, sem cor. Só frases surgindo em posições diferentes da tela. Algumas próximas, algumas distantes e pequenas. Uma ou outra desaparece antes de terminar.

**Motion:** frases não entram com fade-up. Elas simplesmente **estão lá** no frame seguinte, como um balão em quadrinho. Essa é a diferença entre parecer site e parecer página.

**Nota de direção:** a página que você mandou tem cinco painéis pretos seguidos com um único balão flutuando. Isso é o oposto de espetáculo, e é por isso que funciona. A tentação vai ser encher. Não encher.

---

### S06 — BÁRBARA
**Registro A puro**
**Duração:** longa. Diálogo por avanço, não por scroll.
**Referência:** `imagem_referência_conversa`, `referência_estilo_do_jogo_03`

**Texto de origem:** todo o diálogo com Bárbara.

**Visual:** a cena mais estável e mais organizada da obra inteira. Sprites de corpo inteiro, dois retratos, caixa de diálogo na base, avanço por Enter ou clique. Idle mínimo. Muito espaço negativo.

**Por que estável:** porque esta é a única cena em que alguém de fora está olhando para o problema. A ordem visual aqui é conforto, e o leitor precisa sentir esse conforto para sentir a falta dele depois.

**Revisão de texto — a mais importante do projeto:**

Você marcou duas coisas e as duas estão certas.

Primeiro: "Bruce, talvez você esteja sofrendo algum tipo de transtorno obsessivo compulsivo" precisa sair. Não porque o tema deva sumir, mas porque diagnóstico fecha a cena. Bárbara é boa demais para dar nome antes de entender. Ela deve descrever o que reconhece: a necessidade de certeza, a checagem que acontece dentro da cabeça e não nas mãos, a responsabilidade inflada, o medo do que acontece se ele parar de pensar. A palavra pode aparecer uma vez, como hipótese, de leve, e nunca mais.

Segundo: você achou tosco ela dizer que ele precisa de ajuda especializada. Também acho. Soa como aviso de serviço público no meio da ficção. A saída é ela não dizer isso, e a cena terminar antes.

**A virada que eu quero propor:** em algum ponto Bárbara percebe que Bruce não foi até lá atrás de uma resposta. Ele foi até lá porque precisava ter certeza de que precisava de uma resposta. Ela diz isso, curto, e Bruce não responde. A cena corta.

Isso é o inverso do diagnóstico: em vez de nomear a doença, ela nomeia o movimento que ele acabou de fazer na frente dela. É mais inteligente, é mais Bárbara, e dói mais.

---

### S07 — A MOLA — **MICROGAME 1**
**Registro B**
**Duração:** 3 a 4 viewports pinned.
**Referência:** `momento_loop_02` (a estrutura vertical repetitiva ligada à cabeça)

**Texto de origem:** "Eu estou em uma espécie de loop mental…" e o trecho dos rituais.

**Visual:** o quarto da Bárbara se desfaz. Um Batman minúsculo sobe uma estrutura vertical repetitiva. O leitor rola, ele sobe. Rola mais, ele sobe. Rola mais, ele está de volta ao ponto de partida sem ter descido.

Depois de três voltas, **a câmera se afasta** e a estrutura inteira se revela como o interior de uma cabeça. Este é o único momento da obra em que eu faria uma revelação de câmera desse tipo, e é por isso que ela funciona.

**Microgame — A Confirmação:**

Aparece uma única palavra clicável.

```
CONFIRMAR
   ↓
TEM CERTEZA?
   ↓
VERIFICAR
   ↓
E SE NÃO FOR?
   ↓
CONFIRMAR NOVAMENTE
```

Cada confirmação gera a próxima. Nunca termina. Depois da quinta ou sexta, o botão continua ali, e o scroll — que estava travado — **volta a funcionar em silêncio**. Sem aviso, sem dica, sem seta piscando.

A saída não é completar. É rolar. É parar de alimentar.

**Risco de design:** o leitor pode não perceber que o scroll voltou e ficar preso. Mitigação: depois de oito confirmações, o botão começa a perder opacidade a cada clique, e o texto da cena, lá embaixo, começa a aparecer na borda inferior do viewport. Não é tutorial, é gravidade.

---

### S08 — INTERLÚDIO
**Registro C**
**Duração:** meia viewport. Rápido.

Preto. Uma linha de texto. Talvez só um asterisco triplo, como no seu original. Vale preservar essa marca do texto original literalmente — é a única formatação autoral que você usou e ela deve virar imagem.

---

### S09 — ALFRED
**Registro A**
**Duração:** média. Diálogo por avanço.
**Referência:** `imagem_referência_conversa`

**Texto de origem:** todo o diálogo na Batcaverna.

**Visual:** mesma gramática da S06, mas o enquadramento é mais fechado e a paleta mais quente. Bárbara foi clínica. Alfred é doméstico.

**Revisão de texto:** o trecho está bom mas o Alfred fala como manual em um ponto: "Talvez dialogar com outras pessoas, lhe dê novas perspectivas para refletir sobre sua maneira de pensar". Isso é conselho genérico e o Alfred nunca é genérico.

**Proposta:** substituir por algo que só o Alfred poderia perceber. Durante anos, quando Bruce ficava calado por horas, o Alfred presumiu que ele estivesse planejando. Ele acabou de entender que às vezes Bruce estava preso. Isso é observação, não conselho, e reposiciona o Alfred como testemunha de uma vida inteira em vez de conselheiro.

**Preservar intacto:**
> — Eu temo que não consiga resolver isto sozinho, Alfred…
> — E não precisa.

Duas linhas. É o melhor par de falas do texto. Não encostar.

**Fim da cena:** Bruce ajusta o uniforme. A conversa sobre o Coringa e a Harleen entra aqui, curta. A caverna escurece de baixo para cima.

---

### S10 — A CORRIDA — **TRECHO JOGÁVEL**
**Registro A**
**Duração:** 25 a 35 segundos.

**Texto de origem:** "Preciso voltar àquela casa abandonada…"

**Visual:** side-scroll clássico. Batman correndo em silhueta sobre telhados de Gotham. Paralaxe de três camadas. Nada de HUD, nada de score, nada de vida.

**Mecânica:** SPACE pula. Obstáculos simples. O comando aparece uma vez, discreto, e some assim que o jogador pula pela primeira vez.

**Motivo narrativo — importante:** você pediu o joguinho do dinossauro e ele precisa de razão para existir, ou vira enfeite. A razão é esta: os obstáculos não são inimigos. São as mesmas frases da S07 aparecendo no caminho como formas. Ele não está lutando, está atravessando. E é a única cena em que a solução realmente é pular, sem armadilha, sem ironia. Isso importa: o leitor precisa aprender o que é um controle honesto antes da S18 mentir para ele.

**Colisão:** sem game over. A câmera volta alguns metros e ele corre de novo. E se o jogador colidir três vezes seguidas, o trecho fica mais fácil em silêncio. Não punir.

---

### S11 — O CORREDOR
**Registro A começando a degradar**
**Duração:** 2 viewports pinned, **scroll horizontal**.

**Texto de origem:** chegada à casa, primeiro encontro com o Coringa, a piada do fogão.

**Visual:** este é um dos lugares onde o scroll vertical vira travessia horizontal. O leitor rola para baixo e a câmera anda para o lado ao longo do corredor. Janelas passando, madeira apodrecida, luz entrando em fatias.

**Coringa:** sprite. Pequeno. Longe. No fim do corredor. Ele fica pequeno durante toda a S11 e só cresce na S12.

**Preservar:**
> — Retornou cedo, caro Bats! Precisava descansar? Estava machucado? Ou precisava verificar algo? O fogão ligado?!

Manter a piada. Ela é boa porque é rasa de propósito — é o Coringa caricaturando aquilo que ele *acha* que está acontecendo. Ele ainda não entendeu o problema.

**Revisão de texto:** o pensamento do Bruce que vem logo depois ("Como imaginei, ele vai insinuar coisas a respeito pra tentar me afetar…") explica a estratégia dele antes dela acontecer. Vale cortar quase inteiro e deixar só a última parte, que é a boa: se o Coringa está me induzindo, e eu nunca concordei com ele em nada, então discordar dele é uma bússola.

---

### S12 — LUZES
**Registro A/C**
**Duração:** 2 viewports pinned.

**Texto de origem:** o Coringa ligando e desligando a luz, Bruce começando a travar.

**Visual:** a iluminação inteira do corredor amarrada ao scroll. Alguns frames completamente pretos. Quando a luz volta, o Coringa está em outra posição. Nunca com movimento visível entre uma posição e outra.

**Regra anti-clichê:** sem jumpscare, sem susto sonoro, sem glitch. O desconforto vem do ritmo irregular, não do volume.

**Detalhe que faz a cena:** Bruce fica **um frame atrasado** em relação ao cenário. A luz muda, e ele muda logo depois. Ninguém percebe conscientemente. Todo mundo sente.

**Revisão de texto:** aqui você pediu algo forte e inteligente, e é onde o Coringa precisa parar de caricaturar e começar a acertar. A virada dele: ele percebe que o problema do Bruce não é checar interruptor. É não suportar a ideia de que algo terrível aconteça porque ele não pensou o suficiente. No momento em que o Coringa entende isso, ele para de brincar com a luz. E isso é mais assustador do que continuar.

---

### S13 — TOC. TOC. — **MICROINTERAÇÃO**
**Registro A**
**Duração:** 30 segundos.

**Texto de origem:** "Coringa bate em uma das portas… — Tem alguém em casa??!!"

**Interação:** o corredor congela. No centro, discreto:

```
ATENDER?
SIM        NÃO
```

**SIM** → a porta abre. Não há nada atrás dela. O corredor continua.
**NÃO** → nada acontece. O corredor continua.

Não existe indicação de qual era certa. Não existe consequência. Não existe ramificação.

**Por que isso é bom:** é a tradução mecânica mais limpa da obra inteira. O jogador vai passar dois segundos escolhendo, e esses dois segundos de "qual é a certa?" são exatamente o que Bruce sente o tempo todo. A resposta é que a pergunta não tinha resposta e ele gastou tempo com ela mesmo assim.

**Risco:** o jogador pode achar que é um bug ou que perdeu conteúdo. Mitigação: as duas ramificações duram o mesmo tempo e têm o mesmo peso visual, e o Coringa comenta a mesma coisa nos dois casos. A simetria comunica intenção.

---

### S14 — A LUZ TENTADORA
**Registro C**
**Duração:** 2 viewports.

**Texto de origem:** "Batman começa a ter obsessões e se vê em um quadro escuro… Sim, eu vejo a luz… A saída, agh…" mais as provocações sobre Jason.

**Visual:** o corredor perde o pixel. O grid dilata até virar mancha. Bruce está de joelhos, mãos no chão. Um único ponto de luz no fundo do preto.

**Jason:** aqui a silhueta errada da S03 volta, uma vez, maior, e não some — ela fica parada no escuro enquanto o Coringa fala. Não é mostrada, é notada.

**Preservar:** "Se você ouvisse mais sua voz interior, talvez seu amiguinho Robin estivesse vivo!" — brutal e é o Coringa. Fica.

**O momento chave:** "Não posso seguir a luz, se ela for meu conforto, cairei na armadilha mais uma vez." Esta frase é a tese da obra e está no seu texto original. Vale ser a única frase da cena que aparece grande.

**Motion:** quando ele decide não seguir a luz, a luz não apaga. Ela continua lá. Ele é que anda para o outro lado. Isso é muito mais preciso do que apagar.

---

### S15 — A FLORESTA — **MICROGAME 2**
**Registro B**
**Duração:** 60 a 90 segundos.
**Referência:** `imagem_ref_história` (vegetação invasiva, figura se desfazendo), `imagem_ref_história_02` para o vazio ao redor

**Texto de origem:** "Eu não posso entrar nesse ciclo, nessa floresta perdida…"

**Visual:** o corredor ganha vegetação. As tábuas viram troncos. As sombras verticais viram árvores. A transição acontece **durante** o scroll, sem corte.

Batman vira sprite pequeno numa floresta noturna. Figuras carregando tochas caminham em procissão, sem rosto, fatigadas. Elas não interagem, não ameaçam, não olham. Só andam.

**Microgame — Seguir a luz:**

← → caminha. O jogador vê pontos de luz ao longe e naturalmente vai até eles. Cada luz o traz de volta à mesma clareira. Duas ou três vezes.

Depois, existe uma direção **sem luz nenhuma**. Escolher andar para lá significa caminhar de seis a oito segundos no escuro sem nenhuma confirmação visual de que está indo para o lugar certo.

Quem aguentar, sai.

**Isso é o coração conceitual do projeto.** É a incerteza convertida em mecânica. O jogo não confirma. E é insuportável, e é curto, e é o ponto.

**Regra:** nunca explicar. Nenhum texto na tela durante o trecho escuro. Se o jogador voltar para as luzes, tudo bem — ele pode tentar de novo. Não punir, não julgar.

---

### S16 — BRANCO
**Registro B**
**Duração:** 2 viewports. Muito lento.
**Referência:** `imagem_ref_história_03` — mas com ressalva importante

**Texto de origem:** o cenário branco, Bruce criança, os pais desapontados.

**Visual:** branco total. Depois da floresta, isso vai machucar os olhos, e deve. Bruce criança, pequeno, no centro. Os pais distantes.

**Ressalva sobre a referência:** a página que você mandou mostra Thomas e Martha como cadáveres emergindo, e é uma imagem poderosíssima, mas literal demais para esta cena. Aqui o horror não é que eles sejam monstros. É que eles estão **calmos**. Distantes, imóveis, íntegros, e desapontados.

O que eu usaria daquela página é a **composição**: as figuras vindo de cima, o Batman de costas ocupando a base do quadro, as mãos erguidas. A estrutura, não a carne.

**Motion:** eles não falam. As frases de desapontamento aparecem como texto flutuante que Bruce **atribui** a eles — visualmente ligadas a ele, não a eles. Depois evaporam de baixo para cima, devagar. Ele levanta a cabeça para pegar a última olhada.

E encontra o Batman.

---

### S17 — A FIGURA
**Registro B**
**Duração:** 2 viewports pinned.

**Texto de origem:** todo o diálogo com a figura do Batman.

**Visual:** sólido, enorme, simétrico, perfeito. Perfeito demais — simetria exata, sem ruído, sem grão, contra um fundo que tem os dois. Ele é a única coisa limpa da tela.

**Direção de personagem — o mais importante desta cena:** esta figura não é vilã. Ela é o sistema que salvou Bruce a vida inteira. Ela tem razão sobre o passado. É por isso que é difícil largar. Se ela soar como monstro desde o início, a cena perde tudo.

**Revisão de texto:** você marcou este trecho e ele precisa mesmo de trabalho. O problema é que a figura argumenta bem por três falas e depois vira chantagem emocional rápido demais ("Você está me dilacerando"). A curva deveria ser mais lenta: começa razoável, fica insistente, depois carente, depois grotesca. Cada degrau merece uma fala.

**Preservar:** "Separar-se é tão difícil quanto superar." É sua e é a melhor linha do texto.

---

### S18 — LUTAR PIORA — **MICROGAME CENTRAL**
**Registro B**
**Duração:** 60 a 90 segundos.
**Referência:** `imagem_ref_história` (a deterioração progressiva da figura ao longo dos painéis)

**Texto de origem:** o estrangulamento, "Não adianta lutar contra mim", "então vou deixá-lo ir".

**Mecânica:**

O jogo oferece um único comando.

```
SPACE — atacar
```

O jogador ataca. A criatura cresce.
Ataca de novo. Cresce mais, mais rápida, mais musculosa, mais irregular.
A caixa de texto dela começa a deformar. A tipografia perde legibilidade.

Depois de quatro ou cinco ataques, ela diz o que precisa dizer.

Então, e só então, os controles se ampliam:

```
← →
```

E a solução é andar embora.

Conforme Bruce se afasta sem voltar: ela encolhe, a voz fica distante, os contornos se desfazem, as palavras perdem legibilidade até virarem forma sem sentido, e ela vira cinza.

**Se o jogador voltar para atacar**, ela recupera tamanho. Instantaneamente. Sem punição, sem texto, só o fato.

**Nunca escrever:** nada parecido com "você aprendeu a não alimentar seus pensamentos". Nenhuma tela de vitória. Nenhum parabéns. Quando a criatura acaba, a tela simplesmente fica vazia e o scroll volta.

**Por que este é o melhor momento do projeto:** porque o jogo mentiu para o jogador. Deu um botão e o botão era a armadilha. E o jogador aprendeu isso do mesmo jeito que Bruce: tentando e piorando.

E é por isso que a S10 precisa existir antes, com um SPACE honesto. Sem aquela cena, esta aqui não tem contraste.

---

### S19 — LEVANTAR
**Registro B → C**
**Duração:** 1 viewport e meia. Lento.
**Referência:** `batman luz` — **arquivo não recebido**

**Texto de origem:** Bruce criança se levanta e é Bruce adulto.

**Visual:** contraluz. Ele está de costas, contra a luz, e a transformação de criança para adulto acontece na silhueta, durante o scroll, sem corte e sem efeito. Só a postura mudando e a escala crescendo.

**Direção:** isso não é transformação heroica. Não tem capa esvoaçando, não tem pose. É alguém que estava no chão e agora não está. A diferença entre as duas coisas é tudo.

**Pendência:** preciso do arquivo `batman luz` para fechar esta seção. Sem ele, mantenho contraluz e silhueta como plano padrão.

---

### S20 — O FINAL QUE ME DEIXA LIVRE
**Registro C se resolvendo em A**
**Duração:** curta. Deliberadamente curta.

**Texto de origem:** volta ao corredor, o Coringa de braços cruzados, as duas falas finais.

**Visual:** o preto se resolve em pixel de novo. Batman ofegante no chão do corredor. O Coringa observando — e pela primeira vez ele não está rindo. Braços cruzados. Curioso.

**Preservar exatamente:**
> — Este não é o final perfeito.
> — É o final que me deixa livre.

**Regra:** **não existe boss fight.** Nem aqui nem em lugar nenhum. A batalha da noite foi a S18 e ela já acabou. Colocar uma luta convencional aqui destruiria a obra inteira.

**Fim da cena:** luzes apagam. Passos correndo. O Coringa vai embora. A tela fica preta com o corredor ainda audível por um instante.

---

### S21 — ESCURO
**Duração:** 1 viewport de nada.

Preto. Sem texto. Sem imagem. Sem interação.

O leitor rola e não acontece nada por uma tela inteira.

É o único momento da obra em que o scroll não produz nada, e é por isso que ele significa alguma coisa. Depois de duas horas de mente barulhenta, silêncio.

---

### S22 — MANSÃO
**Registro A, suavizado**
**Duração:** longa e lenta.

**Texto de origem:** Bruce na janela, o discurso do Alfred, o diamante.

**Visual:** a mansão aparece em pixel, mas diferente de tudo que veio antes: grid maior, paleta quente, contraste baixo, sem linha dura. O pixel amolecendo. Jardim, madrugada começando, a janela enorme.

**Ritmo:** os textos entram mais devagar que em qualquer outra cena. Menos motion, menos input, mais espaço em branco. O leitor deve sentir a desaceleração fisicamente.

**Revisão de texto:** o discurso do diamante é bonito e é seu, mas está explicado demais. "É preciso que se retire tudo aquilo que a esconde, que a impede de ser de fato, uma jóia de valor" é a própria metáfora se traduzindo em voz alta.

**Proposta:** o Alfred menciona o diamante e para. Não conclui. Deixa a comparação no ar e muda de assunto. Alfred é inglês e é mordomo — ele nunca terminaria de explicar a própria metáfora, isso seria indelicado.

E a ideia final dele, que está no seu texto e é ótima, vale ficar quase intacta: nem tudo que a gente carrega precisa continuar junto só porque um dia protegeu.

---

### S23 — O NAVIO — **MICROINTERAÇÃO**
**Registro B, leve pela primeira vez**
**Duração:** 60 segundos. Sem pressa, sem falha possível.

**Texto de origem:** Bruce fecha os olhos, o navio voador, jogando peso para fora.

**Visual:** a mansão dissolve. Um navio impossível, pesado, baixo, entre nuvens. Carregado de caixas, baús, objetos sem nome.

**Interação:** clique ou drag solta um objeto. Cada objeto que cai, o navio sobe. Devagar. Não tem quantidade certa, não tem contador, não tem fim obrigatório. O jogador solta quantos quiser e a cena segue quando ele parar.

**Regra absoluta:** nada escrito nas caixas. Nada de "CULPA", "MEDO", "TRAUMA". Elas são caixas. O significado já está na ação.

**Motion:** a única cena da obra com movimento ascendente contínuo. Tudo antes desceu, travou, repetiu ou andou para o lado.

---

### S24 — VOAR
**Duração:** o quanto precisar.

> — Afinal…

pausa longa

> — Um morcego também precisa voar.

Sem trilha triunfal, sem animação heroica, sem logo. A câmera continua subindo depois da frase. O navio some nas nuvens. Talvez uma silhueta pequena atravesse o quadro.

Fade. Fim.

---

## 3. OS MICROGAMES — RESUMO

Cinco interações de peso, mais a corrida. Cada uma responde à pergunta "isso expressa alguma coisa sobre o que o Bruce está vivendo?".

| # | Seção | Nome | O que a mecânica significa |
|---|---|---|---|
| 1 | S07 | A Confirmação | Certeza é um poço sem fundo. Sair não é resolver, é parar. |
| 2 | S13 | TOC. TOC. | Escolher sem informação, e descobrir que não havia escolha. |
| 3 | S15 | A Floresta | Agir sem confirmação. Tolerar não saber. |
| 4 | S18 | Lutar Piora | O controle que ele usa contra o problema alimenta o problema. |
| 5 | S23 | O Navio | Soltar é ganho, não perda. |
| — | S10 | A Corrida | Nenhum. É o controle honesto que serve de contraste para a S18. |

**Densidade:** os cinco estão bem distribuídos ao longo do arco, com o mais pesado (S18) a três seções do fim. Nenhum dura mais de 90 segundos. Nenhum tem score, vida, moeda ou game over.

---

## 4. PENDÊNCIAS E DECISÕES ABERTAS

**1. Arquivo `batman luz` não recebido.** Bloqueia o fechamento da S19.

**2. Suas ilustrações — onde entram.** Recomendo reservá-las para no máximo cinco momentos, todos no Registro B: S16 (os pais), S17/S18 (a figura e sua deterioração), S15 (a floresta), S23 (o navio). Nas outras, o código dá conta. Se preferir zero ilustração, o projeto se sustenta inteiro em código — só perde um pouco de alma nesses cinco pontos.

Se você desenhar, preciso das camadas separadas em PNG com transparência, não cenas chapadas.

**3. Duração total.** Estimo 25 a 35 minutos de experiência completa. Isso é longo para web. Vale decidir se queremos um indicador de progresso discreto — eu tendo a achar que sim, mas ele precisa ser quase invisível, tipo uma linha fina na borda.

**4. Salvar progresso.** Se alguém sair na S15, volta do zero? Recomendo salvar o ponto, mas sem menu de capítulos. Retomar sim, pular não.

**5. Mobile.** O prompt do ChatGPT pede suporte mobile, e você tinha me dito desktop-only. Precisamos fechar isso: a S15 (caminhar no escuro) e a S18 (atacar e depois se afastar) perdem muito no touch. Minha recomendação continua sendo desktop-first com uma versão mobile reduzida, e não paridade.

---

## 5. NOTA TÉCNICA PRELIMINAR

Não é o documento técnico final, é só o registro da divergência para decidirmos antes.

O prompt do ChatGPT propõe React + TS + Vite + GSAP ScrollTrigger + Phaser. Concordo com tudo menos o Phaser.

**O problema:** olhando o mapa fechado, nenhum dos cinco microgames precisa de motor de jogo. Não há física, não há tilemap, não há colisão complexa, não há sistema de entidades. A S10 é a mais "jogo" de todas e é um pulo com detecção de retângulo. Trazer o Phaser significa um segundo runtime, um segundo loop, um segundo pipeline de asset e uma troca de contexto toda vez que o leitor entra e sai de uma cena jogável — o que aqui acontece seis vezes.

**Proposta:** React + TypeScript + Vite + GSAP ScrollTrigger para a cinematografia, e um único canvas para tudo que é gráfico — Registro A e Registro B no mesmo lugar. Assim o Batman é o mesmo objeto a obra inteira, e a S15, que precisa **transformar** o corredor em floresta sem corte, se torna trivial em vez de impossível.

Se depois de decidir isso a gente quiser Phaser em alguma cena específica, dá para acrescentar. O contrário é mais caro.

---

*Fim do mapa v1. Próximo passo depende da sua revisão: com este documento aprovado, monto o documento de direção para o Claude Code.*
