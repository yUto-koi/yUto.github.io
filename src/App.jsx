import { useCallback, useEffect, useRef, useState } from 'react'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Skills from './components/Skills.jsx'
import Projects from './components/Projects.jsx'
import Contact from './components/Contact.jsx'
import AlertBox from './components/AlertBox.jsx'
import { useScrollUI } from './hooks.js'
import { calm, labels } from './data.js'

export default function App() {
  const [ready, setReady] = useState(false)
  const [loaderGone, setLoaderGone] = useState(false)
  const [alert, setAlert] = useState({ open: false, n: 0 })
  const [pt, setPt] = useState({ cls: '', label: '' })
  const [progress, showTop] = useScrollUI()
  const timer = useRef()
  const busy = useRef(false)

  /* alert box */
  const closeAlert = useCallback(() => { clearTimeout(timer.current); setAlert((a) => ({ ...a, open: false })) }, [])
  const showAlert = useCallback((type, title, text) => {
    clearTimeout(timer.current)
    setAlert((a) => ({ open: true, n: a.n + 1, type, title, text }))
    timer.current = setTimeout(closeAlert, 6000)
  }, [closeAlert])

  /* intro loader: show for at least 2s, then reveal the page */
  useEffect(() => {
    const t0 = performance.now()
    let done = false
    const begin = () => {
      if (done) return
      done = true
      setReady(true)
      setTimeout(() => setLoaderGone(true), 1100)
    }
    const go = () => setTimeout(begin, Math.max(0, 2000 - (performance.now() - t0)))
    if (document.readyState === 'complete') go(); else addEventListener('load', go, { once: true })
    const fallback = setTimeout(begin, 5000)
    return () => clearTimeout(fallback)
  }, [])
  useEffect(() => { document.body.classList.toggle('loading', !ready) }, [ready])

  /* scroll reveal */
  useEffect(() => {
    if (!ready) return
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
    }), { threshold: 0.15 })
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [ready])

  /* section transition: bars sweep up, jump, sweep away */
  const goTo = useCallback((id) => {
    const t = document.querySelector(id)
    if (!t || busy.current) return
    if (calm) { t.scrollIntoView(); return }
    busy.current = true
    setPt({ cls: 'in', label: labels[id] || '' })
    setTimeout(() => {
      t.scrollIntoView({ behavior: 'instant' })
      history.replaceState(null, '', id)
      setPt((p) => ({ ...p, cls: 'out' }))
    }, 850)
    setTimeout(() => { setPt((p) => ({ ...p, cls: '' })); busy.current = false }, 1550)
  }, [])

  /* global pointer effects: cursor glow, parallax, magnetic buttons, ripple, anchors, Esc */
  useEffect(() => {
    const cur = document.getElementById('cur')
    const move = (e) => {
      if (e.pointerType !== 'mouse') return
      cur.style.left = e.clientX + 'px'
      cur.style.top = e.clientY + 'px'
      const d = document.documentElement.style
      d.setProperty('--px', (e.clientX / innerWidth - 0.5) * 2)
      d.setProperty('--py', (e.clientY / innerHeight - 0.5) * 2)
      const b = e.target.closest?.('.mag')
      if (b) {
        const r = b.getBoundingClientRect()
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.2}px,${(e.clientY - r.top - r.height / 2) * 0.3}px)`
      }
    }
    const out = (e) => {
      const b = e.target.closest?.('.mag')
      if (b && !b.contains(e.relatedTarget)) b.style.transform = ''
    }
    const click = (e) => {
      const a = e.target.closest('a[href^="#"]')
      if (a && a.getAttribute('href') !== '#') { e.preventDefault(); goTo(a.getAttribute('href')); return }
      const b = e.target.closest('.btn')
      if (!b || b.closest('.ab')) return
      const r = b.getBoundingClientRect(), s = Math.max(r.width, r.height), d = document.createElement('span')
      d.className = 'rip'
      d.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`
      b.appendChild(d)
      setTimeout(() => d.remove(), 600)
    }
    const key = (e) => e.key === 'Escape' && closeAlert()
    addEventListener('pointermove', move)
    document.addEventListener('pointerout', out)
    document.addEventListener('click', click)
    addEventListener('keydown', key)
    return () => {
      removeEventListener('pointermove', move)
      document.removeEventListener('pointerout', out)
      document.removeEventListener('click', click)
      removeEventListener('keydown', key)
    }
  }, [goTo, closeAlert])

  return (
    <>
      {!loaderGone && (
        <div id="loader" className={ready ? 'done' : ''} aria-hidden="true">
          <div className="lg"><b>yUto</b><small>Kyaw Nyein Chan Htwe</small><div className="lb"><i></i></div></div>
        </div>
      )}
      <div id="pt" className={pt.cls} aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => <i key={i} style={{ '--i': i }}></i>)}<b>{pt.label}</b>
      </div>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#3b82f6" /><stop offset="1" stopColor="#22d3ee" /></linearGradient></defs>
      </svg>
      <div className="site-background" aria-hidden="true"></div>
      <div className="aurora"></div>
      <div id="cur"></div>
      <div id="prog" style={{ width: progress + '%' }}></div>

      <Nav />
      <Hero ready={ready} />
      <Skills />
      <Projects />
      <Contact showAlert={showAlert} />
      <footer className="reveal">&copy; 2026 Kyaw Nyein Chan Htwe (yUto). All Rights Reserved.</footer>

      <button id="top" className={showTop ? 'show' : ''} aria-label="Back to top" onClick={() => goTo('#home')}><i className="bx bx-up-arrow-alt"></i></button>
      <AlertBox a={alert} onClose={closeAlert} />
    </>
  )
}
