/**
 * O texto da obra, por cena — DIRECAO.md Parte III.
 *
 * A fonte é `TEXTO-REVISADO.md`, na raiz: a revisão 90/10 aprovada pelo autor.
 * Todo o texto abaixo veio de lá sem alteração de uma única palavra. Se editar
 * aqui, edite lá também — as duas versões precisam continuar iguais.
 *
 * Este arquivo existe para que qualquer parágrafo possa ser editado sem tocar
 * em componente visual. O Vite recarrega sozinho: não há rebuild.
 *
 * As direções de cena do original ("*Sem texto.*", "*Durante o microgame.*")
 * não são texto que o leitor lê — são instruções de montagem. Por isso ficam
 * como comentário aqui, e não como dado: assim não há como exibi-las por
 * engano.
 *
 * As cenas ainda não implementadas já estão com o texto no lugar, mas com
 * janelas de progresso provisórias, marcadas como tal. Afinar uma janela é
 * trabalho da fase que constrói a cena, e não mexe no texto.
 *
 * Fora daqui: os diálogos em caixa (S06, S07, S09) estão em `dialogue.ts`, e o
 * asterisco triplo da S08 é desenhado pela cena, porque ali ele vira imagem.
 */

/** narração é voz do narrador, pensamento é interno, fala é dita em voz alta. */
export type LineKind = 'narracao' | 'pensamento' | 'fala';

export interface NarrativeLine {
  readonly kind: LineKind;
  readonly text: string;
}

export type TextRegister = 'A' | 'B';

export interface NarrativeBlock {
  /** Identificador estável do bloco. A cena é o prefixo. */
  readonly id: string;
  /** ID da cena a que o bloco pertence (S00–S25). */
  readonly scene: string;
  /** Janela de progresso da cena em que o bloco está presente, de 0 a 1. */
  readonly from: number;
  readonly to: number;
  /** O registro decide a tipografia: monoespaçada no A, sans pesada no B. */
  readonly register: TextRegister;
  /** Posição em coluna, para o texto corrido do Registro A. */
  readonly place?: 'left' | 'center' | 'right';
  /**
   * Posição livre em porcentagem do viewport, para as frases soltas do
   * Registro B — algumas próximas e grandes, outras distantes e pequenas.
   */
  readonly at?: { readonly x: number; readonly y: number };
  /** Escala da frase no Registro B. */
  readonly size?: 'p' | 'm' | 'g';
  readonly lines: readonly NarrativeLine[];
}

