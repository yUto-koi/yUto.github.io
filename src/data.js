export const calm = matchMedia('(prefers-reduced-motion:reduce)').matches
export const fine = matchMedia('(hover:hover) and (pointer:fine)').matches
export const RC = 2 * Math.PI * 46
export const NAME = 'Kyaw Nyein Chan Htwe (yUto)'
export const roles = ['Beginner Web Developer', 'CS Student at UCSY', 'Front-end Enthusiast', 'Clean Code Learner']
export const stack = ['HTML5', 'CSS3', 'JavaScript', 'Java', 'MySQL', 'Git & GitHub', 'Responsive Design', 'Vercel']
export const labels = { '#home': 'Home', '#skills': 'Skills', '#portfolio': 'Projects', '#contact': 'Contact' }
export const skills = [
  { icon: 'fab fa-html5', color: '#e44d26', name: 'HTML', v: 70 },
  { icon: 'fab fa-css3-alt', color: '#3b82f6', name: 'CSS', v: 60 },
  { icon: 'fab fa-js', color: '#f7df1e', name: 'JavaScript', v: 30 },
  { icon: 'fab fa-java', color: '#f89820', name: 'Java', v: 10 },
  { icon: 'fas fa-database', color: '#22d3ee', name: 'MySQL Database', v: 5 },
]
export const projects = [
  { title: 'Smart Meter Bill Calculator', desc: 'An electricity bill calculator for Myanmar using smart meter rates.', url: 'https://smart-meter-calc.vercel.app/', img: 'meter.jpg', tags: ['HTML', 'CSS', 'JavaScript'], repo: 'https://github.com/yUto-ship-it/smart-meter-calc', label: 'Code' },
  { title: 'WanderWise 360', desc: 'A travel guide web app for exploring destinations worldwide.', url: 'https://wanderwise360.vercel.app/', img: 'wander.jpg', tags: ['HTML', 'CSS', 'JavaScript'], repo: 'https://github.com/yUto-ship-it/wanderWise360', label: 'Code' },
  { title: 'Expense Tracker for Myanmar', desc: 'A personal finance tracker designed for Myanmar users.', url: 'https://tracker-yuto.vercel.app/', img: 'tracker.jpg', tags: ['HTML', 'CSS', 'JavaScript'], repo: 'https://github.com/yUto-ship-it/tracker', label: 'Code' },
  { title: 'UCSY Smart Roll Call', desc: 'Automated attendance with QR/face recognition & CSV export.', url: 'https://ucsy-roll-calling.vercel.app/', img: 'rollcall.jpg', tags: ['HTML', 'CSS', 'JavaScript'], repo: 'https://github.com/yUto-ship-it/UCSY-Roll-calling', label: 'Code' },
  { title: 'KN Bank — Java Console System', desc: 'Educational Java and MySQL console banking app with accounts & transfers.', url: 'https://github.com/yUto-ship-it/KN-Bank-Java-Console-Banking-Application', img: 'bank.jpg', tags: ['Java', 'MySQL', 'JDBC Driver'], repo: 'https://github.com/yUto-ship-it/KN-Bank-Java-Console-Banking-Application', label: 'Repo' },
]
