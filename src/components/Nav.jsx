import { useEffect, useState } from 'react'

const items = [
  ['#home', 'bx bxs-home', 'Home'],
  ['#skills', 'bx bxs-user', 'Skills'],
  ['#portfolio', 'bx bxs-briefcase', 'Projects'],
  ['#contact', 'bx bxs-envelope', 'Contact'],
]

export default function Nav() {
  const [on, setOn] = useState('#home')
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setOn('#' + e.target.id)),
      { rootMargin: '-45% 0px -45% 0px' }
    )
    document.querySelectorAll('section').forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])
  return (
    <nav id="nav" aria-label="Main">
      {items.map(([href, icon, text]) => (
        <a key={href} href={href} className={on === href ? 'on' : ''}>
          <i className={icon}></i><span>{text}</span>
        </a>
      ))}
    </nav>
  )
}