export const NARRATIVE: readonly NarrativeBlock[] = [
  // ---------------------------------------------------------------------
  // S01
  // ---------------------------------------------------------------------
  {
    id: 'S01-a',
    scene: 'S01',
    from: 0.1,
    to: 0.34,
    register: 'A',
    place: 'left',
    lines: [
      { kind: "narracao", text: "Bruce estava pensativo em seu quartel general. A caverna era escura, e o silêncio nunca era completo: as paredes rochosas e úmidas faziam seus próprios ruídos, e gotas d'água caíam no rio que corria para a saída." },
    ],
  },
  {
    id: 'S01-b',
    scene: 'S01',
    from: 0.4,
    to: 0.66,
    register: 'A',
    place: 'left',
    lines: [
      { kind: "narracao", text: "Seu rosto era coberto pela luz de dezenas de monitores em azul claro, que ligavam e desligavam sutilmente. Foi em um desses intervalos que ele se deu conta de que vinha sendo perturbado por pensamentos intrusos havia tempo demais para que aquilo fosse normal." },
    ],
  },
  {
    id: 'S01-c',
    scene: 'S01',
    from: 0.74,
    to: 1,
    register: 'A',
    place: 'left',
    lines: [
      { kind: "narracao", text: "Angústia e incerteza. Sempre tivera planos e padrões de contingência para qualquer desafio em missão, mas nos últimos tempos vinha notando algo diferente. Mais intenso. E... repetitivo." },
    ],
  },

  // ---------------------------------------------------------------------
  // S02
  // ---------------------------------------------------------------------
  {
    id: 'S02-a',
    scene: 'S02',
    from: 0.05,
    to: 0.45,
    register: 'A',
    place: 'left',
    lines: [
      { kind: "narracao", text: "Sempre se sentira tranquilo por ser diferente dos colegas de profissão. Entre os membros da Liga, sua maneira de viver e de pensar era a exceção, e isso nunca o incomodou." },
    ],
  },
  {
    id: 'S02-b',
    scene: 'S02',
    from: 0.7,
    to: 0.98,
    register: 'A',
    place: 'left',
    lines: [
      { kind: "narracao", text: "Mas naquela noite, num estalo, Wayne percebeu que precisava de respostas antes de chegar a qualquer conclusão." },
    ],
  },

  // ---------------------------------------------------------------------
  // S03
  // Direção de cena: Cena quase sem texto. Fragmentos aparecendo e sendo atravessados.
  // ---------------------------------------------------------------------
  {
    id: 'S03-a',
    scene: 'S03',
    from: 0.08,
    to: 0.24,
    register: 'B',
    at: { x: 24, y: 28 },
    size: 'g',
    lines: [
      { kind: "pensamento", text: "\"Você verificou.\"" },
    ],
  },
  {
    id: 'S03-b',
    scene: 'S03',
    from: 0.26,
    to: 0.42,
    register: 'B',
    at: { x: 30, y: 56 },
    size: 'm',
    lines: [
      { kind: "pensamento", text: "\"Verificou o suficiente?\"" },
    ],
  },
  {
    id: 'S03-c',
    scene: 'S03',
    from: 0.44,
    to: 0.6,
    register: 'B',
    at: { x: 27, y: 74 },
    size: 'm',
    lines: [
      { kind: "pensamento", text: "\"E se tivesse verificado mais uma vez.\"" },
    ],
  },
  {
    id: 'S03-d',
    scene: 'S03',
    from: 0.62,
    to: 0.78,
    register: 'B',
    at: { x: 21, y: 40 },
    size: 'g',
    lines: [
      { kind: "pensamento", text: "\"Uma vez a mais.\"" },
    ],
  },
  {
    id: 'S03-e',
    scene: 'S03',
    from: 0.8,
    to: 0.96,
    register: 'B',
    at: { x: 28, y: 30 },
    size: 'g',
    lines: [
      { kind: "pensamento", text: "\"Uma vez teria bastado.\"" },
    ],
  },

  // ---------------------------------------------------------------------
  // S04
  // ---------------------------------------------------------------------
  {
    id: 'S04-a',
    scene: 'S04',
    from: 0.06,
    to: 0.3,
    register: 'A',
    place: 'left',
    lines: [
      { kind: "pensamento", text: "\"Preciso conversar com alguém. Expondo minhas ideias, recebo o contraste do ouvinte. Fica mais fácil discernir o que é saudável e o que não é.\"" },
    ],
  },
  {
    id: 'S04-b',
    scene: 'S04',
    from: 0.32,
    to: 0.46,
    register: 'A',
    place: 'left',
    lines: [
      { kind: "narracao", text: "Pensou Bruce, com os punhos firmes, sabendo o quanto lhe custaria expor aquilo a terceiros." },
    ],
  },
  {
    id: 'S04-c',
    scene: 'S04',
    from: 0.5,
    to: 0.76,
    register: 'A',
    place: 'left',
    lines: [
      { kind: "pensamento", text: "\"Alguém de confiança. Alfred, talvez... Não. Ele está perto demais. Eu não conseguiria separar o que ele me diria daquilo que ele já sabe de mim. Preciso de alguém que também atue comigo em missão.\"" },
    ],
  },
  {
    id: 'S04-d',
    scene: 'S04',
    from: 0.84,
    to: 1.0,
    register: 'A',
    place: 'left',
    lines: [
      { kind: "pensamento", text: "\"Preciso de um Oráculo.\"" },
    ],
  },

  // ---------------------------------------------------------------------
  // S05
  // Direção de cena: Frases isoladas no preto, em posições e escalas diferentes.
  // ---------------------------------------------------------------------
  {
    id: 'S05-a',
    scene: 'S05',
    from: 0.05,
    to: 0.19,
    register: 'B',
    at: { x: 26, y: 34 },
    size: 'm',
    lines: [
      { kind: "pensamento", text: "\"Alfred pode ter percebido.\"" },
    ],
  },
  {
    id: 'S05-b',
    scene: 'S05',
    from: 0.21,
    to: 0.33,
    register: 'B',
    at: { x: 62, y: 22 },
    size: 'p',
    lines: [
      { kind: "pensamento", text: "\"Se percebeu, sabe há quanto tempo.\"" },
    ],
  },
  {
    id: 'S05-c',
    scene: 'S05',
    from: 0.36,
    to: 0.54,
    register: 'B',
    at: { x: 34, y: 58 },
    size: 'g',
    lines: [
      { kind: "pensamento", text: "\"Ele veria uma coisa que eu não consigo ver.\"" },
    ],
  },
  {
    id: 'S05-d',
    scene: 'S05',
    from: 0.56,
    to: 0.7,
    register: 'B',
    at: { x: 60, y: 70 },
    size: 'm',
    lines: [
      { kind: "pensamento", text: "\"Como eu apareço para quem me olha de fora.\"" },
    ],
  },
  {
    id: 'S05-e',
    scene: 'S05',
    from: 0.74,
    to: 0.8,
    register: 'B',
    at: { x: 50, y: 42 },
    size: 'p',
    lines: [
      { kind: "pensamento", text: "\"Depois.\"" },
    ],
  },
  {
    id: 'S05-f',
    scene: 'S05',
    from: 0.86,
    to: 0.98,
    register: 'B',
    at: { x: 44, y: 50 },
    size: 'g',
    lines: [
      { kind: "pensamento", text: "\"Primeiro a visita.\"" },
    ],
  },

  // ---------------------------------------------------------------------
  // S11
  // ---------------------------------------------------------------------
  {
    id: 'S11-a',
    scene: 'S11',
    from: 0.04,
    to: 0.3,
    register: 'A',
    place: 'left',
    lines: [
      { kind: "narracao", text: "Batman retornou ao refúgio do Coringa, uma casa caindo aos pedaços e prestes a desmoronar. Em um dos corredores, cercado de janelas, acabou encontrando-o. Da forma mais elegante possível para um maníaco, o palhaço o recebeu com reverência." },
    ],
  },
  {
    id: 'S11-b',
    scene: 'S11',
    from: 0.38,
    to: 0.68,
    register: 'A',
    place: 'left',
    lines: [
      { kind: "fala", text: "— Retornou cedo, caro Bats! Precisava descansar? Estava machucado? Ou precisava verificar algo? O fogão ligado?! — disse, em tom de deboche." },
    ],
  },
  {
    id: 'S11-c',
    scene: 'S11',
    from: 0.74,
    to: 0.98,
    register: 'A',
    place: 'left',
    lines: [
      { kind: "pensamento", text: "\"Nunca concordei com esse verme em nada. Se ele insistir em me induzir ao erro, melhor para mim.\"" },
    ],
  },

  // ---------------------------------------------------------------------
  // S12
  // ---------------------------------------------------------------------
  {
    id: 'S12-a',
    scene: 'S12',
    from: 0.03,
    to: 0.16,
    register: 'A',
    place: 'left',
    lines: [
      { kind: "narracao", text: "O Coringa começou a ligar e desligar freneticamente a luz do lugar, fazendo alusão às manias dos pacientes enquanto ria." },
    ],
  },
  {
    id: 'S12-b',
    scene: 'S12',
    from: 0.19,
    to: 0.33,
    register: 'A',
    place: 'left',
    lines: [
      { kind: "fala", text: "— Vamos, Batman, você sabe que precisa fazê-lo, é o certo. Pense na catástrofe que será não atender às suas manias! — proliferava o psicopata com veemência." },
    ],
  },
  {
    id: 'S12-c',
    scene: 'S12',
    from: 0.36,
    to: 0.55,
    register: 'A',
    place: 'left',
    lines: [
      { kind: "narracao", text: "O ato em si era bobo. Mas na mente de Batman, no meio da tensão, algo mais perigoso se formava. O morcego se via de novo em um loop de questões." },
    ],
  },
  {
    id: 'S12-d',
    scene: 'S12',
    from: 0.6,
    to: 0.7,
    register: 'A',
    place: 'left',
    lines: [
      { kind: "narracao", text: "Então o Coringa parou. A luz ficou acesa." },
    ],
  },
  {
    id: 'S12-e',
    scene: 'S12',
    from: 0.73,
    to: 0.84,
    register: 'A',
    place: 'left',
    lines: [
      { kind: "fala", text: "— Não é isso, é? — disse, quase decepcionado. — Não é a luz. Não é a porta. Não é o fogão." },
    ],
  },
  {
    id: 'S12-f',
    scene: 'S12',
    from: 0.86,
    to: 0.9,
    register: 'A',
    place: 'left',
    lines: [
      { kind: "narracao", text: "Ele sorriu devagar." },
    ],
  },
  {
    id: 'S12-g',
    scene: 'S12',
    from: 0.93,
    to: 0.99,
    register: 'A',
    place: 'left',
    lines: [
      { kind: "fala", text: "— É que alguma coisa horrível pode acontecer porque você não pensou o suficiente." },
    ],
  },

  // ---------------------------------------------------------------------
  // S13
  // Direção de cena: A pergunta na tela: ATENDER? SIM / NÃO. As duas escolhas seguem igual.
  // ---------------------------------------------------------------------
  {
    id: 'S13-a',
    scene: 'S13',
    from: 0.02,
    to: 0.16,
    register: 'A',
    place: 'left',
    lines: [
      { kind: "narracao", text: "O Coringa bateu em uma das portas do estabelecimento." },
    ],
  },
  {
    id: 'S13-b',
    scene: 'S13',
    from: 0.19,
    to: 0.28,
    register: 'A',
    place: 'left',
    lines: [
      { kind: "narracao", text: "Toc. Toc." },
    ],
  },
  {
    id: 'S13-c',
    scene: 'S13',
    from: 0.31,
    to: 0.44,
    register: 'A',
    place: 'left',
    lines: [
      { kind: "fala", text: "— Tem alguém em casa?! — proferiu o palhaço. — Há há há há! Olha quem chegou, Bats!" },
    ],
  },

  // ---------------------------------------------------------------------
  // S14
  // ---------------------------------------------------------------------
  {
    id: 'S14-a',
    scene: 'S14',
    from: 0.34,
    to: 0.38,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "narracao", text: "Batman estava ansioso e começou a sentir o corpo queimar. No cenário escuro em que se encontrava, enxergou uma luz. Sentiu alívio. A compulsão estava próxima." },
    ],
  },
  {
    id: 'S14-b',
    scene: 'S14',
    from: 0.388,
    to: 0.412,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "pensamento", text: "\"Sim, eu vejo a luz. A saída...\"" },
    ],
  },
  {
    id: 'S14-c',
    scene: 'S14',
    from: 0.42,
    to: 0.447,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "narracao", text: "Havia uma tentação muito forte. Foi quando ele percebeu." },
    ],
  },
  {
    id: 'S14-d',
    scene: 'S14',
    from: 0.455,
    to: 0.486,
    register: 'B',
    at: { x: 50, y: 26 },
    size: 'g',
    lines: [
      { kind: "pensamento", text: "\"Não posso seguir a luz. Se ela for meu conforto, cairei na armadilha mais uma vez.\"" },
    ],
  },
  {
    id: 'S14-e',
    scene: 'S14',
    from: 0.494,
    to: 0.52,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "narracao", text: "Ele se viu no vazio, sem atender à obsessão." },
    ],
  },
  {
    id: 'S14-f',
    scene: 'S14',
    from: 0.528,
    to: 0.568,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "pensamento", text: "\"Eu tenho que partir daqui, e pisar neste invisível. Combater a própria insegurança. A cura pode matar, mas é melhor que a doença. Que o medo. Vamos. Prossiga.\"" },
    ],
  },
  {
    id: 'S14-g',
    scene: 'S14',
    from: 0.576,
    to: 0.611,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "narracao", text: "O palhaço soltava gargalhadas ofegantes, observando seu ouvinte em agonia. Batman estava de joelhos, com as mãos no chão." },
    ],
  },
  {
    id: 'S14-h',
    scene: 'S14',
    from: 0.619,
    to: 0.657,
    register: 'B',
    place: 'right',
    lines: [
      { kind: "fala", text: "— Há há há há. Batman, você é a piada da vez! Vamos, deixe de ser imperfeito e desleixado. Você precisa controlar tudo. — exclamava, eufórico." },
    ],
  },
  {
    id: 'S14-i',
    scene: 'S14',
    from: 0.665,
    to: 0.695,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "pensamento", text: "\"Devo seguir minha intuição? Geralmente sou bem sucedido em minhas missões...\"" },
    ],
  },
  {
    id: 'S14-j',
    scene: 'S14',
    from: 0.703,
    to: 0.744,
    register: 'B',
    place: 'right',
    lines: [
      { kind: "fala", text: "— Se você ouvisse mais sua voz interior, talvez seu amiguinho Robin estivesse vivo! — respondia o palhaço em êxtase ao ver o mal que estava causando ao arquirrival." },
    ],
  },
  {
    id: 'S14-k',
    scene: 'S14',
    from: 0.752,
    to: 0.782,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "pensamento", text: "\"Não... Não mencione ele... Jason... As pessoas com quem eu falhei... Meus pais...\"" },
    ],
  },
  {
    id: 'S14-l',
    scene: 'S14',
    from: 0.79,
    to: 0.821,
    register: 'B',
    place: 'right',
    lines: [
      { kind: "fala", text: "— Você é tão louco quanto eu, Bats. Talvez devesse me fazer companhia no asilo, há há há!" },
    ],
  },
  {
    id: 'S14-m',
    scene: 'S14',
    from: 0.829,
    to: 0.85,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "pensamento", text: "\"...\"" },
    ],
  },
  {
    id: 'S14-n',
    scene: 'S14',
    from: 0.858,
    to: 0.893,
    register: 'B',
    place: 'right',
    lines: [
      { kind: "fala", text: "— Você é o Batman. Ele sempre dá conta de tudo, pensa em tudo. Vamos, resolva mais essa. Não deixe o problema ir!" },
    ],
  },
  {
    id: 'S14-o',
    scene: 'S14',
    from: 0.901,
    to: 0.921,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "pensamento", text: "\"...\"" },
    ],
  },
  {
    id: 'S14-p',
    scene: 'S14',
    from: 0.929,
    to: 0.961,
    register: 'B',
    place: 'right',
    lines: [
      { kind: "fala", text: "— Você sabe o que de ruim vai acontecer, e está fadado a falhar. Vamos, sucumba, seu imbecil!" },
    ],
  },
  {
    id: 'S14-q',
    scene: 'S14',
    from: 0.969,
    to: 0.99,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "pensamento", text: "\"...\"" },
    ],
  },

  // ---------------------------------------------------------------------
  // S15
  // Janelas provisórias: a cena ainda não existe. Serão afinadas na fase
  // que implementar esta cena, sem tocar no texto.
  // ---------------------------------------------------------------------
  {
    id: 'S15-a',
    scene: 'S15',
    from: 0.02,
    to: 0.105,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "pensamento", text: "\"Eu não posso entrar nesse ciclo. Nessa floresta perdida.\"" },
    ],
  },
  {
    id: 'S15-b',
    scene: 'S15',
    from: 0.145,
    to: 0.23,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "narracao", text: "Batman se viu em uma floresta à noite, andando entre almas perdidas em um loop eterno. Tochas eram seguradas por aquelas calamidades, cuja face era a miséria." },
    ],
  },
  {
    id: 'S15-c',
    scene: 'S15',
    from: 0.27,
    to: 0.355,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "pensamento", text: "\"Preciso sair daqui. Preciso me reerguer e não dar ouvido a esses pensamentos.\"" },
    ],
  },
  {
    id: 'S15-d',
    scene: 'S15',
    from: 0.395,
    to: 0.48,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "fala", text: "— É sua responsabilidade, Batman. Atenda ao chamado. — continuava a provocá-lo." },
    ],
  },
  {
    id: 'S15-e',
    scene: 'S15',
    from: 0.52,
    to: 0.605,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "pensamento", text: "\"... Não.\"" },
    ],
  },
  {
    id: 'S15-f',
    scene: 'S15',
    from: 0.645,
    to: 0.73,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "narracao", text: "Ao perceber a resistência do morcego, o Coringa passou a inverter o jogo." },
    ],
  },
  {
    id: 'S15-g',
    scene: 'S15',
    from: 0.77,
    to: 0.855,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "fala", text: "— Sabe, morcego, acho que é melhor se desapegar disso mesmo. É o caminho mais fácil, não é? — disse. — Seria muito mais difícil, e digamos, corajoso da sua parte, mergulhar nisso tudo e resolver. É o que eu faria. Quem sabe desta vez você acaba concordando comigo." },
    ],
  },
  {
    id: 'S15-h',
    scene: 'S15',
    from: 0.895,
    to: 0.98,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "pensamento", text: "\"Ele me induz de novo à tentação de querer controlar tudo. De mergulhar nesse oceano de pensamentos, nessa lógica obsessiva que me obriga a resolver cada incerteza, uma por uma. Cujo castigo é a tragédia, caso eu não cumpra as tarefas. Isso não pode ser verdade. Eu não preciso ter todo esse controle. Não é assim que as coisas funcionam. E mesmo tentando pensar com clareza, é difícil enxergar a razão.\"" },
    ],
  },

  // ---------------------------------------------------------------------
  // S16
  // Janelas provisórias: a cena ainda não existe. Serão afinadas na fase
  // que implementar esta cena, sem tocar no texto.
  // ---------------------------------------------------------------------
  {
    id: 'S16-a',
    scene: 'S16',
    from: 0.02,
    to: 0.18,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "narracao", text: "Batman se viu tentado mais uma vez a adentrar sua ideia de obsessão. Desta vez, em um cenário branco, com seus pais o encarando, desapontados." },
    ],
  },
  {
    id: 'S16-b',
    scene: 'S16',
    from: 0.22,
    to: 0.38,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "narracao", text: "Nesta cena, ele é Bruce. Bruce criança, ainda não treinado para se tornar um símbolo de resistência, que lamenta muito por tudo que aconteceu de ruim até ali." },
    ],
  },
  {
    id: 'S16-c',
    scene: 'S16',
    from: 0.42,
    to: 0.58,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "narracao", text: "As figuras dos pais se esvaem. Evaporam." },
    ],
  },
  {
    id: 'S16-d',
    scene: 'S16',
    from: 0.62,
    to: 0.78,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "narracao", text: "Ele ergue a cabeça ao perceber que estão indo embora, para aproveitar a última chance de olhá-los." },
    ],
  },
  {
    id: 'S16-e',
    scene: 'S16',
    from: 0.82,
    to: 0.98,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "narracao", text: "E então percebe a própria figura do Batman o encarando." },
    ],
  },

  // ---------------------------------------------------------------------
  // S17
  // Janelas provisórias: a cena ainda não existe. Serão afinadas na fase
  // que implementar esta cena, sem tocar no texto.
  // ---------------------------------------------------------------------
  {
    id: 'S17-a',
    scene: 'S17',
    from: 0.02,
    to: 0.063,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "fala", text: "— Você sabe que é o certo. Você sabe o que é certo. — disse a figura do Batman, imponente e sólida." },
    ],
  },
  {
    id: 'S17-b',
    scene: 'S17',
    from: 0.103,
    to: 0.147,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "pensamento", text: "\"Mas eu não posso mais carregar esse fardo.\"" },
    ],
  },
  {
    id: 'S17-c',
    scene: 'S17',
    from: 0.187,
    to: 0.23,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "fala", text: "— Há quanto tempo estamos nisso? E tudo sempre se resolveu, dentro do possível. Olha aonde chegamos. Não vai jogar fora esse nosso esquema assim do nada, depois de tantos anos. Seria um prejuízo imenso. — disse a figura, num tom autoritário." },
    ],
  },
  {
    id: 'S17-d',
    scene: 'S17',
    from: 0.27,
    to: 0.313,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "pensamento", text: "\"Eu não posso mais. Tenho o direito de não compactuar mais com isso.\"" },
    ],
  },
  {
    id: 'S17-e',
    scene: 'S17',
    from: 0.353,
    to: 0.397,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "fala", text: "— Eu te avisei de coisas que ninguém te avisou. Eu te fiz sobreviver a noites que teriam matado qualquer outro. Você sabe disso." },
    ],
  },
  {
    id: 'S17-f',
    scene: 'S17',
    from: 0.437,
    to: 0.48,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "pensamento", text: "\"...\"" },
    ],
  },
  {
    id: 'S17-g',
    scene: 'S17',
    from: 0.52,
    to: 0.563,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "fala", text: "— Você vai se arrepender. E quando se arrepender, vai voltar. Você sempre volta." },
    ],
  },
  {
    id: 'S17-h',
    scene: 'S17',
    from: 0.603,
    to: 0.647,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "narracao", text: "A figura do Batman foi se transformando aos poucos numa mancha bizarra, pedindo de forma miserável que Bruce olhasse para ela." },
    ],
  },
  {
    id: 'S17-i',
    scene: 'S17',
    from: 0.687,
    to: 0.73,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "fala", text: "— Olha o que você está fazendo com a gente. Fugindo assim do problema! Isso não é digno, não é uma superação. Você está me dilacerando. Depois de tudo... — dizia a criatura, com uma voz mais rouca e mórbida." },
    ],
  },
  {
    id: 'S17-j',
    scene: 'S17',
    from: 0.77,
    to: 0.813,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "narracao", text: "\"Separar-se é tão difícil quanto superar.\" — retrucou Bruce, exausto, mas aos poucos recobrando a força." },
    ],
  },
  {
    id: 'S17-k',
    scene: 'S17',
    from: 0.853,
    to: 0.897,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "pensamento", text: "\"Me deixe em paz!\"" },
    ],
  },
  {
    id: 'S17-l',
    scene: 'S17',
    from: 0.937,
    to: 0.98,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "fala", text: "— Cada vez que não me ouve, você fracassa. Você mesmo vai evidenciar isso... — tentava ainda a criatura persuadi-lo." },
    ],
  },

  // ---------------------------------------------------------------------
  // S18
  // Janelas provisórias: a cena ainda não existe. Serão afinadas na fase
  // que implementar esta cena, sem tocar no texto.
  // ---------------------------------------------------------------------
  {
    id: 'S18-a',
    scene: 'S18',
    from: 0.02,
    to: 0.057,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "pensamento", text: "\"Chega!\"" },
    ],
  },
  {
    id: 'S18-b',
    scene: 'S18',
    from: 0.097,
    to: 0.134,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "narracao", text: "Bruce levanta-se aos poucos. Dessa vez não está mais como uma criança, e sim em uma versão adulta. Ele se ergue, caminha lentamente até sua figura de Batman, e a pega pelo pescoço." },
    ],
  },
  {
    id: 'S18-c',
    scene: 'S18',
    from: 0.174,
    to: 0.211,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "pensamento", text: "\"Eu sinto muito.\"" },
    ],
  },
  {
    id: 'S18-d',
    scene: 'S18',
    from: 0.251,
    to: 0.288,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "narracao", text: "Ele estrangula Batman." },
    ],
  },
  {
    id: 'S18-e',
    scene: 'S18',
    from: 0.328,
    to: 0.365,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "pensamento", text: "\"Eu tenho que acabar comigo mesmo, em função de prosseguir.\"" },
    ],
  },
  {
    id: 'S18-f',
    scene: 'S18',
    from: 0.405,
    to: 0.442,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "narracao", text: "Batman, em sua forma bizarra, começa a se enrijecer. A ficar musculoso." },
    ],
  },
  {
    id: 'S18-g',
    scene: 'S18',
    from: 0.482,
    to: 0.518,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "fala", text: "— Não adianta lutar contra mim. Eu fico mais forte cada vez que você me bate. — dizia a figura, cada vez mais monstruosa." },
    ],
  },
  {
    id: 'S18-h',
    scene: 'S18',
    from: 0.558,
    to: 0.595,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "pensamento", text: "\"Está certo. Então vou deixá-lo ir.\"" },
    ],
  },
  {
    id: 'S18-i',
    scene: 'S18',
    from: 0.635,
    to: 0.672,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "narracao", text: "Bruce dá as costas para a coisa e põe-se a caminhar, fazendo-a ficar cada vez mais esguia e fraca." },
    ],
  },
  {
    id: 'S18-j',
    scene: 'S18',
    from: 0.712,
    to: 0.749,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "fala", text: "— Seu idiota! Olhe para mim! Olhe para mim!" },
    ],
  },
  {
    id: 'S18-k',
    scene: 'S18',
    from: 0.789,
    to: 0.826,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "narracao", text: "E passa a obliterar-se em cinzas." },
    ],
  },
  {
    id: 'S18-l',
    scene: 'S18',
    from: 0.866,
    to: 0.903,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "pensamento", text: "\"Adeus.\"" },
    ],
  },
  {
    id: 'S18-m',
    scene: 'S18',
    from: 0.943,
    to: 0.98,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "pensamento", text: "\"...\"" },
    ],
  },

  // ---------------------------------------------------------------------
  // S20
  // Janelas provisórias: a cena ainda não existe. Serão afinadas na fase
  // que implementar esta cena, sem tocar no texto.
  // ---------------------------------------------------------------------
  {
    id: 'S20-a',
    scene: 'S20',
    from: 0.02,
    to: 0.123,
    register: 'A',
    place: 'left',
    lines: [
      { kind: "narracao", text: "Ele se encontra de novo no corredor da velha casa abandonada, ofegante. O Coringa o encara, risonho, porém seus braços cruzados revelam um tom curioso sobre o que estava a observar." },
    ],
  },
  {
    id: 'S20-b',
    scene: 'S20',
    from: 0.163,
    to: 0.266,
    register: 'A',
    place: 'left',
    lines: [
      { kind: "fala", text: "— Que decepção, Batman. Você me magoou muito! Pensei que eu era seu inimigo número um!" },
    ],
  },
  {
    id: 'S20-c',
    scene: 'S20',
    from: 0.306,
    to: 0.409,
    register: 'A',
    place: 'left',
    lines: [
      { kind: "narracao", text: "Bruce se ergue e observa o inimigo com cautela e calma." },
    ],
  },
  {
    id: 'S20-d',
    scene: 'S20',
    from: 0.449,
    to: 0.551,
    register: 'A',
    place: 'left',
    lines: [
      { kind: "fala", text: "— Este não é o final perfeito. — disse o Coringa." },
    ],
  },
  {
    id: 'S20-e',
    scene: 'S20',
    from: 0.591,
    to: 0.694,
    register: 'A',
    place: 'left',
    lines: [
      { kind: "fala", text: "— É o final que me deixa livre. — responde Batman." },
    ],
  },
  {
    id: 'S20-f',
    scene: 'S20',
    from: 0.734,
    to: 0.837,
    register: 'A',
    place: 'left',
    lines: [
      { kind: "narracao", text: "As luzes se apagam. No corredor agora escuro, Batman só ouvia os passos rápidos de seu inimigo, que se pusera a correr e a chamar os poucos capangas do local para retornarem consigo." },
    ],
  },
  {
    id: 'S20-g',
    scene: 'S20',
    from: 0.877,
    to: 0.98,
    register: 'A',
    place: 'left',
    lines: [
      { kind: "narracao", text: "Aquele encontro já fora suficiente para uma noite. Era a resposta que ambos queriam." },
    ],
  },

  // ---------------------------------------------------------------------
  // S22
  // Direção de cena: De volta à Mansão dos Wayne.
  // Janelas provisórias: a cena ainda não existe. Serão afinadas na fase
  // que implementar esta cena, sem tocar no texto.
  // ---------------------------------------------------------------------
  {
    id: 'S22-a',
    scene: 'S22',
    from: 0.02,
    to: 0.123,
    register: 'A',
    place: 'left',
    lines: [
      { kind: "narracao", text: "O herdeiro estava parado em frente a uma das enormes janelas da sala de estar. Calmo, contemplava o jardim que ornamentava a entrada da residência. Estivera pensativo sobre tudo que passara nesses tempos recentes." },
    ],
  },
  {
    id: 'S22-b',
    scene: 'S22',
    from: 0.163,
    to: 0.266,
    register: 'A',
    place: 'left',
    lines: [
      { kind: "narracao", text: "Alfred se aproxima." },
    ],
  },
  {
    id: 'S22-c',
    scene: 'S22',
    from: 0.306,
    to: 0.409,
    register: 'A',
    place: 'left',
    lines: [
      { kind: "fala", text: "— Temos que entender que nossos julgamentos nem sempre serão certeiros, patrão Bruce. Nossos defeitos podem ser tornados em qualidade. E não precisamos carregar todo o peso do mundo." },
    ],
  },
  {
    id: 'S22-d',
    scene: 'S22',
    from: 0.449,
    to: 0.551,
    register: 'A',
    place: 'left',
    lines: [
      { kind: "narracao", text: "Ele olhou para o jardim." },
    ],
  },
  {
    id: 'S22-e',
    scene: 'S22',
    from: 0.591,
    to: 0.694,
    register: 'A',
    place: 'left',
    lines: [
      { kind: "fala", text: "— O diamante é uma pedra bruta. Precisa ser lapidada." },
    ],
  },
  {
    id: 'S22-f',
    scene: 'S22',
    from: 0.734,
    to: 0.837,
    register: 'A',
    place: 'left',
    lines: [
      { kind: "narracao", text: "Alfred parou aí." },
    ],
  },
  {
    id: 'S22-g',
    scene: 'S22',
    from: 0.877,
    to: 0.98,
    register: 'A',
    place: 'left',
    lines: [
      { kind: "fala", text: "— É importante que o senhor retire alguns pesos de si mesmo, para prosseguir a jornada. — continuou o mordomo." },
    ],
  },

  // ---------------------------------------------------------------------
  // S23
  // Janelas provisórias: a cena ainda não existe. Serão afinadas na fase
  // que implementar esta cena, sem tocar no texto.
  // ---------------------------------------------------------------------
  {
    id: 'S23-a',
    scene: 'S23',
    from: 0.02,
    to: 0.48,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "narracao", text: "Bruce, em frente à janela, de olhos fechados, começa a meditar. Visualiza a si mesmo se libertando enquanto escuta as palavras de seu amigo." },
    ],
  },
  {
    id: 'S23-b',
    scene: 'S23',
    from: 0.52,
    to: 0.98,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "narracao", text: "Batman então imagina-se em um navio voador, jogando algumas coisas para fora — caixas, baús, entre outros pertences — para aliviar o peso da embarcação. Para levantar voos mais altos." },
    ],
  },

  // ---------------------------------------------------------------------
  // S24
  // Janelas provisórias: a cena ainda não existe. Serão afinadas na fase
  // que implementar esta cena, sem tocar no texto.
  // ---------------------------------------------------------------------
  {
    id: 'S24-a',
    scene: 'S24',
    from: 0.02,
    to: 0.313,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "narracao", text: "Bruce abre os olhos." },
    ],
  },
  {
    id: 'S24-b',
    scene: 'S24',
    from: 0.353,
    to: 0.647,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "fala", text: "— Afinal... — disse Alfred." },
    ],
  },
  {
    id: 'S24-c',
    scene: 'S24',
    from: 0.687,
    to: 0.98,
    register: 'B',
    place: 'left',
    lines: [
      { kind: "fala", text: "— Um morcego também precisa voar. — terminou." },
    ],
  },
];

/** Palavras do microgame da S07, na ordem. A sequência nunca termina: ela cicla. */
export const CONFIRMACAO: readonly string[] = [
  "Confirmar.",
  "Tem certeza?",
  "Verificar.",
  "E se não for?",
  "Confirmar novamente.",
];

/** Os blocos de uma cena, na ordem em que aparecem. */
export function blocksOf(sceneId: string): readonly NarrativeBlock[] {
  return NARRATIVE.filter((b) => b.scene === sceneId);
}
