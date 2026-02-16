import { Link } from 'react-router-dom'
import ResumeLayout from './ResumeLayout'
import './HomePage.css'

export default function HomePage() {
  return (
    <ResumeLayout>
      <div className="home-page">
        <h1 className="home-headline">Build a Resume That Gets Read.</h1>
        <p className="home-sub">Create an ATS-friendly resume with live preview and scoring.</p>
        <Link to="/builder" className="home-cta">Start Building</Link>
      </div>
    </ResumeLayout>
  )
}
