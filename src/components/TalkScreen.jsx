import { useState } from 'react'
import { useCountdown, formatTime } from '../useCountdown.js'
import LiarHint from './LiarHint.jsx'

// 1人分のカウントダウンタイマー。speaker が変わるたび key で remount してリセット。
function TalkTimer({ seconds }) {
  const { remaining } = useCountdown(seconds, { autoStart: true })
  const danger = remaining <= 10
  const done = remaining <= 0
  return (
    <div
      className={`big-timer ${danger ? 'big-timer--danger' : ''} ${
        done ? 'big-timer--done' : ''
      }`}
    >
      {done ? '時間です' : formatTime(remaining)}
    </div>
  )
}

export default function TalkScreen({ players, topic, constraintActive, talkOrder, settings, onDone }) {
  const [pos, setPos] = useState(0)
  const speaker = players[talkOrder[pos]]
  const isLast = pos === talkOrder.length - 1

  const next = () => {
    if (isLast) onDone()
    else setPos((p) => p + 1)
  }

  return (
    <div className="screen fade-in">
      <LiarHint active={constraintActive} />

      <div className="topic-display">
        <span className="topic-display__label">お題</span>
        <span className="topic-display__text">{topic}</span>
      </div>

      <div className="talk-main">
        <p className="talk-order">
          {pos + 1} / {talkOrder.length} 人目
        </p>
        <p className="talk-speaker">{speaker.name} さん</p>
        <p className="talk-cue">の番です</p>
        <TalkTimer key={pos} seconds={settings.talkTime} />
      </div>

      <button className="btn btn--primary btn--lg btn--block" onClick={next}>
        {isLast ? '全員終了 → 質問タイムへ' : '次の人へ'}
      </button>
    </div>
  )
}
