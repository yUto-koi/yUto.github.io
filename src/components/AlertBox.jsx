import { useMemo } from 'react'

const colors = ['#22d3ee', '#3b82f6', '#818cf8', '#34d399']

export default function AlertBox({ a, onClose }) {
  const ok = a.type !== 'err'
  const confetti = useMemo(() => {
    if (!ok || !a.open) return []
    return Array.from({ length: 22 }, (_, i) => {
      const ang = Math.random() * 6.28, d = 70 + Math.random() * 90
      return { '--x': Math.cos(ang) * d + 'px', '--y': Math.sin(ang) * d - 20 + 'px', '--r': Math.random() * 540 + 'deg', background: colors[i % 4], animationDelay: '.7s', opacity: 1 }
    })
  }, [a.n]) // eslint-disable-line

  return (
    <div className={'al' + (a.open ? ' open' : '')} role="alertdialog" aria-modal="true" aria-labelledby="at"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={'ab ' + (ok ? 'ok' : 'err')}>
        <div className="ai" key={'i' + a.n}>
          <svg viewBox="0 0 84 84">
            <circle cx="42" cy="42" r="36" />
            <path d={ok ? 'M26 43l11 11 21-23' : 'M30 30l24 24M54 30L30 54'} />
          </svg>
        </div>
        <h3 id="at">{a.title}</h3>
        <p>{a.text}</p>
        <button className="btn" onClick={onClose}>Got it</button>
        <div className="tm" key={'t' + a.n}></div>
        {confetti.map((s, i) => <i className="cf" key={a.n + '-' + i} style={s}></i>)}
      </div>
    </div>
  )
}
