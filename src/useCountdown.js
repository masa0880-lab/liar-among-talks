import { useEffect, useRef, useState, useCallback } from 'react'

// シンプルなカウントダウンタイマー。seconds から 0 まで減算する。
// 戻り値: { remaining, running, start, pause, reset }
export function useCountdown(seconds, { autoStart = true, onDone } = {}) {
  const [remaining, setRemaining] = useState(seconds)
  const [running, setRunning] = useState(autoStart)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    if (!running) return
    if (remaining <= 0) {
      setRunning(false)
      onDoneRef.current && onDoneRef.current()
      return
    }
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000)
    return () => clearTimeout(id)
  }, [running, remaining])

  const start = useCallback(() => setRunning(true), [])
  const pause = useCallback(() => setRunning(false), [])
  const reset = useCallback(
    (s = seconds) => {
      setRemaining(s)
      setRunning(autoStart)
    },
    [seconds, autoStart],
  )

  return { remaining, running, start, pause, reset }
}

// 秒を mm:ss 形式に整形
export function formatTime(sec) {
  const s = Math.max(0, sec)
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${String(r).padStart(2, '0')}`
}
