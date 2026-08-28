# Fase 6 — passada de ritmo

Feita. Esta é a passada do início ao fim que a `DIRECAO.md` §3 pede nos passos
5 e 6: calibração de duração, janela de texto e velocidade, e remoção de todo
efeito sem função narrativa. Nenhuma mecânica nova, nenhuma cena nova, nenhum
recurso visual novo.

O que estava nesta lista e foi resolvido saiu daqui. O que sobrou está no fim,
e só o autor pode fechar.

---

## O critério que passou a existir

A obra é lida rolando, e a unidade de rolagem é o clique da roda do mouse:
cerca de cem pixels, um sétimo de uma viewport de 810. Isso vira um critério
mensurável, e é a partir dele que toda esta fase foi trabalhada:

> **Nenhum bloco de texto pode durar menos que 380 caracteres por viewport de
> rolagem, com piso de 0,17 viewport para as frases curtas.**

Abaixo disso o leitor perde a frase num gesto só. Acima, ele pode encostar na
roda enquanto lê sem que o parágrafo suma. Vinte e nove blocos estavam abaixo
do piso; nenhum está mais.

O mesmo raciocínio vale para efeito temporizado por scroll: um estado que dure
menos que um gesto não é sutil, é inalcançável.

---

## O que mudou

### Durações de cena

| Cena | De | Para | Por quê |
|---|---|---|---|
| S01 | 5 | 4 | 131 caracteres por viewport, a abertura mais lenta da obra, com vãos de meia viewport entre três parágrafos — e é onde se perde leitor |
| S12 | 2 | 2,5 | o texto pedia 2,20 viewports e os cortes de luz precisavam de curso |
| S13 | 2 | 1,5 | 1,12 viewport de consequência sem texto depois da escolha |
| S14 | 4 | 6 | 1432 caracteres, o maior volume da obra, espremidos em 2,6 viewports úteis |
| S15 | 3 | 4 | dois blocos a 880 e 1924 caracteres por viewport |
| S17 | 3 | 4,5 | onze dos doze blocos abaixo do piso |
| S20 | 2 | 2,5 | seis dos sete blocos abaixo do piso |
| S24 | 3 | 2,5 | 0,60 viewport de vão e 0,96 de cauda, ambos vazios |

A obra passou de 64,5 para **68 viewports**.

### Efeito calibrado em unidade que o scroll não resolvia

- **S12 — o piscar da luz.** Os intervalos entre os cortes iam de 28 a 106
  pixels de rolagem. Um clique da roda pulava de um a três estados: o ritmo
  irregular que é a cena inteira simplesmente não chegava ao leitor. Agora vão
  de 133 a 250 pixels — o mais curto ainda maior que um gesto, o mais longo
  quase o dobro dele. Seis cortes no lugar de doze, e a irregularidade
  continua.
- **S03 — a primeira aparição do Jason.** A janela era de 0,007, oito pixels
  de rolagem. Não era sutil: era inalcançável. Está em 0,05, uns sessenta
  pixels — ainda menos que um gesto, ainda perfeitamente perdível, agora
  alcançável por quem rola devagar.
- **S25 — os créditos.** Duravam **setenta segundos**, e não os cinquenta e
  dois que esta lista supunha. Em 16 px/s duram quarenta e nove, e cada linha
  ainda cruza a tela em onze segundos. O acúmulo de que a piada precisa
  continua; o que saiu foi a espera depois dela.

### Quatro colisões que apagavam o texto

Achadas percorrendo a obra no navegador, não lendo código:

- **S17.** As falas da figura eram `center`, e a figura branca ocupa
  exatamente a faixa central. O texto era branco sobre branco: **o diálogo
  inteiro da cena era invisível.** Passaram para a direita.
- **S03.** A silhueta que atravessa varria o quadro de borda a borda e passava
  por cima da coluna de texto — vermelho apagado por vermelho. A travessia
  agora acontece dentro da metade direita, que é o que o comentário da própria
  cena já dizia que devia acontecer.
- **S14.** A luz ficava a 78% da largura e 46% da altura, em cima da coluna
  onde o Coringa fala. Subiu para o alto e para o fundo — que também é o que a
  cena diz dela.
- **S19.** A figura era desenhada a 42% da largura e o vão de luz começa em
  46%: ela caía **ao lado** da luz, preta sobre preto. Nos últimos vinte por
  cento da cena não sobrava na tela nada além de um retângulo dourado.
  Contraluz só existe se houver luz atrás.

### Efeitos removidos (§3, passo 6)

O método foi medir, não opinar: dois quadros consecutivos no mesmo ponto de
scroll, e a diferença de pixel entre eles.

- **S02 e S11 — o grão de "Registro A degradando".** Movia a imagem em 0,002
  nível de 255. Não era discreto, não acontecia. E o Registro A não admite
  transparência parcial (§5). A degradação dessas cenas já está no que elas
  fazem: uma repete, a outra apodrece.
- **S03, S07, S08, S14, S15, S18, S23 — a segunda passada de grão.** Sete
  cenas aplicavam grão duas vezes por quadro. Onde a segunda era constante,
  ela só somava à primeira e saiu. Onde ela carregava sentido — o ruído que
  sobe com o congestionamento na S03, e com os golpes na S18 — virou a
  primeira: agora a rampa percorre a faixa inteira do registro (0,05 a 0,08)
  em vez de somar 0,02 a um grão fixo que já saturava. O efeito passou a
  acontecer.
