import { topics, constraints } from './data.js'

// 配列をシャッフルした新しい配列を返す(Fisher–Yates)
export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// 直前のお題を避けてランダムに1つ抽選
export function pickTopic(lastTopic) {
  const pool = topics.filter((t) => t !== lastTopic)
  const source = pool.length > 0 ? pool : topics
  return source[Math.floor(Math.random() * source.length)]
}

// 縛りを1つ抽選(無効時は null)。
// values を持つ縛りは具体的な数字・言葉を1つ割り当て、description に差し込む。
export function pickConstraint(enabled) {
  if (!enabled) return null
  const c = constraints[Math.floor(Math.random() * constraints.length)]
  if (c.values && c.values.length > 0) {
    const value = c.values[Math.floor(Math.random() * c.values.length)]
    return {
      id: c.id,
      label: c.label,
      value,
      description: c.template.replace('{}', value),
    }
  }
  return { id: c.id, label: c.label, description: c.template }
}

// 参加者からランダムに嘘つきを1人選出(インデックスを返す)
export function pickLiar(count) {
  return Math.floor(Math.random() * count)
}

export const initialSettings = {
  playerCount: 3,
  talkTime: 60,
  questionTime: 60, // 秒。0 = なし
  constraintEnabled: true,
}

export const initialState = {
  phase: 'title', // title | setup | reveal | talk | question | vote | result
  settings: initialSettings,
  players: [], // [{ name }]
  topic: null,
  constraint: null,
  liarIndex: -1,
  talkOrder: [], // プレイヤーインデックスのシャッフル列
  votes: [], // votes[voterIndex] = targetIndex
  lastTopic: null,
}

// お題・縛り・嘘つき・トーク順を新規抽選してゲームを準備する
function buildRound(settings, players, lastTopic) {
  const topic = pickTopic(lastTopic)
  const constraint = pickConstraint(settings.constraintEnabled)
  const liarIndex = pickLiar(players.length)
  const talkOrder = shuffle(players.map((_, i) => i))
  return {
    topic,
    constraint,
    liarIndex,
    talkOrder,
    votes: new Array(players.length).fill(-1),
    lastTopic: topic,
  }
}

export function reducer(state, action) {
  switch (action.type) {
    case 'GO_SETUP':
      return { ...state, phase: 'setup' }

    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } }

    // 設定完了 → 役割確認へ。お題・縛り・嘘つきを抽選
    case 'START_GAME': {
      const players = action.players
      const round = buildRound(state.settings, players, state.lastTopic)
      return { ...state, phase: 'reveal', players, ...round }
    }

    case 'GO_TALK':
      return { ...state, phase: 'talk' }

    // トーク終了 → 質問タイム(なしなら投票へ)
    case 'END_TALK':
      return {
        ...state,
        phase: state.settings.questionTime > 0 ? 'question' : 'vote',
      }

    case 'GO_VOTE':
      return { ...state, phase: 'vote' }

    case 'CAST_VOTE': {
      const votes = [...state.votes]
      votes[action.voterIndex] = action.targetIndex
      return { ...state, votes }
    }

    case 'GO_RESULT':
      return { ...state, phase: 'result' }

    // 同じメンバーでもう一回(名前・設定を引き継ぎ再抽選)
    case 'REPLAY': {
      const round = buildRound(state.settings, state.players, state.lastTopic)
      return { ...state, phase: 'reveal', ...round }
    }

    // 最初から(設定はデフォルトに戻すが lastTopic は連続回避のため保持)
    case 'RESET':
      return { ...initialState, lastTopic: state.lastTopic }

    default:
      return state
  }
}

// 投票集計と勝敗判定
// 戻り値: { tally: number[], maxVotes, topIndices, liarWins, reason }
export function computeResult(state) {
  const { players, votes, liarIndex } = state
  const tally = new Array(players.length).fill(0)
  votes.forEach((target) => {
    if (target >= 0 && target < players.length) tally[target] += 1
  })

  const maxVotes = Math.max(0, ...tally)
  const topIndices = tally
    .map((v, i) => (v === maxVotes && maxVotes > 0 ? i : -1))
    .filter((i) => i >= 0)

  // 嘘つきが単独最多 → 市民の勝ち。それ以外(同票含む)→ 嘘つきの逃げ切り
  const liarCaught = topIndices.length === 1 && topIndices[0] === liarIndex
  const liarWins = !liarCaught

  let reason
  if (liarCaught) reason = 'caught'
  else if (topIndices.length > 1) reason = 'tie'
  else if (maxVotes === 0) reason = 'novote'
  else reason = 'escaped'

  return { tally, maxVotes, topIndices, liarWins, reason }
}
