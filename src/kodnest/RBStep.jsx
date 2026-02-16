import { useState, useLayoutEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { getStepArtifacts, setStepArtifact } from './KodNestLayout'
import './RBStep.css'

const STEP_CONTENT = {
  '01-problem': {
    title: 'Problem Definition',
    prompt: 'Define the core problem: Job seekers struggle with resume formatting and ATS compatibility. Describe the problem clearly.'
  },
  '02-market': {
    title: 'Market Research',
    prompt: 'Research target users and competitors. Document findings.'
  },
  '03-architecture': {
    title: 'System Architecture',
    prompt: 'Outline high-level architecture. Components, data flow.'
  },
  '04-hld': {
    title: 'High-Level Design',
    prompt: 'HLD diagrams and component interactions.'
  },
  '05-lld': {
    title: 'Low-Level Design',
    prompt: 'Detailed design, APIs, data structures.'
  },
  '06-build': {
    title: 'Build',
    prompt: 'Implement the solution. Paste artifact or link.'
  },
  '07-test': {
    title: 'Test',
    prompt: 'Testing approach and results. Paste artifact.'
  },
  '08-ship': {
    title: 'Ship',
    prompt: 'Deployment and release. Paste artifact.'
  }
}

export default function RBStep({ stepNum, stepId, stepLabel, totalSteps, nextPath }) {
  const navigate = useNavigate()
  const context = useOutletContext() || {}
  const [artifacts, setArtifacts] = useState(getStepArtifacts)
  const [copyText, setCopyText] = useState('')
  const [buildStatus, setBuildStatus] = useState(null) // 'worked' | 'error' | null
  const [screenshot, setScreenshot] = useState(null)

  const content = STEP_CONTENT[stepId] || { title: stepLabel, prompt: '' }
  const hasArtifact = !!artifacts[stepId]
  const canProceed = hasArtifact

  useLayoutEffect(() => {
    setArtifacts(getStepArtifacts())
  }, [stepId])

  const handleArtifactUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setStepArtifact(stepId, { type: 'file', name: file.name, data: reader.result })
        setArtifacts(getStepArtifacts())
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLinkSubmit = (e) => {
    e.preventDefault()
    const link = e.target.link?.value?.trim()
    if (link) {
      setStepArtifact(stepId, { type: 'link', value: link })
      setArtifacts(getStepArtifacts())
      e.target.reset()
    }
  }

  const handleCopyToLovable = () => {
    setCopyText(content.prompt + '\n\n---\nPaste your artifact or link here.')
  }

  const handleCopyClick = () => {
    navigator.clipboard.writeText(copyText)
  }

  const handleNext = () => {
    if (canProceed && nextPath) navigate(nextPath)
    else if (canProceed && stepNum === 8) navigate('/rb/proof')
  }

  const steps = ['problem','market','architecture','hld','lld','build','test','ship']
  const prevStepId = stepNum > 1 ? `${String(stepNum - 1).padStart(2, '0')}-${steps[stepNum - 2]}` : null

  return (
    <div className="rb-step">
      <div className="rb-step-main">
        <h2>{content.title}</h2>
        <p className="rb-step-prompt">{content.prompt}</p>
        <div className="rb-step-actions">
          <input
            type="file"
            id="artifact-upload"
            accept="image/*,.pdf,.txt"
            onChange={handleArtifactUpload}
            className="visually-hidden"
          />
          <label htmlFor="artifact-upload" className="btn-upload">
            Upload Artifact
          </label>
          <form onSubmit={handleLinkSubmit} className="rb-link-form">
            <input type="text" name="link" placeholder="Or paste link" />
            <button type="submit">Add Link</button>
          </form>
          {hasArtifact && (
            <span className="artifact-badge">Artifact uploaded</span>
          )}
        </div>
        <div className="rb-step-nav">
          <button
            type="button"
            onClick={() => prevStepId && navigate(`/rb/${prevStepId}`)}
            disabled={!prevStepId}
          >
            Previous
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceed}
            className="btn-primary"
          >
            {stepNum === 8 ? 'Go to Proof' : 'Next'}
          </button>
        </div>
      </div>

      {/* Build panel is rendered via Outlet context - we need to render it in the parent */}
    </div>
  )
}