- **S07 — o grão sobre a caixa de diálogo.** A passada final caía também sobre
  a caixa, que é Registro A.
- **S23 — as quarenta linhas de textura no céu.** O comentário no código dizia
  o motivo: "para o azul não ficar morto". Ou seja, nenhum motivo narrativo. O
  céu desta cena é o único lugar largo e calmo da obra inteira, e enchê-lo de
  textura era desfazer justamente o que ele diz.
- **S16 — o fade da figura do Batman.** O comentário dizia "não entra com
  efeito nenhum. Ele estava atrás dele o tempo todo". O código fazia um fade
  de meia janela. Um fade é a figura chegando; a cena precisa dela já estando.

---

## O que foi conferido e passou

- **A curva dos microgames.** Cinco sensações distintas, sem repetição:
  compulsão que só solta quando se para de alimentar (S07), escolha simétrica
  sem resposta certa (S13), incerteza sem confirmação nenhuma (S15), a
  mecânica que mente (S18), e nenhuma exigência (S23). O S13 é o mais leve em
  esforço — um clique — e isso funciona como respiro entre o loop da
  confirmação e os sete segundos de escuro da floresta.
- **As duas aparições do dourado.** `#e8b34a` existe em exatamente duas
  paletas, P_RISE e P_SHIP. Nenhuma outra cena vazou a cor. A tocha da S15 é
  `#e8c24a`, quinze níveis de distância num canal, mas ocupa 0,03% do quadro
  contra os 24% do vão da S19 — a raridade se sustenta. Se o autor quiser
  blindar, é só puxar a tocha para o laranja.
- **A relação S10 ↔ S18.** Ficaram 22,5 viewports de distância, contra 18
  antes. O SPACE da corrida é usado dezenas de vezes ao longo de vinte e oito
  segundos: é memória motora, não memória de leitura. Esquecer a lição é o que
  a armadilha da S18 precisa; esquecer a tecla, não.
- **S06 — os avanços de Enter.** São **23 páginas**, não os 45 que esta lista
  estimava. O 45 era o pior caso, de quem aperta duas vezes por página. Vinte
  e três páginas para doze falas é a proporção normal de uma caixa de diálogo,
  e mexer nas linhas por página exigiria redesenhar a caixa — o que não é
  calibração. Fica como está.
- **S22 — as quatro viewports.** Medida, passa: os blocos ficam entre 100 e
  296 caracteres por viewport, dentro da faixa confortável da obra. A
  desaceleração mais lenta da obra é o que a cena pede. Fica.
- **§23, critério de pronto.** Percurso completo do início ao fim, em modo
  normal e em movimento reduzido, chegando a 100% da trilha, com as 26 cenas
  vistas e **zero erros de console** nos dois.
- **§23, os 60fps.** Ver abaixo — a medição anterior não se reproduz.

---

## O item de fps da varredura anterior: não se reproduz

A varredura da fase intermediária apontou cinco cenas abaixo de 60fps (S03
45,5 · S14 45,9 · S15 42,2 · S18 47,4 · S23 43,5) e avisou que o número
absoluto não estava estabelecido, porque a medição vinha de um Chromium sem
aceleração de vídeo dentro de um contêiner.

O aviso estava certo, e o desfecho é mais simples do que se supunha: **medindo
hoje, as cinco cenas dão 60fps.** E dão 60fps também no build anterior, sem
nenhuma das mudanças desta fase — o A/B foi feito com `git stash`, na mesma
máquina, na mesma sessão:

| Cena | build anterior | build desta fase |
|---|---|---|
| S03 | 60,5 | 60,4 |
| S14 | 60,4 | 60,3 |
| S15 | 60,5 | 60,3 |
| S17 | 60,4 | 60,4 |
| S18 | 60,5 | 60,3 |
| S23 | 60,5 | 60,3 |

Ou seja: **os números da varredura anterior eram do contêiner, não da obra.**
As remoções desta fase não consertaram um gargalo — não havia gargalo a
consertar nesta máquina. Elas saíram por não terem função narrativa, que é o
que o passo 6 pede, e a economia de passadas de tela é um efeito colateral bem
-vindo e não uma justificativa.

O que continua valendo do aviso anterior: **medir na máquina de verdade.** A
diferença é que agora não há nada específico para procurar.

---

## O que ficou para o autor

1. **S14 em seis viewports.** Na Fase 3 o autor confirmou as quatro e pediu
   para reavaliar com a obra montada. A medição diz seis: são 1432 caracteres,
   o maior volume de texto de qualquer cena, e em quatro viewports dezessete
   blocos dividiam 2,6 viewports úteis — cada fala do Coringa durava um clique
   da roda. É a única mudança desta fase que revisa um número já aprovado.
   Voltar é uma linha.

2. **O comprimento real, em minutos.** São 68 viewports de rolagem, 13.278
   caracteres entre narração e diálogo — cerca de treze minutos de leitura
   atenta —, mais os cinco microgames e quarenta e nove segundos de créditos.
   O mapa estimava 25 a 35 minutos; o piso parece plausível e o teto não.
   Só uma leitura de verdade fecha isso, e é exatamente o que o teste no
   preview é.

3. **Onde o leitor cansa.** Nenhuma medição responde. É a única coisa nesta
   lista que precisa de alguém lendo do começo ao fim sem pular.
