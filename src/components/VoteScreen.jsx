import { useState } from 'react'
import ConstraintBanner from './ConstraintBanner.jsx'

// 投票フェーズ。1人ずつ回し、自分以外から嘘つきを選ぶ。
// 投票後は受け渡し画面を挟み、選択内容が次の人に見えないようにする。
export default function VoteScreen({ players, constraint, onVote, onDone }) {
  const [index, setIndex] = useState(0)
  const [sub, setSub] = useState('handoff') // handoff | vote
  const voter = players[index]
  const isLast = index === players.length - 1

  const cast = (targetIndex) => {
    onVote(index, targetIndex)
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
          <div className="handoff__icon" aria-hidden>🗳️</div>
          <p className="handoff__lead">スマホを渡してください</p>
          <p className="handoff__name">{voter.name} さん</p>
          <p className="note">あなたの投票は他の人に見せないでね</p>
        </div>
        <button
          className="btn btn--primary btn--lg btn--block"
          onClick={() => setSub('vote')}
        >
          {voter.name} です
        </button>
      </div>
    )
  }

  return (
    <div className="screen fade-in">
      <ConstraintBanner constraint={constraint} />
      <h1 className="screen__title">{voter.name} さんの投票</h1>
      <p className="vote-lead">嘘つきだと思う人をタップ</p>

      <div className="vote-grid">
        {players.map((p, i) =>
          i === index ? (
            <button key={i} className="vote-choice vote-choice--self" disabled>
              {p.name}
              <span className="vote-choice__me">(あなた)</span>
            </button>
          ) : (
            <button
              key={i}
              className="vote-choice"
              onClick={() => cast(i)}
            >
              {p.name}
            </button>
          ),
        )}
      </div>
    </div>
  )
}
