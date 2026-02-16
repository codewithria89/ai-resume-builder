import { Routes, Route, Navigate } from 'react-router-dom'
import KodNestLayout from './kodnest/KodNestLayout'
import RBStep from './kodnest/RBStep'
import RBProof from './kodnest/RBProof'
import HomePage from './resume/HomePage'
import BuilderPage from './resume/BuilderPage'
import PreviewPage from './resume/PreviewPage'
import ResumeProofPage from './resume/ProofPage'

const RB_STEPS = [
  { id: '01-problem', label: 'Problem', path: '/rb/01-problem' },
  { id: '02-market', label: 'Market', path: '/rb/02-market' },
  { id: '03-architecture', label: 'Architecture', path: '/rb/03-architecture' },
  { id: '04-hld', label: 'HLD', path: '/rb/04-hld' },
  { id: '05-lld', label: 'LLD', path: '/rb/05-lld' },
  { id: '06-build', label: 'Build', path: '/rb/06-build' },
  { id: '07-test', label: 'Test', path: '/rb/07-test' },
  { id: '08-ship', label: 'Ship', path: '/rb/08-ship' },
]

function App() {
  return (
    <Routes>
      {/* KodNest Build Track - Project 3 */}
      <Route path="/rb" element={<KodNestLayout />}>
        <Route index element={<Navigate to="/rb/01-problem" replace />} />
        {RB_STEPS.map((step, i) => (
          <Route
            key={step.id}
            path={step.id}
            element={
              <RBStep
                stepNum={i + 1}
                stepId={step.id}
                stepLabel={step.label}
                totalSteps={8}
                nextPath={i < 7 ? RB_STEPS[i + 1].path : null}
              />
            }
          />
        ))}
        <Route path="proof" element={<RBProof steps={RB_STEPS} />} />
      </Route>

      {/* AI Resume Builder App */}
      <Route path="/" element={<HomePage />} />
      <Route path="/builder" element={<BuilderPage />} />
      <Route path="/preview" element={<PreviewPage />} />
      <Route path="/proof" element={<ResumeProofPage />} />
    </Routes>
  )
}

export default App
