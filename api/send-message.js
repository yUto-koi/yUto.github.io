// Vercel serverless function: receives the contact form and sends it to your Telegram.
// Environment variables (set in Vercel): TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID.
// Common alternative names are also accepted, see the two lines below.

const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  const { name, email, message } = req.body || {}
  if (!name || !email || !message) return res.status(400).json({ error: 'Please fill in your name, email and message.' })
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Please enter a valid email address.' })
  if (name.length > 100 || email.length > 200 || message.length > 3000) return res.status(400).json({ error: 'Your message is too long.' })

  const env = process.env
  const token = env.TELEGRAM_BOT_TOKEN || env.BOT_TOKEN || env.TELEGRAM_TOKEN
  const chatId = env.TELEGRAM_CHAT_ID || env.CHAT_ID || env.TELEGRAM_ID
  if (!token || !chatId) return res.status(500).json({ error: 'The message service is not set up yet.' })

  const text = `📩 <b>New portfolio message</b>\n\n<b>Name:</b> ${esc(name)}\n<b>Email:</b> ${esc(email)}\n\n<b>Message:</b>\n${esc(message)}`

  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true }),
    })
    if (!r.ok) return res.status(502).json({ error: 'Could not send the message. Please try again later.' })
    return res.status(200).json({ ok: true })
  } catch {
    return res.status(500).json({ error: 'Something went wrong. Please try again later.' })
  }
}
