const STORAGE_KEY = 'resumeBuilderData'
const TEMPLATE_KEY = 'resumeTemplate'
const COLOR_KEY = 'resumeColor'

const DEFAULT_DATA = {
  personal: { name: '', email: '', phone: '', location: '' },
  summary: '',
  education: [],
  experience: [],
  projects: [],
  skills: {
    technical: [],
    soft: [],
    tools: []
  },
  links: { github: '', linkedin: '' }
}

export function getResumeData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...JSON.parse(JSON.stringify(DEFAULT_DATA)) }
    const parsed = JSON.parse(raw)
    return { ...DEFAULT_DATA, ...parsed }
  } catch {
    return { ...JSON.parse(JSON.stringify(DEFAULT_DATA)) }
  }
}

export function saveResumeData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function getTemplate() {
  return localStorage.getItem(TEMPLATE_KEY) || 'classic'
}

export function saveTemplate(template) {
  localStorage.setItem(TEMPLATE_KEY, template)
}

export function getColor() {
  return localStorage.getItem(COLOR_KEY) || 'hsl(168, 60%, 40%)'
}

export function saveColor(color) {
  localStorage.setItem(COLOR_KEY, color)
}

// ATS Score (deterministic)
const ACTION_VERBS = ['built', 'led', 'designed', 'improved', 'created', 'developed', 'implemented', 'optimized', 'automated']
const NUM_PATTERN = /[\d%xkK]|[\d,]+\s*(k|m|%)/

export function computeATSScore(data) {
  let score = 0
  const p = data?.personal || {}
  const s = (data?.summary || '').trim()
  const edu = data?.education || []
  const exp = data?.experience || []
  const proj = data?.projects || []
  const skills = data?.skills || {}
  const links = data?.links || {}
  const allSkills = [
    ...(skills.technical || []),
    ...(skills.soft || []),
    ...(skills.tools || [])
  ]

  if (p.name?.trim()) score += 10
  if (p.email?.trim()) score += 10
  if (s.length > 50) score += 10
  if (exp.some(e => e.bullets?.length)) score += 15
  if (edu.length >= 1) score += 10
  if (allSkills.length >= 5) score += 10
  if (proj.length >= 1) score += 10
  if (p.phone?.trim()) score += 5
  if (links.linkedin?.trim()) score += 5
  if (links.github?.trim()) score += 5
  if (ACTION_VERBS.some(v => s.toLowerCase().includes(v))) score += 10

  return Math.min(100, score)
}

export function getATSSuggestions(data) {
  const suggestions = []
  const p = data?.personal || {}
  const s = (data?.summary || '').trim()
  const edu = data?.education || []
  const exp = data?.experience || []
  const proj = data?.projects || []
  const skills = data?.skills || {}
  const links = data?.links || {}
  const allSkills = [...(skills.technical || []), ...(skills.soft || []), ...(skills.tools || [])]

  if (!p.name?.trim()) suggestions.push('Add your name (+10 points)')
  if (!p.email?.trim()) suggestions.push('Add your email (+10 points)')
  if (s.length <= 50) suggestions.push('Write a stronger summary (50+ chars) (+10 points)')
  if (!exp.some(e => e.bullets?.length)) suggestions.push('Add experience with bullet points (+15 points)')
  if (edu.length < 1) suggestions.push('Add at least one education entry (+10 points)')
  if (allSkills.length < 5) suggestions.push('Add at least 5 skills (+10 points)')
  if (proj.length < 1) suggestions.push('Add at least one project (+10 points)')
  if (!p.phone?.trim()) suggestions.push('Add phone number (+5 points)')
  if (!links.linkedin?.trim()) suggestions.push('Add LinkedIn link (+5 points)')
  if (!links.github?.trim()) suggestions.push('Add GitHub link (+5 points)')
  if (!ACTION_VERBS.some(v => s.toLowerCase().includes(v))) suggestions.push('Use action verbs in summary (+10 points)')

  return suggestions.slice(0, 5)
}

const ACTION_VERBS_START = ['built', 'developed', 'designed', 'implemented', 'led', 'improved', 'created', 'optimized', 'automated']
const NUM_INDICATOR = /[\d%]|[0-9]+[kKmM]/

export function getTopImprovements(data) {
  const out = []
  const proj = data?.projects || []
  const exp = data?.experience || []
  const s = (data?.summary || '').trim()
  const allSkills = [
    ...(data?.skills?.technical || []),
    ...(data?.skills?.soft || []),
    ...(data?.skills?.tools || [])
  ]
  const bullets = [
    ...(exp.flatMap(e => e.bullets || [])),
    ...(proj.flatMap(p => (p.description ? [p.description] : [])))
  ]
  const hasNumbers = bullets.some(b => NUM_INDICATOR.test(b))
  const summaryWords = s.split(/\s+/).filter(Boolean).length

  if (proj.length < 2) out.push('Add at least 2 projects.')
  if (!hasNumbers && bullets.length > 0) out.push('Add measurable impact (numbers) in bullets.')
  if (summaryWords > 0 && summaryWords < 40) out.push('Expand summary (target 40–120 words).')
  if (allSkills.length < 8) out.push('Add more skills (target 8+).')
  if (exp.length === 0 && proj.length === 0) out.push('Add internship or project work.')

  return out.slice(0, 3)
}

export function getBulletHint(bullet) {
  const t = (bullet || '').trim()
  if (!t) return null
  const first = t.split(/\s+/)[0]?.toLowerCase() || ''
  const hasVerb = ACTION_VERBS_START.some(v => first.startsWith(v))
  const hasNum = NUM_INDICATOR.test(t)
  const hints = []
  if (!hasVerb) hints.push('Start with a strong action verb.')
  if (!hasNum) hints.push('Add measurable impact (numbers).')
  return hints.length ? hints.join(' ') : null
}

export const SAMPLE_DATA = {
  personal: {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA'
  },
  summary: 'Full-stack developer with 4+ years of experience building web applications. Led team of 5 engineers to deliver a 40% improvement in page load times. Built scalable APIs serving 1M+ daily requests.',
  education: [
    { degree: 'B.S. Computer Science', school: 'State University', year: '2020' }
  ],
  experience: [
    {
      role: 'Senior Software Engineer',
      company: 'Tech Corp',
      dates: '2021 – Present',
      bullets: ['Led team of 5 engineers; reduced load time by 40%', 'Built APIs serving 1M+ requests/day', 'Improved test coverage from 60% to 90%']
    }
  ],
  projects: [
    {
      title: 'AI Resume Builder',
      description: 'Web app with ATS scoring and template selection.',
      techStack: ['React', 'Vite'],
      liveUrl: '',
      githubUrl: 'https://github.com/example/ai-resume'
    }
  ],
  skills: {
    technical: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python'],
    soft: ['Team Leadership', 'Problem Solving'],
    tools: ['Git', 'Docker', 'AWS']
  },
  links: { github: 'https://github.com/janedoe', linkedin: 'https://linkedin.com/in/janedoe' }
}
