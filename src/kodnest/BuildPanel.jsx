import { useBuildTrack } from './BuildTrackContext'
import './BuildPanel.css'

const LOVABLE_URL = 'https://lovable.app'

export default function BuildPanel() {
  const ctx = useBuildTrack()
  if (!ctx) return null

  const { stepId, stepNum, content, copyText, setCopyText, buildStatus, setBuildStatus, loadForLovable } = ctx

  const handleCopy = () => {
    navigator.clipboard.writeText(copyText)
  }

  return (
    <div className="build-panel">
      <h3 className="panel-title">Build Panel</h3>
      <label className="panel-label">Copy This Into Lovable</label>
      <textarea
        className="panel-textarea"
        value={copyText}
        onChange={(e) => setCopyText(e.target.value)}
        placeholder={content.prompt}
        rows={8}
      />
      <div className="panel-actions">
        <button type="button" className="btn-copy" onClick={handleCopy}>
          Copy
        </button>
        <button type="button" className="btn-load" onClick={loadForLovable}>
          Copy This Into Lovable
        </button>
        <a
          href={LOVABLE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-lovable"
        >
          Build in Lovable
        </a>
      </div>
      <div className="panel-status">
        <span className="status-label">Status:</span>
        <button
          type="button"
          className={`status-btn ${buildStatus === 'worked' ? 'active' : ''}`}
          onClick={() => setBuildStatus('worked')}
        >
          It Worked
        </button>
        <button
          type="button"
          className={`status-btn ${buildStatus === 'error' ? 'active' : ''}`}
          onClick={() => setBuildStatus('error')}
        >
          Error
        </button>
        <button
          type="button"
          className="status-btn"
          onClick={() => {}}
        >
          Add Screenshot
        </button>
      </div>
    </div>
  )
}
