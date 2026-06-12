import { useEffect, useState } from 'react'
import { computeResult } from '../game.js'

export default function ResultScreen({ state, onReplay, onReset }) {
  const { players, votes, liarIndex, topic } = state
  const result = computeResult(state)
  const { tally, liarWins, reason } = result

  // stage: 0 ドラムロール → 1 投票結果 → 2 嘘つき正体 → 3 勝敗
  const [stage, setStage] = useState(0)

  useEffect(() => {
    if (stage !== 0) return
    const id = setTimeout(() => setStage(1), 1600)
    return () => clearTimeout(id)
  }, [stage])

  if (stage === 0) {
    return (
      <div className="screen screen--center">
        <div className="drumroll">
          <div className="drumroll__spin" aria-hidden>🥁</div>
          <p className="drumroll__text">結果発表…</p>
        </div>
      </div>
    )
  }

  const verdictTitle = liarWins ? '嘘つきの逃げ切り勝ち！' : '市民チームの勝ち！'
  const reasonText = {
    caught: '嘘つきを見事に当てました！',
    tie: '同票につき逃げ切り成功',
    escaped: '嘘つきはまんまと逃げ切りました',
    novote: '誰も票を集めず、嘘つきの勝ち',
  }[reason]

  return (
    <div className="screen fade-in">
      <h1 className="screen__title">結果発表</h1>
      <p className="result-topic">お題：{topic}</p>

      {/* 1. 投票結果 */}
      <section className="card">
        <h2 className="result-section-title">投票結果</h2>
        <div className="tally-list">
          {players.map((p, i) => {
            const isTop = tally[i] === result.maxVotes && result.maxVotes > 0
            return (
              <div
                key={i}
                className={`tally-row ${isTop ? 'tally-row--top' : ''}`}
              >
                <span className="tally-name">
                  {p.name}
                  {stage >= 2 && i === liarIndex && (
                    <span className="tally-liar-mark"> 😈嘘つき</span>
                  )}
                </span>
                <span className="tally-bar-wrap">
                  <span
                    className="tally-bar"
                    style={{
                      width: `${
                        result.maxVotes > 0
                          ? (tally[i] / result.maxVotes) * 100
                          : 0
                      }%`,
                    }}
                  />
                </span>
                <span className="tally-count">{tally[i]}票</span>
              </div>
            )
          })}
        </div>
      </section>

      {/* 2. 嘘つきの正体 */}
      {stage >= 2 && (
        <section className="card card--reveal fade-in">
          <h2 className="result-section-title">嘘つきの正体</h2>
          <p className="liar-reveal">
            😈 <b>{players[liarIndex].name}</b> さんでした！
          </p>
        </section>
      )}

      {/* 3. 勝敗 */}
      {stage >= 3 && (
        <section
          className={`verdict fade-in ${liarWins ? 'verdict--liar' : 'verdict--citizen'}`}
        >
          <div className="verdict__title">{verdictTitle}</div>
          <div className="verdict__reason">{reasonText}</div>
          <div className="verdict__punish">
            🍺 負けチームは乾杯！（おまけ）
          </div>
        </section>
      )}

      {/* ステージ送りボタン */}
      {stage === 1 && (
        <button
          className="btn btn--primary btn--lg btn--block"
          onClick={() => setStage(2)}
        >
          嘘つきは…？
        </button>
      )}
      {stage === 2 && (
        <button
          className="btn btn--primary btn--lg btn--block"
          onClick={() => setStage(3)}
        >
          勝敗を見る
        </button>
      )}
      {stage >= 3 && (
        <div className="stack">
          <button className="btn btn--primary btn--lg btn--block" onClick={onReplay}>
            同じメンバーでもう一回
          </button>
          <button className="btn btn--ghost btn--block" onClick={onReset}>
            最初から
          </button>
        </div>
      )}
    </div>
  )
}
