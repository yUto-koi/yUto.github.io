import { useEffect, useState } from 'react'
import { NAME, roles, stack } from '../data.js'
import { tilt } from '../hooks.js'

export default function Hero({ ready }) {
  const [typed, setTyped] = useState('')
  const [role, setRole] = useState('')
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    if (!ready) return
    let live = true, n = 0, t
    const w = () => { if (!live || n >= NAME.length) return; n++; setTyped(NAME.slice(0, n)); t = setTimeout(w, 85) }
    const s = setTimeout(w, 350)
    return () => { live = false; clearTimeout(s); clearTimeout(t) }
  }, [ready])

  useEffect(() => {
    if (!ready) return
    let live = true, ri = 0, ci = 0, del = false, t
    const r = () => {
      if (!live) return
      const x = roles[ri]
      setRole(x.slice(0, ci))
      if (!del && ci === x.length) { del = true; t = setTimeout(r, 1600); return }
      if (del && ci === 0) { del = false; ri = (ri + 1) % roles.length }
      ci += del ? -1 : 1
      t = setTimeout(r, del ? 35 : 70)
    }
    const s = setTimeout(r, 350)
    return () => { live = false; clearTimeout(s); clearTimeout(t) }
  }, [ready])

  return (
    <>
      <section id="home" className="hero">
        <div className="shape s1"></div><div className="shape s2"></div><div className="shape s3"></div>
        <div className="wrap">
          <div>
            <div className="tag-top reveal"><i></i>Open to freelance and collaboration</div>
            <h1 className="reveal" style={{ '--d': '.1s' }}>Hi, I'm <span id="text">{typed}</span><b className="caret"></b></h1>
            <div className="role reveal" style={{ '--d': '.2s' }} id="role">{role}</div>
            <p className="d reveal" style={{ '--d': '.3s' }}>I create beautiful, responsive web experiences using modern technologies. Passionate about clean code and user-centered design. Currently studying Computer Science at UCSY.</p>
            <div className="row reveal" style={{ '--d': '.4s' }}>
              <a href="#portfolio" className="btn mag">View My Project <i className="bx bx-right-arrow-alt"></i></a>
              <a href="#contact" className="btn ghost mag">Contact me</a>
            </div>
          </div>
          <div className="pic reveal right" style={{ '--d': '.3s' }} {...tilt(14)}>
            <div className="orbit"><i></i><i></i><i></i></div>
            <img src="/kyawphoto.jpg" alt="Kyaw Nyein Chan Htwe" className={pulse ? 'pulse' : ''} onClick={() => setPulse(true)} onAnimationEnd={() => setPulse(false)} />
            <div className="chip a"><i className="fab fa-java" style={{ color: '#f7df1e' }}></i> Java</div>
            <div className="chip b"><i className="fa-brands fa-github" style={{ color: '#e44d26' }}></i> GitHub</div>
          </div>
        </div>
        <a className="scrollhint" href="#skills" aria-label="Scroll to skills"><i></i></a>
      </section>

      <div className="marq" aria-hidden="true"><div><Stack /></div></div>
      <div className="marq" aria-hidden="true"><div className="rev"><Stack /></div></div>
    </>
  )
}

function Stack() {
  return [...stack, ...stack].map((s, i) => (
    <span key={i}><i className="bx bxs-star" style={{ color: 'var(--cyan)' }}></i>{s}</span>
  ))
}
