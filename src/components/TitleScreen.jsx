import { useState } from 'react'

export default function TitleScreen({ onStart }) {
  const [showHow, setShowHow] = useState(false)

  return (
    <div className="screen screen--center fade-in">
      <div className="title-hero">
        <div className="title-emoji" aria-hidden>🍻</div>
        <h1 className="title-name">嘘つきトーク</h1>
        <p className="title-sub">トークの中に、嘘つきが1人。</p>
      </div>

      <div className="stack">
        <button className="btn btn--primary btn--lg" onClick={onStart}>
          ゲームを始める
        </button>
        <button className="btn btn--ghost" onClick={() => setShowHow(true)}>
          遊び方
        </button>
      </div>

      <p className="note">
        ※ スマホ1台を回して遊びます。リロードするとゲームは消えます。
      </p>

      {showHow && (
        <div className="modal-overlay" onClick={() => setShowHow(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal__title">遊び方</h2>
            <ol className="how-list">
              <li>
                <span className="how-step">1</span>
                <div>
                  全員に同じ<b>お題</b>が配られ、実体験を話します。でも1人だけ
                  <b>「全部作り話」の嘘つき</b>です。
                </div>
              </li>
              <li>
                <span className="how-step">2</span>
                <div>
                  順番にトーク → 質問タイム。
                  <b>共通の縛りルール</b>を守りながら話します。
                </div>
              </li>
              <li>
                <span className="how-step">3</span>
                <div>
                  最後に「嘘つきだと思う人」へ投票。
                  当てられたら市民の勝ち、逃げ切れたら嘘つきの勝ち！
                </div>
              </li>
            </ol>
            <button
              className="btn btn--primary btn--block"
              onClick={() => setShowHow(false)}
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
