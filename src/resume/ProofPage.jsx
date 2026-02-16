import { useState, useEffect } from 'react'
import ResumeLayout from './ResumeLayout'
import './ProofPage.css'

const SUBMISSION_KEY = 'resume_proof_submission'

function isValidUrl(s) {
  if (!s || typeof s !== 'string') return false
  try {
    new URL(s.trim())
    return true
  } catch {
    return false
  }
}

export default function ProofPage() {
  const [submission, setSubmission] = useState({
    lovable: '',
    github: '',
    deploy: ''
  })

  useEffect(() => {
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

  const save = (field, value) => {
    const next = { ...submission, [field]: value }
    setSubmission(next)
    localStorage.setItem(SUBMISSION_KEY, JSON.stringify(next))
  }

  const copyFinal = () => {
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
    <ResumeLayout>
      <div className="proof-page">
        <h2>Proof</h2>
        <p className="proof-desc">Placeholder for artifacts and final submission.</p>

        <section className="proof-inputs">
          <label>
            Lovable Project Link
            <input
              type="url"
              value={submission.lovable}
              onChange={(e) => save('lovable', e.target.value)}
              placeholder="https://..."
            />
          </label>
          <label>
            GitHub Repository Link
            <input
              type="url"
              value={submission.github}
              onChange={(e) => save('github', e.target.value)}
              placeholder="https://github.com/..."
            />
          </label>
          <label>
            Deployed URL
            <input
              type="url"
              value={submission.deploy}
              onChange={(e) => save('deploy', e.target.value)}
              placeholder="https://..."
            />
          </label>
        </section>

        <button type="button" className="btn-copy-final" onClick={copyFinal}>
          Copy Final Submission
        </button>
      </div>
    </ResumeLayout>
  )
}
