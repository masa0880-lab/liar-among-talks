import { useCountdown, formatTime } from '../useCountdown.js'
import LiarHint from './LiarHint.jsx'

export default function QuestionScreen({ constraintActive, questionTime, onDone }) {
  const { remaining } = useCountdown(questionTime, { autoStart: true })
  const danger = remaining <= 10
  const done = remaining <= 0

  return (
    <div className="screen fade-in">
      <LiarHint active={constraintActive} />

      <div className="talk-main talk-main--grow">
        <div className="question-emoji" aria-hidden>🤔💬</div>
        <h1 className="screen__title">質問タイム！</h1>
        <p className="question-lead">気になる人に質問しよう</p>
        <div
          className={`big-timer ${danger ? 'big-timer--danger' : ''} ${
            done ? 'big-timer--done' : ''
          }`}
        >
          {done ? '時間です' : formatTime(remaining)}
        </div>
        {constraintActive && (
          <p className="note">
            不自然に出てきた数字や言葉は、嘘つきの縛りかも…？
          </p>
        )}
      </div>

      <button className="btn btn--primary btn--lg btn--block" onClick={onDone}>
        投票へ進む
      </button>
    </div>
  )
}
