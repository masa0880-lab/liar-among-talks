import { useState } from 'react'

// 役割確認フェーズ。プレイヤーを1人ずつ回し、本人が押している間だけ役割を表示。
// 他人の役割が一瞬でも見えないよう、受け渡し画面(handoff)と確認画面を厳密に分離する。
export default function RevealScreen({ players, topic, constraint, liarIndex, onDone }) {
  const [index, setIndex] = useState(0) // 確認中のプレイヤー
  const [sub, setSub] = useState('handoff') // handoff | confirm
  const [holding, setHolding] = useState(false) // 押下中のみ役割表示
  const [seen, setSeen] = useState(false) // 一度でも表示したか

  const player = players[index]
  const isLiar = index === liarIndex
  const isLast = index === players.length - 1

  const press = () => {
    setHolding(true)
    setSeen(true)
  }
  const release = () => setHolding(false)

  const next = () => {
    // 役割を確実に隠してから受け渡し画面へ
    setHolding(false)
    setSeen(false)
    if (isLast) {
      onDone()
    } else {
      setIndex((i) => i + 1)
      setSub('handoff')
    }
  }

  if (sub === 'handoff') {
    return (
      <div className="screen screen--center fade-in">
        <div className="handoff">
          <div className="handoff__icon" aria-hidden>📱➡️</div>
          <p className="handoff__lead">スマホを渡してください</p>
          <p className="handoff__name">{player.name} さん</p>
          <p className="note">
            他の人に画面を見られないようにしてね
          </p>
        </div>
        <button
          className="btn btn--primary btn--lg btn--block"
          onClick={() => setSub('confirm')}
        >
          {player.name} です
        </button>
      </div>
    )
  }

  return (
    <div className="screen screen--center fade-in">
      <p className="reveal__who">{player.name} さんの役割</p>

      <button
        className={`reveal-card ${holding ? 'is-open' : ''} ${
          holding && isLiar ? 'reveal-card--liar' : ''
        }`}
        onPointerDown={press}
        onPointerUp={release}
        onPointerLeave={release}
        onPointerCancel={release}
        onContextMenu={(e) => e.preventDefault()}
      >
        {holding ? (
          <div className="reveal-content">
            <div className="reveal-topic">
              <span className="reveal-topic__label">お題</span>
              <span className="reveal-topic__text">{topic}</span>
            </div>
            {isLiar ? (
              <div className="reveal-role reveal-role--liar">
                <div className="reveal-role__big">あなたは嘘つき 😈</div>
                <div className="reveal-role__sub">
                  全部作り話をしてください。バレないように！
                </div>
                {constraint && (
                  <div className="reveal-constraint">
                    <span className="reveal-constraint__label">
                      🤫 あなただけの秘密の縛り
                    </span>
                    <span className="reveal-constraint__text">
                      {constraint.description}
                    </span>
                    <span className="reveal-constraint__note">
                      ※ 他の人は縛りを知りません。自然に盛り込んで！
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="reveal-role">
                <div className="reveal-role__big">あなたは正直者 😇</div>
                <div className="reveal-role__sub">
                  本当の実体験を話してください。縛りはありません。
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="reveal-hint">
            <div className="reveal-hint__icon" aria-hidden>👆</div>
            <div>長押しして役割を確認</div>
            <div className="reveal-hint__sub">指を離すと隠れます</div>
          </div>
        )}
      </button>

      <button
        className="btn btn--primary btn--block"
        onClick={next}
        disabled={!seen}
      >
        {seen ? (isLast ? 'トークを始める' : '確認した → 次の人へ') : '先に長押しで確認'}
      </button>
    </div>
  )
}
