/**
 * Diálogos das cenas em caixa — DIRECAO.md §8, §S06 e §S09.
 *
 * A fonte é `TEXTO-REVISADO.md`, na raiz. As falas vieram de lá sem alteração
 * de uma palavra, inclusive as atribuições que o autor escreveu dentro da
 * própria fala ("— disse Bárbara."). Por isso a caixa não desenha etiqueta de
 * nome: quem identifica o falante é o retrato, e o texto continua inteiro.
 *
 * Falas longas não são quebradas aqui. A caixa pagina sozinha, conforme a
 * largura disponível — escrever a fala inteira é o jeito certo de editar.
 *
 * `speaker` vazio é narração dentro da caixa, sem retrato.
 */

export interface DialogueLine {
  /** 'bruce' | 'barbara' | 'alfred', ou vazio para narração. */
  readonly speaker: string;
  /** Chave do retrato de 32×32, ou null quando não há. */
  readonly portrait: string | null;
  readonly text: string;
}

export interface DialogueScript {
  readonly scene: string;
  readonly lines: readonly DialogueLine[];
}

/**
 * S06 — BÁRBARA · a cena mais estável da obra.
 *
 * Direção de cena, do texto original:
 * Bruce comunicou a visita antes de ir. Introduções e algum diálogo já aconteceram quando a cena começa.
 */
const S06_LINES: readonly DialogueLine[] = [
  { speaker: "barbara", portrait: "barbara", text: "— Você está descrevendo um padrão, Bruce. Não um episódio. — disse Bárbara." },
  { speaker: "bruce", portrait: "bruce", text: "— É o que venho cogitando. Meu perfeccionismo em missão, e outras experiências, me trouxeram até aqui. Não sei se devo confiar nessas obsessões. Não sei se elas são tão decisivas quanto parecem. Eu venho duvidando do meu próprio instinto." },
  { speaker: "barbara", portrait: "barbara", text: "— O que está acontecendo?" },
  { speaker: "bruce", portrait: "bruce", text: "— Eu me sinto bloqueado. Me dei conta de que estava perdendo tempo demais em análise e repetição. E percebi que ando me privando de lugares e de coisas, por alguma espécie de medo. Uma sensação ruim. — respondeu Bruce. — Além disso, suspeito que meu rendimento esteja caindo. Ainda não é aparente. Mas vai se agravar. Meus colegas me respeitam muito, e por isso ainda tenho alguma liberdade." },
  { speaker: '', portrait: null, text: "Bárbara assentiu depois do relato do detetive." },
  { speaker: "barbara", portrait: "barbara", text: "— Já pesquisei sobre isso. Estudei alguns casos, em outros contextos. Com mais profundidade, talvez eu consiga te ajudar. — disse. — Mas antes de qualquer coisa, me diga o que se passa na sua cabeça. Eu sei que falar é desconfortável, e sei que você não confia em ninguém. Mas estou curiosa. E sei que expor o problema ajuda a trabalhar contra ele." },
  { speaker: '', portrait: null, text: "Bruce demonstrou incômodo. Hesitou." },
  { speaker: "barbara", portrait: "barbara", text: "— Vamos. Se não fosse grave, você não estaria aqui. — insistiu a colega." },
  { speaker: '', portrait: null, text: "O detetive respirou. Então começou:" },
  { speaker: "bruce", portrait: "bruce", text: "— Eu estou numa espécie de loop mental. Dou importância a coisas sem sentido, que parecem solidificadas na minha forma de pensar. Fico reafirmando pensamentos, procurando alguma certeza. Não é nada literal, como nos casos que você deve ter lido. É tudo aqui dentro." },
  { speaker: '', portrait: null, text: "Bárbara ouviu com atenção enquanto Bruce prosseguia." },
  { speaker: "bruce", portrait: "bruce", text: "— E apesar de eu ter dito que são sem sentido, eu sinto angústia quando não realizo os rituais. Eu os julgo de suma importância para que a noite termine em sucesso, quando vou atrás de algum criminoso de maior expressão em Gotham." },
];

