import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { BuildTrackProvider } from './BuildTrackContext'
import BuildPanel from './BuildPanel'
import './KodNestLayout.css'

const STORAGE_KEY = 'rb_step_artifacts'
const CHECKLIST_KEY = 'rb_checklist_tests'

export function getStepArtifacts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

export function setStepArtifact(stepId, artifact) {
  const current = getStepArtifacts()
  const next = { ...current, [stepId]: artifact }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

export function getChecklistTests() {
  try {
    return JSON.parse(localStorage.getItem(CHECKLIST_KEY) || '{}')
  } catch {
    return {}
  }
}

export function setChecklistTest(id, passed) {
  const current = getChecklistTests()
  const next = { ...current, [id]: passed }
  localStorage.setItem(CHECKLIST_KEY, JSON.stringify(next))
}

const STEPS = [
  '01-problem', '02-market', '03-architecture', '04-hld',
  '05-lld', '06-build', '07-test', '08-ship'
]

function getStatus() {
  const artifacts = getStepArtifacts()
  const checklist = getChecklistTests()
  const finalSub = JSON.parse(localStorage.getItem('rb_final_submission') || '{}')
  const allStepsDone = STEPS.every(s => !!artifacts[s])
  const checklistCount = Object.values(checklist).filter(Boolean).length
  const allLinks = !!(finalSub.lovable && finalSub.github && finalSub.deploy)

  if (allStepsDone && checklistCount >= 10 && allLinks) return 'Shipped'
  return 'In Progress'
}

export default function KodNestLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const path = location.pathname
  const isProof = path === '/rb/proof'
  const stepMatch = path.match(/\/rb\/(\d\d-[a-z]+)/)
  const stepNum = stepMatch ? STEPS.indexOf(stepMatch[1]) + 1 : 0
  const status = getStatus()

  return (
    <div className="kodnest-layout">
      {/* Top Bar */}
      <header className="kodnest-topbar">
        <div className="topbar-left" onClick={() => navigate('/')}>AI Resume Builder</div>
        <div className="topbar-center">
          {isProof ? 'Project 3 — Proof' : `Project 3 — Step ${stepNum} of 8`}
        </div>
        <div className={`topbar-status topbar-status--${status === 'Shipped' ? 'shipped' : 'progress'}`}>
          {status}
        </div>
      </header>

      {/* Context Header */}
      <div className="kodnest-context">
        <span>AI Resume Builder — Build Track</span>
      </div>

      {/* Main + Panel */}
      <div className="kodnest-body">
        {stepMatch ? (
          <BuildTrackProvider stepId={stepMatch[1]} stepNum={stepNum}>
            <main className="kodnest-workspace">
              <Outlet />
            </main>
            <aside className="kodnest-panel">
              <BuildPanel />
            </aside>
          </BuildTrackProvider>
        ) : (
          <main className="kodnest-workspace kodnest-workspace--full">
            <Outlet />
          </main>
        )}
      </div>

      {/* Proof Footer */}
      <footer className="kodnest-footer">
        <button type="button" className="footer-link" onClick={() => navigate('/rb/proof')}>
          Proof
        </button>
      </footer>
    </div>
  )
}
