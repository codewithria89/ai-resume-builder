import { useState, useEffect } from 'react'
import ResumeLayout from './ResumeLayout'
import { getResumeData, computeATSScore, getATSSuggestions, getTemplate, getColor, saveTemplate, saveColor } from './resumeStore'

const COLORS = [
  { name: 'Teal', value: 'hsl(168, 60%, 40%)' },
  { name: 'Navy', value: 'hsl(220, 60%, 35%)' },
  { name: 'Burgundy', value: 'hsl(345, 60%, 35%)' },
  { name: 'Forest', value: 'hsl(150, 50%, 30%)' },
  { name: 'Charcoal', value: 'hsl(0, 0%, 25%)' }
]
import ResumePreview from './ResumePreview'
import './PreviewPage.css'

export default function PreviewPage() {
  const [data, setData] = useState(getResumeData)
  const [template, setTemplate] = useState(getTemplate)
  const [color, setColor] = useState(getColor)

  useEffect(() => {
    setData(getResumeData())
    setTemplate(getTemplate())
    setColor(getColor())
  }, [])

  const score = computeATSScore(data)
  const suggestions = getATSSuggestions(data)

  const handlePrint = () => {
    window.print()
  }

  const handleCopyText = () => {
    const p = data?.personal || {}
    const lines = [
      p.name || '',
      [p.email, p.phone, p.location].filter(Boolean).join(' | '),
      '',
      data?.summary ? `Summary\n${data.summary}` : '',
      '',
      (data?.education || []).length ? 'Education\n' + (data.education || []).map(e => `${e.degree} — ${e.school} ${e.year || ''}`).join('\n') : '',
      '',
      (data?.experience || []).length ? 'Experience\n' + (data.experience || []).map(ex => `${ex.role} — ${ex.company}\n${(ex.bullets || []).join('\n')}`).join('\n\n') : '',
      '',
      (data?.projects || []).length ? 'Projects\n' + (data.projects || []).map(pr => `${pr.title}: ${pr.description || ''}`).join('\n') : '',
      '',
      'Skills',
      [...(data?.skills?.technical || []), ...(data?.skills?.soft || []), ...(data?.skills?.tools || [])].join(', '),
      '',
      'Links',
      data?.links?.github ? `GitHub: ${data.links.github}` : '',
      data?.links?.linkedin ? `LinkedIn: ${data.links.linkedin}` : ''
    ]
    navigator.clipboard.writeText(lines.filter(Boolean).join('\n'))
  }

  const handleExportPdf = () => {
    handlePrint()
    // Toast would show after print dialog - simplified
    if (typeof window !== 'undefined' && window.alert) {
      setTimeout(() => {
        const toast = document.createElement('div')
        toast.className = 'toast'
        toast.textContent = 'PDF export ready! Check your downloads.'
        document.body.appendChild(toast)
        setTimeout(() => toast.remove(), 3000)
      }, 500)
    }
  }

  const hasName = !!(data?.personal?.name || '').trim()
  const hasProjectOrExp = ((data?.projects || []).length > 0) || ((data?.experience || []).length > 0)
  const showIncompleteWarning = !hasName || !hasProjectOrExp

  return (
    <ResumeLayout>
      <div className="preview-page">
        <div className="preview-toolbar">
          <div className="template-picker">
            {['classic', 'modern', 'minimal'].map(t => (
              <button key={t} type="button" className={`template-btn ${template === t ? 'active' : ''}`} onClick={() => { setTemplate(t); saveTemplate(t); }}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <div className="color-picker">
            {COLORS.map(c => (
              <button key={c.value} type="button" className={`color-btn ${color === c.value ? 'active' : ''}`} style={{ background: c.value }} title={c.name} onClick={() => { setColor(c.value); saveColor(c.value); }} />
            ))}
          </div>
          <div className="export-buttons">
            <button type="button" className="btn-export" onClick={handleExportPdf}>
              Print / Save as PDF
            </button>
            <button type="button" className="btn-export" onClick={handleCopyText}>
              Copy Resume as Text
            </button>
          </div>
        </div>

        {showIncompleteWarning && (
          <div className="incomplete-warning">
            Your resume may look incomplete.
          </div>
        )}

        <div className="preview-content">
          <aside className="score-sidebar">
            <div className={`ats-circle ats-${score <= 40 ? 'red' : score <= 70 ? 'amber' : 'green'}`}>
              <span>{score}</span>
            </div>
            <p className="score-label">
              {score <= 40 ? 'Needs Work' : score <= 70 ? 'Getting There' : 'Strong Resume'}
            </p>
            {suggestions.length > 0 && (
              <ul className="improvement-list">
                {suggestions.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            )}
          </aside>
          <div className="preview-resume-wrapper print-area">
            <ResumePreview data={data} template={template} accentColor={color} />
          </div>
        </div>
      </div>
    </ResumeLayout>
  )
}
