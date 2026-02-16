import { createContext, useContext, useState } from 'react'
import { getStepArtifacts, setStepArtifact } from './KodNestLayout'

const STEP_CONTENT = {
  '01-problem': { title: 'Problem', prompt: 'Define the core problem.' },
  '02-market': { title: 'Market', prompt: 'Research target users and competitors.' },
  '03-architecture': { title: 'Architecture', prompt: 'Outline system architecture.' },
  '04-hld': { title: 'HLD', prompt: 'High-level design.' },
  '05-lld': { title: 'LLD', prompt: 'Low-level design.' },
  '06-build': { title: 'Build', prompt: 'Implement the solution.' },
  '07-test': { title: 'Test', prompt: 'Testing approach and results.' },
  '08-ship': { title: 'Ship', prompt: 'Deployment and release.' },
}

const Ctx = createContext(null)

export function BuildTrackProvider({ children, stepId, stepNum }) {
  const content = STEP_CONTENT[stepId] || {}
  const [copyText, setCopyText] = useState(content.prompt || '')
  const [buildStatus, setBuildStatus] = useState(null)

  const loadForLovable = () => {
    setCopyText(content.prompt + '\n\n---\nAdd your artifact description or paste code here.')
  }

  return (
    <Ctx.Provider
      value={{
        stepId,
        stepNum,
        content,
        copyText,
        setCopyText,
        buildStatus,
        setBuildStatus,
        loadForLovable,
        getStepArtifacts,
        setStepArtifact,
      }}
    >
      {children}
    </Ctx.Provider>
  )
}

export function useBuildTrack() {
  const c = useContext(Ctx)
  if (!c) return null
  return c
}
