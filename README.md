# yUto Portfolio (React + Vite)

## Run
1. Copy your images into `public/` (see `public/README.txt`).
2. `npm install`
3. `npm run dev`   (open the local link it prints)
4. `npm run build` to make the production build in `dist/`

## Deploy on Vercel
Push this folder to GitHub and import it in Vercel. Framework: Vite. If you already have an `api/send-message` function for the contact form, copy your `api/` folder into the project root.

## Structure
- `src/index.css`  all styles (dark blue theme, animations, mobile rules)
- `src/data.js`    skills, projects, roles: edit your content here
- `src/components` Nav, Hero, Skills, Projects, Contact, AlertBox

## Contact form (api/send-message.js)
The form sends each message to your Telegram bot chat. In Vercel, Settings, Environment Variables, add `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`, then redeploy. You must have pressed Start on your bot at least once. `npm run dev` does not run `/api`; use `npx vercel dev` to test locally.
