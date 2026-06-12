// 抽選された縛りルールを画面上部に常時表示するバナー
export default function ConstraintBanner({ constraint }) {
  if (!constraint) {
    return (
      <div className="constraint-banner constraint-banner--off">
        <span className="constraint-banner__tag">縛りなし</span>
        <span className="constraint-banner__desc">自由に話してOK</span>
      </div>
    )
  }
  return (
    <div className="constraint-banner">
      <span className="constraint-banner__tag">縛り：{constraint.label}</span>
      <span className="constraint-banner__desc">{constraint.description}</span>
    </div>
  )
}