/**
 * S07 — A MOLA · o fecho, de volta à conversa, depois do microgame.
 *
 * Direção de cena, do texto original:
 * Durante o microgame.
 * Ao final da cena, de volta à conversa:
 */
const S07_LINES: readonly DialogueLine[] = [
  { speaker: "bruce", portrait: "bruce", text: "— E me desapegar dessas tarefas mentais me parece algo terrivelmente errado. Pode pôr em risco meu trabalho. E, mais grave ainda, a vida dos meus colegas." },
  { speaker: '', portrait: null, text: "Bárbara ficou em silêncio por um instante." },
  { speaker: "barbara", portrait: "barbara", text: "— Bruce. Você não veio aqui atrás de uma resposta." },
  { speaker: '', portrait: null, text: "Ele ergueu os olhos." },
  { speaker: "barbara", portrait: "barbara", text: "— Você veio porque precisava ter certeza de que precisava de uma." },
  { speaker: '', portrait: null, text: "Bruce não respondeu." },
];

/**
 * S09 — ALFRED · mesma gramática da S06, mais fechada e mais quente.
 *
 * Direção de cena, do texto original:
 * De volta à Batcaverna.
 */
const S09_LINES: readonly DialogueLine[] = [
  { speaker: "alfred", portrait: "alfred", text: "— Não, senhor. Eu não havia percebido nada diferente. O senhor sempre foi muito recluso e reservado. Quando ficava em silêncio por horas, eu presumia que estivesse trabalhando em algum plano. — Alfred fez uma pausa. — Há quanto tempo o senhor vem sofrendo com isso?" },
  { speaker: "bruce", portrait: "bruce", text: "— Não sei dizer. Nunca prestei atenção nisso. As mesmas qualidades que me ajudaram a vencer e a sobreviver são as que estão me pondo no fundo do poço agora. Bárbara me disse que, para alguém com esse problema, leva um tempo considerável até perceber. Bastou eu dar um passo atrás e observar como estava agindo. — disse Bruce." },
  { speaker: '', portrait: null, text: "Alfred olhou para os monitores antes de responder." },
  { speaker: "alfred", portrait: "alfred", text: "— O senhor sempre tão reservado, patrão Bruce. Durante todos esses anos, quando o senhor ficava calado ali, eu imaginava que estivesse planejando. — disse. — Nunca me ocorreu que pudesse estar preso." },
  { speaker: "bruce", portrait: "bruce", text: "— Eu temo que não consiga resolver isto sozinho, Alfred..." },
  { speaker: "alfred", portrait: "alfred", text: "— E não precisa." },
  { speaker: '', portrait: null, text: "Bruce começou a ajustar o uniforme, revelando a Alfred sua partida para uma caçada noturna. Antes de sair, comentou:" },
  { speaker: "bruce", portrait: "bruce", text: "— Alfred, eu temo que o Coringa suspeite de algo. Ele me viu travado e confuso em ação. E a parceira dele, a doutora Harleen Quinzel, pode ter sugerido algumas ideias a respeito." },
  { speaker: "alfred", portrait: "alfred", text: "— E sabemos que o Coringa não economiza esforços para atordoar o Batman, patrão Bruce. Ele vai usar isso contra o senhor. E se perceber que está atingindo, não vai parar. — alertou Alfred." },
  { speaker: "bruce", portrait: "bruce", text: "— Preciso voltar àquela casa abandonada, onde ele está tramando algo novo. Preciso ir até lá e terminar o que comecei." },
];

export const DIALOGUES: readonly DialogueScript[] = [
  { scene: 'S06', lines: S06_LINES },
  { scene: 'S07', lines: S07_LINES },
  { scene: 'S09', lines: S09_LINES },
];

export function scriptOf(sceneId: string): DialogueScript | undefined {
  return DIALOGUES.find((d) => d.scene === sceneId);
}
