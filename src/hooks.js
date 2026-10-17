import { useEffect, useState } from 'react'
import { fine } from './data.js'

export function useScrollUI() {
  const [progress, setProgress] = useState(0)
  const [showTop, setShowTop] = useState(false)
  useEffect(() => {
    const f = () => {
      const h = document.documentElement
      setProgress((scrollY / (h.scrollHeight - innerHeight)) * 100)
      setShowTop(scrollY > 600)
    }
    addEventListener('scroll', f, { passive: true })
    return () => removeEventListener('scroll', f)
  }, [])
  return [progress, showTop]
}

/* mouse-only 3D tilt: spread the result onto an element */
export const tilt = (max) => ({
  onPointerMove(e) {
    if (e.pointerType !== 'mouse' || !fine) return
    const el = e.currentTarget, r = el.getBoundingClientRect()
    el.style.setProperty('--ty', (((e.clientX - r.left) / r.width - 0.5) * max).toFixed(1) + 'deg')
    el.style.setProperty('--tx', (-((e.clientY - r.top) / r.height - 0.5) * max).toFixed(1) + 'deg')
  },
  onPointerLeave(e) {
    e.currentTarget.style.setProperty('--ty', '0deg')
    e.currentTarget.style.setProperty('--tx', '0deg')
  },
})
