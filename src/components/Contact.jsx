import { useState } from 'react'

const info = [
  ['bx bxs-envelope', 'knchtwe@gmail.com'],
  ['bx bxs-phone', '+95 9 673586673'],
  ['bx bxs-map', 'Pyin Oo Lwin, Myanmar'],
]
const socials = [
  ['https://www.facebook.com/share/1Cj6KyDR1V/', 'Facebook', 'fa-brands fa-facebook'],
  ['https://tiktok.com/@yuto_koi?_r=1&_t=ZS-95MkWdwy1DB', 'TikTok', 'fa-brands fa-tiktok'],
  ['https://t.me/yuto_koi', 'Telegram', 'fa-brands fa-telegram'],
  ['https://github.com/yUto-koi', 'GitHub', 'fa-brands fa-github'],
  ['https://www.linkedin.com/in/kyawnyeinchanhtwe', 'Linkedin', 'fa-brands fa-linkedin'],
]

export default function Contact({ showAlert }) {
  const [sending, setSending] = useState(false)

  const copy = async (text) => {
    try { await navigator.clipboard.writeText(text); showAlert('ok', 'Copied!', text + ' is on your clipboard.') } catch {}
  }

  const submit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const payload = Object.fromEntries(new FormData(form).entries())
    setSending(true)
    try {
      const res = await fetch('/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        showAlert('ok', 'Message sent!', 'Thank you! I will get back to you soon.')
        form.reset()
      } else {
        let err = {}
        try { err = JSON.parse(await res.text()) } catch {}
        showAlert('err', 'Something went wrong', err.error || `The message service returned an error (${res.status}). Please try again later.`)
      }
    } catch {
      showAlert('err', 'Connection error', 'Failed to send message. Please check your connection.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="contact">
      <div className="wrap">
        <h2 className="t reveal">Contact <b>Me</b></h2>
        <p className="ts reveal">Let's build something amazing together.</p>
        <div className="ct">
          <div className="reveal left">
            <h3>Let's work together!</h3>
            <p>I am available for freelance work and collaboration opportunities. Reach out and let's build something amazing together.</p>
            {info.map(([icon, text]) => (
              <div className="ci" key={text} role="button" tabIndex={0} title="Tap to copy"
                onClick={() => copy(text)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); copy(text) } }}>
                <i className={icon}></i><span>{text}</span>
              </div>
            ))}
            <div className="soc">
              {socials.map(([href, label, icon]) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}><i className={icon}></i></a>
              ))}
            </div>
          </div>
          <form id="myContactForm" className="reveal right" onSubmit={submit}>
            <div className="f"><input type="text" name="name" placeholder=" " required /><label>Your Name</label></div>
            <div className="f"><input type="email" name="email" placeholder=" " required /><label>Your Email</label></div>
            <div className="f"><textarea name="message" placeholder=" " required></textarea><label>Your Message</label></div>
            <button type="submit" className="btn mag" disabled={sending} style={{ opacity: sending ? 0.7 : 1 }}>
              {sending ? <>Sending... <i className="bx bx-loader-alt bx-spin"></i></> : <>Send Message <i className="bx bx-send"></i></>}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
