import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { fine, projects } from '../data.js'

const allTags = ['All', ...new Set(projects.flatMap((p) => p.tags))]

export default function Projects() {
  const [tag, setTag] = useState('All')
  const [q, setQ] = useState('')
  const [prevOff, setPrevOff] = useState(true)
  const [nextOff, setNextOff] = useState(false)
  const [flat, setFlat] = useState(false)
  const rail = useRef(null)
  const thumb = useRef(null)
  const drag = useRef({ dn: false, sx: 0, sl: 0, mv: 0 })

  const list = useMemo(
    () => projects.filter((p) => (tag === 'All' || p.tags.includes(tag)) && (p.title + ' ' + p.desc + ' ' + p.tags.join(' ')).toLowerCase().includes(q)),
    [tag, q]
  )

  /* coverflow effect: scale / rotate / fade by distance from the centre */
  const fx = () => {
    const r0 = rail.current
    const rc = r0.getBoundingClientRect(), cx = rc.left + rc.width / 2
    let best = null, bd = 1e9
    r0.querySelectorAll('.card').forEach((c) => {
      const r = c.getBoundingClientRect(), off = r.left + r.width / 2 - cx, d = off / (rc.width / 2), a = Math.min(Math.abs(d), 1.2)
      c.style.setProperty('--s', (1 - a * 0.12).toFixed(3))
      c.style.setProperty('--ry', (-d * 14).toFixed(1) + 'deg')
      c.style.setProperty('--o', (1 - a * 0.4).toFixed(2))
      if (Math.abs(off) < bd) { bd = Math.abs(off); best = c }
      c.classList.remove('act')
    })
    if (best) best.classList.add('act')
  }

  const upd = useCallback(() => {
    const r = rail.current
    if (!r) return
    fx()
    const max = r.scrollWidth - r.clientWidth
    const w = max > 0 ? Math.max((r.clientWidth / r.scrollWidth) * 100, 12) : 100
    thumb.current.style.width = w + '%'
    thumb.current.style.left = (max > 0 ? (r.scrollLeft / max) * (100 - w) : 0) + '%'
    setPrevOff(r.scrollLeft < 4)
    setNextOff(r.scrollLeft >= max - 4)
    setFlat(max <= 0)
  }, [])

  useEffect(() => { rail.current.scrollLeft = 0; upd() }, [list, upd])

  useEffect(() => {
    const io = new IntersectionObserver((es, o) => {
      if (es[0].isIntersecting) { rail.current.classList.add('go'); o.disconnect() }
    }, { threshold: 0.25 })
    io.observe(rail.current)
    addEventListener('resize', upd)
    const move = (e) => {
      const s = drag.current
      if (!s.dn) return
      const d = e.clientX - s.sx
      s.mv = Math.max(s.mv, Math.abs(d))
      if (s.mv > 4) { rail.current.style.scrollSnapType = 'none'; rail.current.scrollLeft = s.sl - d }
    }
    const up = () => {
      if (!drag.current.dn) return
      drag.current.dn = false
      rail.current.style.scrollSnapType = ''
    }
    addEventListener('pointermove', move)
    addEventListener('pointerup', up)
    return () => { io.disconnect(); removeEventListener('resize', upd); removeEventListener('pointermove', move); removeEventListener('pointerup', up) }
  }, [upd])

  const step = () => (rail.current.querySelector('.card')?.offsetWidth || 340) + 19
  const go = (dir) => rail.current.scrollBy({ left: dir * step(), behavior: 'smooth' })

  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return
    const c = e.target.closest('.card')
    if (!c) return
    const r = c.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height
    c.style.setProperty('--mx', px * 100 + '%')
    c.style.setProperty('--my', py * 100 + '%')
    if (fine) {
      c.style.setProperty('--ty', ((px - 0.5) * 8).toFixed(1) + 'deg')
      c.style.setProperty('--tx', (-(py - 0.5) * 8).toFixed(1) + 'deg')
    }
  }
  const onOut = (e) => {
    const c = e.target.closest('.card')
    if (!c || c.contains(e.relatedTarget)) return
    c.style.setProperty('--ty', '0deg')
    c.style.setProperty('--tx', '0deg')
  }

  return (
    <section id="portfolio">
      <div className="wrap">
        <h2 className="t reveal">My <b>Projects</b></h2>
        <p className="ts reveal">A collection of my recent projects</p>
        <div className="tools reveal">
          <label className="srch">
            <i className="bx bx-search"></i>
            <input type="search" placeholder="Search projects..." aria-label="Search projects" onChange={(e) => setQ(e.target.value.trim().toLowerCase())} />
          </label>
          <div className="fchips">
            {allTags.map((t) => (
              <button key={t} className={'fc' + (t === tag ? ' on' : '')} onClick={() => setTag(t)}>{t}</button>
            ))}
          </div>
        </div>

        <div className="rail" ref={rail} tabIndex={0} aria-label="Projects, scroll sideways to see more"
          onScroll={upd} onPointerMove={onMove} onPointerOut={onOut} onDragStart={(e) => e.preventDefault()}
          onPointerDown={(e) => { drag.current.mv = 0; if (e.pointerType !== 'mouse') return; Object.assign(drag.current, { dn: true, sx: e.clientX, sl: rail.current.scrollLeft }) }}
          onClickCapture={(e) => { if (drag.current.mv > 6) { e.preventDefault(); e.stopPropagation() } }}
          onKeyDown={(e) => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1) }}>
          {list.map((p, i) => (
            <article className="card" key={p.title} style={{ '--d': Math.min(i, 6) * 0.1 + 's' }}>
              <a className="pi" href={p.url} target="_blank" rel="noopener noreferrer">
                <img src={'/' + p.img} alt={p.title} loading="lazy" draggable="false" />
              </a>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
              <div className="pl">
                {p.tags.map((t) => <span className="tg" key={t}>{t}</span>)}
                <a className="gh" href={p.repo} target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i> {p.label}</a>
              </div>
            </article>
          ))}
        </div>
        {list.length === 0 && <p className="none">No projects match your search.</p>}

        <div className={'ctl' + (flat ? ' flat' : '')}>
          <span>{list.length} project{list.length === 1 ? '' : 's'}</span>
          <div className="trk"><i ref={thumb}></i></div>
          <div className="arr">
            <button aria-label="Previous projects" disabled={prevOff} onClick={() => go(-1)}><i className="bx bx-left-arrow-alt"></i></button>
            <button aria-label="Next projects" disabled={nextOff} onClick={() => go(1)}><i className="bx bx-right-arrow-alt"></i></button>
          </div>
        </div>
      </div>
    </section>
  )
}
