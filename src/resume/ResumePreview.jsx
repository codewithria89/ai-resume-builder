import './ResumePreview.css'

export default function ResumePreview({ data, template = 'classic', accentColor = 'hsl(168, 60%, 40%)' }) {
  const p = data?.personal || {}
  const skills = data?.skills || {}
  const allSkills = [
    ...(skills.technical || []),
    ...(skills.soft || []),
    ...(skills.tools || [])
  ]

  const sidebarContent = (
    <>
      <div className="contact-block">
        {p.email && <div>{p.email}</div>}
        {p.phone && <div>{p.phone}</div>}
        {p.location && <div>{p.location}</div>}
      </div>
      {allSkills.length > 0 && (
        <section>
          <h2>Skills</h2>
          <div className="skill-badges">
            {allSkills.map((s, i) => (
              <span key={i} className="badge">{s}</span>
            ))}
          </div>
        </section>
      )}
    </>
  )

  const mainContent = (
    <>
        {data?.summary && (
          <section>
            <h2>Summary</h2>
            <p>{data.summary}</p>
          </section>
        )}

        {(data?.education || []).length > 0 && (
          <section>
            <h2>Education</h2>
            {(data.education || []).map((e, i) => (
              <div key={i} className="entry">
                <strong>{e.degree}</strong> — {e.school} {e.year && `(${e.year})`}
              </div>
            ))}
          </section>
        )}

        {(data?.experience || []).length > 0 && (
          <section>
            <h2>Experience</h2>
            {(data.experience || []).map((ex, i) => (
              <div key={i} className="entry">
                <strong>{ex.role}</strong> — {ex.company} {ex.dates && `(${ex.dates})`}
                {ex.bullets?.length > 0 && (
                  <ul>
                    {ex.bullets.map((b, j) => <li key={j}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {(data?.projects || []).length > 0 && (
          <section>
            <h2>Projects</h2>
            {(data.projects || []).map((proj, i) => (
              <div key={i} className="project-card">
                <strong>{proj.title}</strong>
                {proj.description && <p className="proj-desc">{proj.description}</p>}
                {Array.isArray(proj.techStack) && proj.techStack.length > 0 && (
                  <div className="tech-pills">
                    {proj.techStack.map((t, j) => <span key={j} className="tech-pill">{t}</span>)}
                  </div>
                )}
                {(proj.liveUrl || proj.githubUrl) && (
                  <div className="proj-links">
                    {proj.liveUrl && <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer">Live</a>}
                    {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer">GitHub</a>}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {(data?.links?.github || data?.links?.linkedin) && (
          <section>
            <h2>Links</h2>
            <div className="links">
              {data.links.github && <a href={data.links.github} target="_blank" rel="noopener noreferrer">GitHub</a>}
              {data.links.linkedin && <a href={data.links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
            </div>
          </section>
        )}
    </>
  )

  if (template === 'modern') {
    return (
      <div className={`resume-preview resume-preview--modern`} style={{ '--accent': accentColor }}>
        <div className="preview-inner">
          <header className="preview-header">
            <h1>{p.name || 'Your Name'}</h1>
            <div className="contact">
              {p.email && <span>{p.email}</span>}
              {p.phone && <span>{p.phone}</span>}
              {p.location && <span>{p.location}</span>}
            </div>
          </header>
          <aside className="sidebar-modern">{sidebarContent}</aside>
          <div className="main-modern">{mainContent}</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`resume-preview resume-preview--${template}`} style={{ '--accent': accentColor }}>
      <div className="preview-inner">
        <header className="preview-header">
          <h1>{p.name || 'Your Name'}</h1>
          <div className="contact">
            {p.email && <span>{p.email}</span>}
            {p.phone && <span>{p.phone}</span>}
            {p.location && <span>{p.location}</span>}
          </div>
        </header>
        {mainContent}
        {allSkills.length > 0 && (
          <section>
            <h2>Skills</h2>
            <div className="skill-badges">
              {allSkills.map((s, i) => (
                <span key={i} className="badge">{s}</span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
