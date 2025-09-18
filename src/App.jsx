import React from 'react'
import { apps } from './data/apps'

// One-column, 5-section layout:
// 1) Header section
// 2-4) App sections
// 5) Footer
export default function App() {
  return (
    <div className="page">
      <HeaderSection />
      <main>
        <AppsSections />
      </main>
      <Footer />
    </div>
  )
}

function HeaderSection() {
  return (
    <section id="top" className="section header-section">
      <div className="container">
        <div className="brand-row">
          <div className="brand">
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="AISixteen logo" width="40" height="40" />
            <span className="brand-name">AISixteen</span>
          </div>
        </div>
        <h1>Apps of the future</h1>
      </div>
    </section>
  )
}

function AppsSections() {
  return (
    <div id="apps">
      {apps.map((app) => (
        <section id={app.slug} key={app.slug} className="section app-section">
          <div className="container">
            <article className="app-card">
              <div className="app-header">
                {app.icon && (
                  <div className="app-icon">
                    <img src={`${import.meta.env.BASE_URL}${app.icon}`} alt={`${app.name} icon`} />
                  </div>
                )}
                <div className="app-info">
                  <h2 className="app-title">{app.name}</h2>
                  <p className="app-desc">{app.description}</p>
                  <div className="app-actions">
                    <a 
                      className="btn primary" 
                      href={`https://apps.apple.com/app/id${app.appStoreId}`} 
                      target="_blank" 
                      rel="noreferrer"
                    >
                      App Store
                    </a>
                  </div>
                </div>
              </div>
              {app.video && (
                <div className="app-video">
                  <video 
                    autoPlay 
                    muted 
                    loop 
                    playsInline
                    poster={app.icon ? `${import.meta.env.BASE_URL}${app.icon}` : undefined}
                  >
                    <source src={`${import.meta.env.BASE_URL}${app.video}`} type="video/mp4" />
                    <source src={`${import.meta.env.BASE_URL}${app.video}`} type="video/quicktime" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </article>
          </div>
        </section>
      ))}
    </div>
  )
}

function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer id="footer" className="footer">
      <div className="container footer-inner">
        <div>
          <strong>Contact</strong>
          <div className="footer-desc">We're available for collaborations, pilots, and custom tooling.</div>
          <div className="footer-actions">
            <a className="btn primary" href="mailto:info@aisixteen.com">Email info@aisixteen.com</a>
          </div>
        </div>
        <div className="footer-meta">
          <span>© {year} AISixteen</span>
        </div>
      </div>
    </footer>
  )
}
