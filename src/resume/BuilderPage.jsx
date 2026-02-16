import { useState, useEffect, useCallback } from 'react'
import ResumeLayout from './ResumeLayout'
import { getResumeData, saveResumeData, SAMPLE_DATA, computeATSScore, getATSSuggestions, getTopImprovements, getBulletHint, getTemplate, saveTemplate, getColor, saveColor } from './resumeStore'
import ResumePreview from './ResumePreview'
import './BuilderPage.css'

const TEMPLATES = ['classic', 'modern', 'minimal']
const COLORS = [
  { name: 'Teal', value: 'hsl(168, 60%, 40%)' },
  { name: 'Navy', value: 'hsl(220, 60%, 35%)' },
  { name: 'Burgundy', value: 'hsl(345, 60%, 35%)' },
  { name: 'Forest', value: 'hsl(150, 50%, 30%)' },
  { name: 'Charcoal', value: 'hsl(0, 0%, 25%)' }
]

export default function BuilderPage() {
  const [data, setData] = useState(getResumeData)
  const [template, setTemplate] = useState(getTemplate)
  const [accentColor, setAccentColor] = useState(getColor)

  const persist = useCallback((next) => {
    setData(next)
    saveResumeData(next)
  }, [])

  useEffect(() => {
    const stored = getResumeData()
    setData(stored)
  }, [])

  const loadSample = () => {
    setData(JSON.parse(JSON.stringify(SAMPLE_DATA)))
    saveResumeData(SAMPLE_DATA)
  }

  const updatePersonal = (field, value) => {
    const next = { ...data, personal: { ...data.personal, [field]: value } }
    persist(next)
  }

  const updateSummary = (v) => persist({ ...data, summary: v })

  const updateEducation = (i, field, value) => {
    const edu = [...(data.education || [])]
    if (!edu[i]) edu[i] = {}
    edu[i] = { ...edu[i], [field]: value }
    persist({ ...data, education: edu })
  }

  const addEducation = () => {
    persist({ ...data, education: [...(data.education || []), {}] })
  }

  const removeEducation = (i) => {
    const edu = [...(data.education || [])]
    edu.splice(i, 1)
    persist({ ...data, education: edu })
  }

  const updateExperience = (i, field, value) => {
    const exp = [...(data.experience || [])]
    if (!exp[i]) exp[i] = {}
    if (field === 'bullets') {
      exp[i].bullets = Array.isArray(value) ? value : (value || '').split('\n').filter(Boolean)
    } else if (field === 'bullet' && typeof value === 'object') {
      const { bulletIndex, text } = value
      const bullets = [...(exp[i].bullets || [])]
      bullets[bulletIndex] = text
      exp[i].bullets = bullets.filter(Boolean)
    } else {
      exp[i][field] = value
    }
    persist({ ...data, experience: exp })
  }

  const addExperience = () => {
    persist({ ...data, experience: [...(data.experience || []), { role: '', company: '', dates: '', bullets: [] }] })
  }

  const removeExperience = (i) => {
    const exp = [...(data.experience || [])]
    exp.splice(i, 1)
    persist({ ...data, experience: exp })
  }

  const updateProject = (i, field, value) => {
    const proj = [...(data.projects || [])]
    if (!proj[i]) proj[i] = {}
    proj[i][field] = value
    persist({ ...data, projects: proj })
  }

  const addProject = () => {
    persist({ ...data, projects: [...(data.projects || []), { title: '', description: '', techStack: [], liveUrl: '', githubUrl: '' }] })
  }

  const removeProject = (i) => {
    const proj = [...(data.projects || [])]
    proj.splice(i, 1)
    persist({ ...data, projects: proj })
  }

  const addSkill = (category, skill) => {
    const skills = { ...data.skills }
    if (!skills[category]) skills[category] = []
    if (skill && !skills[category].includes(skill)) {
      skills[category] = [...skills[category], skill]
      persist({ ...data, skills })
    }
  }

  const removeSkill = (category, skill) => {
    const skills = { ...data.skills }
    if (!skills[category]) return
    skills[category] = skills[category].filter(s => s !== skill)
    persist({ ...data, skills })
  }

  const suggestSkills = () => {
    const skills = { ...data.skills }
    const tech = ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'GraphQL']
    const soft = ['Team Leadership', 'Problem Solving']
    const tools = ['Git', 'Docker', 'AWS']
    tech.forEach(s => { if (!(skills.technical || []).includes(s)) (skills.technical = skills.technical || []).push(s) })
    soft.forEach(s => { if (!(skills.soft || []).includes(s)) (skills.soft = skills.soft || []).push(s) })
    tools.forEach(s => { if (!(skills.tools || []).includes(s)) (skills.tools = skills.tools || []).push(s) })
    persist({ ...data, skills })
  }

  const updateLinks = (field, value) => {
    persist({ ...data, links: { ...data.links, [field]: value } })
  }

  const score = computeATSScore(data)
  const suggestions = getATSSuggestions(data)
  const topImprovements = getTopImprovements(data)

  const handleTemplateChange = (t) => {
    setTemplate(t)
    saveTemplate(t)
  }

  const handleColorChange = (c) => {
    setAccentColor(c)
    saveColor(c)
  }

  return (
    <ResumeLayout>
      <div className="builder-page">
        <div className="builder-form-col">
          <button type="button" className="btn-load-sample" onClick={loadSample}>
            Load Sample Data
          </button>

          <section className="form-section">
            <h3>Personal Info</h3>
            <input value={data.personal?.name || ''} onChange={(e) => updatePersonal('name', e.target.value)} placeholder="Name" />
            <input value={data.personal?.email || ''} onChange={(e) => updatePersonal('email', e.target.value)} placeholder="Email" />
            <input value={data.personal?.phone || ''} onChange={(e) => updatePersonal('phone', e.target.value)} placeholder="Phone" />
            <input value={data.personal?.location || ''} onChange={(e) => updatePersonal('location', e.target.value)} placeholder="Location" />
          </section>

          <section className="form-section">
            <h3>Summary</h3>
            <textarea value={data.summary || ''} onChange={(e) => updateSummary(e.target.value)} placeholder="Professional summary (40–120 words recommended)" rows={4} />
          </section>

          <section className="form-section">
            <h3>Education</h3>
            {(data.education || []).map((e, i) => (
              <div key={i} className="entry-block">
                <input value={e.degree || ''} onChange={(ev) => updateEducation(i, 'degree', ev.target.value)} placeholder="Degree" />
                <input value={e.school || ''} onChange={(ev) => updateEducation(i, 'school', ev.target.value)} placeholder="School" />
                <input value={e.year || ''} onChange={(ev) => updateEducation(i, 'year', ev.target.value)} placeholder="Year" />
                <button type="button" className="btn-remove" onClick={() => removeEducation(i)}>Remove</button>
              </div>
            ))}
            <button type="button" className="btn-add" onClick={addEducation}>Add Education</button>
          </section>

          <section className="form-section">
            <h3>Experience</h3>
            {(data.experience || []).map((e, i) => (
              <div key={i} className="entry-block">
                <input value={e.role || ''} onChange={(ev) => updateExperience(i, 'role', ev.target.value)} placeholder="Role" />
                <input value={e.company || ''} onChange={(ev) => updateExperience(i, 'company', ev.target.value)} placeholder="Company" />
                <input value={e.dates || ''} onChange={(ev) => updateExperience(i, 'dates', ev.target.value)} placeholder="Dates" />
                {(e.bullets || []).map((b, j) => (
                  <div key={j} className="bullet-row">
                    <input
                      value={b}
                      onChange={(ev) => updateExperience(i, 'bullet', { bulletIndex: j, text: ev.target.value })}
                      placeholder="Bullet point"
                    />
                    {getBulletHint(b) && <span className="bullet-hint">{getBulletHint(b)}</span>}
                  </div>
                ))}
                <button type="button" className="btn-add-bullet" onClick={() => updateExperience(i, 'bullets', [...(e.bullets || []), ''])}>+ Add bullet</button>
                <button type="button" className="btn-remove" onClick={() => removeExperience(i)}>Remove</button>
              </div>
            ))}
            <button type="button" className="btn-add" onClick={addExperience}>Add Experience</button>
          </section>

          <section className="form-section">
            <h3>Projects</h3>
            {(data.projects || []).map((p, i) => (
              <div key={i} className="project-block">
                <input value={p.title || ''} onChange={(e) => updateProject(i, 'title', e.target.value)} placeholder="Project Title" />
                <textarea value={p.description || ''} onChange={(e) => updateProject(i, 'description', e.target.value)} placeholder="Description (max 200 chars)" maxLength={200} rows={2} />
                {getBulletHint(p.description) && <span className="bullet-hint">{getBulletHint(p.description)}</span>}
                <span className="char-count">{(p.description || '').length}/200</span>
                <input
                  value={Array.isArray(p.techStack) ? p.techStack.join(', ') : (p.techStack || '')}
                  onChange={(e) => updateProject(i, 'techStack', (e.target.value || '').split(',').map(s => s.trim()).filter(Boolean))}
                  placeholder="Tech stack (comma-separated)"
                />
                <input value={p.liveUrl || ''} onChange={(e) => updateProject(i, 'liveUrl', e.target.value)} placeholder="Live URL" type="url" />
                <input value={p.githubUrl || ''} onChange={(e) => updateProject(i, 'githubUrl', e.target.value)} placeholder="GitHub URL" type="url" />
                <button type="button" className="btn-remove" onClick={() => removeProject(i)}>Remove</button>
              </div>
            ))}
            <button type="button" className="btn-add" onClick={addProject}>Add Project</button>
          </section>

          <SkillsSection data={data} addSkill={addSkill} removeSkill={removeSkill} suggestSkills={suggestSkills} persist={persist} />
          <section className="form-section">
            <h3>Links</h3>
            <input value={data.links?.github || ''} onChange={(e) => updateLinks('github', e.target.value)} placeholder="GitHub URL" type="url" />
            <input value={data.links?.linkedin || ''} onChange={(e) => updateLinks('linkedin', e.target.value)} placeholder="LinkedIn URL" type="url" />
          </section>
        </div>

        <div className="builder-preview-col">
          <div className="template-picker">
            {TEMPLATES.map(t => (
              <button key={t} type="button" className={`template-btn ${template === t ? 'active' : ''}`} onClick={() => handleTemplateChange(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <div className="color-picker">
            {COLORS.map(c => (
              <button key={c.value} type="button" className="color-btn" style={{ background: c.value }} title={c.name} onClick={() => handleColorChange(c.value)} />
            ))}
          </div>
          <div className="ats-block">
            <div className={`ats-meter ats-${score <= 40 ? 'red' : score <= 70 ? 'amber' : 'green'}`}>
              <span className="ats-value">{score}</span>
            </div>
            <span className="ats-label">ATS Readiness Score</span>
            {suggestions.length > 0 && (
              <ul className="ats-suggestions">
                {suggestions.slice(0, 3).map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            )}
            {topImprovements.length > 0 && (
              <div className="top-improvements">
                <strong>Top 3 Improvements</strong>
                <ul>
                  {topImprovements.map((imp, i) => <li key={i}>{imp}</li>)}
                </ul>
              </div>
            )}
          </div>
          <ResumePreview data={data} template={template} accentColor={accentColor} />
        </div>
      </div>
    </ResumeLayout>
  )
}

function SkillsSection({ data, addSkill, removeSkill, suggestSkills }) {
  const [input, setInput] = useState({ technical: '', soft: '', tools: '' })
  const categories = [
    { key: 'technical', label: 'Technical Skills' },
    { key: 'soft', label: 'Soft Skills' },
    { key: 'tools', label: 'Tools & Technologies' }
  ]

  const handleKeyDown = (cat, e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const val = (input[cat] || '').trim()
      if (val) { addSkill(cat, val); setInput({ ...input, [cat]: '' }) }
    }
  }

  return (
    <section className="form-section skills-section">
      <h3>Skills</h3>
      <button type="button" className="btn-suggest" onClick={suggestSkills}>✨ Suggest Skills</button>
      {categories.map(({ key, label }) => {
        const list = data.skills?.[key] || []
        return (
          <div key={key} className="skill-category">
            <label>{label} ({list.length})</label>
            <input
              value={input[key] || ''}
              onChange={(e) => setInput({ ...input, [key]: e.target.value })}
              onKeyDown={(e) => handleKeyDown(key, e)}
              placeholder="Type and press Enter"
            />
            <div className="skill-pills">
              {list.map(s => (
                <span key={s} className="pill">
                  {s} <button type="button" className="pill-x" onClick={() => removeSkill(key, s)}>×</button>
                </span>
              ))}
            </div>
          </div>
        )
      })}
    </section>
  )
}
