// 縛りの中身は嘘つきだけが知っている。市民には「秘密の縛りがある」とだけ示し、
// 不自然に要素を盛り込む人=嘘つきを探す手がかりにしてもらう。
export default function LiarHint({ active }) {
  if (!active) return null
  return (
    <div className="liar-hint">
      <span className="liar-hint__tag">🤫 嘘つきには秘密の縛り</span>
      <span className="liar-hint__desc">
        嘘つきは見えない縛りに従って話しています。不自然に盛り込まれた言葉を見抜こう
      </span>
    </div>
  )
}
