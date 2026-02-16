import { Link, useLocation } from 'react-router-dom'
import './ResumeLayout.css'

export default function ResumeLayout({ children }) {
  const path = useLocation().pathname

  return (
    <div className="resume-layout">
      <nav className="resume-nav">
        <Link to="/" className="nav-brand">AI Resume Builder</Link>
        <div className="nav-links">
          <Link to="/builder" className={path === '/builder' ? 'active' : ''}>Builder</Link>
          <Link to="/preview" className={path === '/preview' ? 'active' : ''}>Preview</Link>
          <Link to="/proof" className={path === '/proof' ? 'active' : ''}>Proof</Link>
          <Link to="/rb" className="nav-build">Build Track</Link>
        </div>
      </nav>
      <main className="resume-main">
        {children}
      </main>
    </div>
  )
}
