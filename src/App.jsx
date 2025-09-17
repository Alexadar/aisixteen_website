import React from 'react'
import { apps } from './data/apps'

export default function App() {
  return (
    <div className="page">
      <Header />
      <main>
        <Hero />
        <AppsGrid />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}

function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <a className="brand" href="#" aria-label="AISixteen home">
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="AISixteen logo" width="36" height="36" />
          <span className="brand-name">AISixteen</span>
        </a>
        <nav className="nav">
          <a href="#apps">Apps</a>
          <a href="#contact">Contact</a>
          <a className="btn small" href="https://github.com/" target="_blank" rel="noreferrer">GitHub</a>
        </nav>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="section hero">
      <div className="container">
        <h1>AI apps that ship.</h1>
        <p className="lead">
          AISixteen builds focused, fast AI-powered tools. Explore a curated set of
          experiments and products below.
        </p>
        <div className="hero-actions">
          <a href="#apps" className="btn primary">Browse apps</a>
          <a href="#contact" className="btn">Get in touch</a>
        </div>
      </div>
    </section>
  )
}

function AppsGrid() {
  return (
    <section id="apps" className="section apps">
      <div className="container">
        <h2 className="section-title">Featured apps</h2>
        <div className="grid">
          {apps.map((app) => (
            <article key={app.slug} className="card">
              {app.badge && <span className={`badge ${app.badge.toLowerCase()}`}>{app.badge}</span>}
              <div className="card-body">
                <h3 className="card-title">{app.name}</h3>
                <p className="card-desc">{app.description}</p>
              </div>
              <div className="card-actions">
                {app.demo && (
                  <a className="btn primary" href={app.demo} target="_blank" rel="noreferrer">Live demo</a>
                )}
                {app.repo && (
                  <a className="btn" href={app.repo} target="_blank" rel="noreferrer">Source</a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section id="contact" className="section cta">
      <div className="container">
        <h2>Have an idea? Let's build it.</h2>
        <p>We're available for collaborations, pilots, and custom tooling.</p>
        <a className="btn primary" href="mailto:founders@aisixteen.com">Email founders@aisixteen.com</a>
      </div>
    </section>
  )
}

function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>© {year} AISixteen</span>
        <a href="https://github.com/" target="_blank" rel="noreferrer">GitHub</a>
      </div>
    </footer>
  )
}
