import { useCallback, useEffect, useRef, useState } from 'react'
import { RC, skills } from '../data.js'
import { tilt } from '../hooks.js'

const ease = (p) => 1 - Math.pow(1 - p, 3)

export default function Skills() {
  const [vals, setVals] = useState(skills.map(() => 0))
  const ref = useRef(null)
  const run = useRef(false)
  const rid = useRef(0)

  const play = useCallback(() => {
    const id = ++rid.current
    const start = performance.now()
    const total = 1500 + skills.length * 150
    const tick = (now) => {
      if (id !== rid.current) return
      setVals(skills.map((s, i) => s.v * ease(Math.min(Math.max((now - start - i * 150) / 1500, 0), 1))))
      if (now - start < total) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [])

  useEffect(() => {
    const io = new IntersectionObserver((es) => {
      const r = es[es.length - 1].intersectionRatio
      if (r >= 0.2 && !run.current) { run.current = true; play() }
      else if (r === 0 && run.current) { run.current = false; rid.current++; setVals(skills.map(() => 0)) }
    }, { threshold: [0, 0.2] })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [play])

  const replay = (i) => {
    const s = performance.now()
    const tick = (now) => {
      const p = Math.min((now - s) / 1200, 1)
      setVals((v) => v.map((x, j) => (j === i ? skills[i].v * ease(p) : x)))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }

  return (
    <section id="skills">
      <div className="wrap">
        <h2 className="t reveal">My <b>Skills</b></h2>
        <p className="ts reveal">Less than 1 year of experience, learning every day.</p>
        <div className="sk reveal" id="sk" ref={ref}>
          <div className="sk-top">
            <p>I'm a passionate web developer with less than 1 year of experience creating modern, responsive websites and web applications.</p>
            <img src="/image.png" alt="Skills Banner" />
          </div>
          <div className="rings">
            {skills.map((s, i) => (
              <div className="ring" key={s.name} style={{ '--i': i }} role="button" tabIndex={0}
                onClick={() => replay(i)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); replay(i) } }}
                {...tilt(12)}>
                <div className="rg">
                  <svg viewBox="0 0 110 110">
                    <circle className="rb" cx="55" cy="55" r="46" />
                    <circle className="rf" cx="55" cy="55" r="46" strokeDasharray={RC} strokeDashoffset={RC * (1 - vals[i] / 100)} />
                  </svg>
                  <i className={s.icon} style={{ color: s.color }}></i>
                </div>
                <em>{Math.round(vals[i])}%</em>
                <span>{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
