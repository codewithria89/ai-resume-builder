import { useState, useEffect } from 'react'
import { getStepArtifacts, getChecklistTests, setChecklistTest } from './KodNestLayout'
import './RBProof.css'

const STEPS = [
  '01-problem', '02-market', '03-architecture', '04-hld',
  '05-lld', '06-build', '07-test', '08-ship'
]

const CHECKLIST_ITEMS = [
  'Form sections save to localStorage',
  'Live preview updates in real-time',
  'Template switching preserves data',
  'Color theme persists after refresh',
  'ATS score calculates correctly',
  'Score updates live on edit',
  'Export buttons work (copy/download)',
  'Empty states handled gracefully',
  'Mobile responsive layout works',
  'No console errors on any page'
]

const SUBMISSION_KEY = 'rb_final_submission'

function isValidUrl(s) {
  if (!s || typeof s !== 'string') return false
  try {
    new URL(s.trim())
    return true
  } catch {
    return false
  }
}

export default function RBProof({ steps }) {
  const [artifacts, setArtifacts] = useState({})
  const [checklist, setChecklist] = useState({})
  const [submission, setSubmission] = useState({
    lovable: '',
    github: '',
    deploy: ''
  })

  useEffect(() => {
    setArtifacts(getStepArtifacts())
    setChecklist(getChecklistTests())
    try {
      const s = JSON.parse(localStorage.getItem(SUBMISSION_KEY) || '{}')
      setSubmission({
        lovable: s.lovable || '',
        github: s.github || '',
        deploy: s.deploy || ''
      })
    } catch {
      // ignore
    }
  }, [])

  const allStepsDone = STEPS.every(s => !!artifacts[s])
  const checklistPassed = CHECKLIST_ITEMS.every((_, i) => checklist[`check_${i}`])
  const hasLovable = isValidUrl(submission.lovable)
  const hasGithub = isValidUrl(submission.github)
  const hasDeploy = isValidUrl(submission.deploy)
  const canShip = allStepsDone && checklistPassed && hasLovable && hasGithub && hasDeploy

  const saveSubmission = (field, value) => {
    const next = { ...submission, [field]: value }
    setSubmission(next)
    localStorage.setItem(SUBMISSION_KEY, JSON.stringify(next))
  }

  const toggleChecklist = (id, checked) => {
    setChecklistTest(id, checked)
    setChecklist(prev => ({ ...prev, [id]: checked }))
  }

  const copyFinalSubmission = () => {
    const text = `------------------------------------------
AI Resume Builder — Final Submission

Lovable Project: ${submission.lovable}
GitHub Repository: ${submission.github}
Live Deployment: ${submission.deploy}

Core Capabilities:
- Structured resume builder
- Deterministic ATS scoring
- Template switching
- PDF export with clean formatting
- Persistence + validation checklist
------------------------------------------`
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="rb-proof">
      <h2>Proof — Project 3</h2>

      <section className="proof-section">
        <h3>Step Completion Overview</h3>
        <ul className="step-status-list">
          {STEPS.map((id, i) => (
            <li key={id} className={artifacts[id] ? 'done' : 'pending'}>
              Step {i + 1}: {id.replace('-', ' ')} — {artifacts[id] ? '✓' : '—'}
            </li>
          ))}
        </ul>
      </section>

      <section className="proof-section">
        <h3>Checklist (10 tests)</h3>
        <ul className="checklist">
          {CHECKLIST_ITEMS.map((label, i) => (
            <li key={i}>
              <label>
                <input
                  type="checkbox"
                  checked={!!checklist[`check_${i}`]}
                  onChange={(e) => toggleChecklist(`check_${i}`, e.target.checked)}
                />
                {label}
              </label>
            </li>
          ))}
        </ul>
      </section>

      <section className="proof-section">
        <h3>Artifact Collection</h3>
        <div className="proof-inputs">
          <label>
            Lovable Project Link
            <input
              type="url"
              value={submission.lovable}
              onChange={(e) => saveSubmission('lovable', e.target.value)}
              placeholder="https://..."
              className={!hasLovable && submission.lovable ? 'invalid' : ''}
            />
          </label>
          <label>
            GitHub Repository Link
            <input
              type="url"
              value={submission.github}
              onChange={(e) => saveSubmission('github', e.target.value)}
              placeholder="https://github.com/..."
              className={!hasGithub && submission.github ? 'invalid' : ''}
            />
          </label>
          <label>
            Deployed URL
            <input
              type="url"
              value={submission.deploy}
              onChange={(e) => saveSubmission('deploy', e.target.value)}
              placeholder="https://..."
              className={!hasDeploy && submission.deploy ? 'invalid' : ''}
            />
          </label>
        </div>
      </section>

      <section className="proof-section">
        <button type="button" className="btn-copy-final" onClick={copyFinalSubmission}>
          Copy Final Submission
        </button>
      </section>

      {canShip && (
        <div className="shipped-message">
          Project 3 Shipped Successfully.
        </div>
      )}
    </div>
  )
}
