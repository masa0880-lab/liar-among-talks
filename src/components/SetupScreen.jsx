import { useState } from 'react'

const MIN_PLAYERS = 3
const MAX_PLAYERS = 10

export default function SetupScreen({ settings, onChange, onStart }) {
  const [names, setNames] = useState(() =>
    Array.from({ length: settings.playerCount }, () => ''),
  )

  const setCount = (count) => {
    onChange({ playerCount: count })
    setNames((prev) => {
      const next = [...prev]
      if (count > prev.length) {
        while (next.length < count) next.push('')
      } else {
        next.length = count
      }
      return next
    })
  }

  const setName = (i, value) => {
    setNames((prev) => {
      const next = [...prev]
      next[i] = value
      return next
    })
  }

  const start = () => {
    const players = names.map((n, i) => ({
      name: n.trim() === '' ? `プレイヤー${i + 1}` : n.trim(),
    }))
    onStart(players)
  }

  return (
    <div className="screen fade-in">
      <h1 className="screen__title">ゲーム設定</h1>

      <section className="card">
        <label className="field-label">参加人数</label>
        <div className="counter">
          <button
            className="counter__btn"
            onClick={() => setCount(Math.max(MIN_PLAYERS, settings.playerCount - 1))}
            disabled={settings.playerCount <= MIN_PLAYERS}
            aria-label="人数を減らす"
          >
            −
          </button>
          <span className="counter__value">{settings.playerCount}人</span>
          <button
            className="counter__btn"
            onClick={() => setCount(Math.min(MAX_PLAYERS, settings.playerCount + 1))}
            disabled={settings.playerCount >= MAX_PLAYERS}
            aria-label="人数を増やす"
          >
            +
          </button>
        </div>
      </section>

      <section className="card">
        <label className="field-label">参加者の名前(省略可)</label>
        <div className="stack stack--tight">
          {names.map((name, i) => (
            <input
              key={i}
              className="text-input"
              type="text"
              inputMode="text"
              maxLength={12}
              placeholder={`プレイヤー${i + 1}`}
              value={name}
              onChange={(e) => setName(i, e.target.value)}
            />
          ))}
        </div>
      </section>

      <section className="card">
        <label className="field-label">トーク時間</label>
        <div className="seg">
          {[30, 60, 90].map((t) => (
            <button
              key={t}
              className={`seg__btn ${settings.talkTime === t ? 'is-active' : ''}`}
              onClick={() => onChange({ talkTime: t })}
            >
              {t}秒
            </button>
          ))}
        </div>
      </section>

      <section className="card">
        <label className="field-label">質問タイム</label>
        <div className="seg">
          {[
            { v: 0, label: 'なし' },
            { v: 60, label: '1分' },
            { v: 120, label: '2分' },
          ].map((o) => (
            <button
              key={o.v}
              className={`seg__btn ${settings.questionTime === o.v ? 'is-active' : ''}`}
              onClick={() => onChange({ questionTime: o.v })}
            >
              {o.label}
            </button>
          ))}
        </div>
      </section>

      <section className="card card--row">
        <div>
          <div className="field-label field-label--inline">嘘つきの秘密の縛り</div>
          <div className="note note--tight">
            {settings.constraintEnabled
              ? '嘘つきだけに難しい縛りを課します'
              : '縛りなしで遊びます'}
          </div>
        </div>
        <button
          className={`toggle ${settings.constraintEnabled ? 'is-on' : ''}`}
          role="switch"
          aria-checked={settings.constraintEnabled}
          onClick={() =>
            onChange({ constraintEnabled: !settings.constraintEnabled })
          }
        >
          <span className="toggle__knob" />
        </button>
      </section>

      <button className="btn btn--primary btn--lg btn--block" onClick={start}>
        役割を配る
      </button>
    </div>
  )
}
