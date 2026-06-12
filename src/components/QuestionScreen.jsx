import { useCountdown, formatTime } from '../useCountdown.js'
import ConstraintBanner from './ConstraintBanner.jsx'

export default function QuestionScreen({ constraint, questionTime, onDone }) {
  const { remaining } = useCountdown(questionTime, { autoStart: true })
  const danger = remaining <= 10
  const done = remaining <= 0

  return (
    <div className="screen fade-in">
      <ConstraintBanner constraint={constraint} />

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
        {constraint && (
          <p className="note">
            リマインド：全員「{constraint.label}」を守って話しているはず…？
          </p>
        )}
      </div>

      <button className="btn btn--primary btn--lg btn--block" onClick={onDone}>
        投票へ進む
      </button>
    </div>
  )
}
