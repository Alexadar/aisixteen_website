import React from 'react'
import { SITE, FILTERS, appStoreUrl, deviceLabel, appFolder, platformsOf, faqsOf } from './theme.js'

const asset = (p) => `/${p}`

/* ---------------- icons ---------------- */
const ShieldIcon = ({ size = 34, stroke = '#55d3ff', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)
const CheckIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)
const AppleIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
    <path d="M16.365 1.43c0 1.14-.42 2.2-1.12 2.98-.85.94-2.24 1.66-3.4 1.57-.13-1.1.44-2.28 1.1-3.02.75-.85 2.06-1.5 3.42-1.53zM20.44 17.1c-.55 1.27-.82 1.84-1.53 2.97-.99 1.57-2.38 3.53-4.1 3.54-1.53.02-1.92-1-4-1-2.07 0-2.5.98-4.03 1.02-1.72.03-3.03-1.7-4.02-3.27-2.77-4.4-3.06-9.55-1.35-12.3 1.21-1.94 3.13-3.08 4.93-3.08 1.84 0 2.99 1.01 4.5 1.01 1.47 0 2.36-1.01 4.5-1.01 1.6 0 3.3.87 4.5 2.38-3.96 2.17-3.31 7.82.6 9.62z" />
  </svg>
)
const CheckCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)

/* ---------------- shared chrome ---------------- */
export const Header = () => (
  <header className="site-header">
    <div className="site-header__inner">
      <a className="brand" href="/">
        <img src={asset('logo.png')} alt="AISixteen" width="34" height="38" />
        <span className="brand__name">AISixteen</span>
      </a>
      <nav className="nav">
        <a className="nav__link nav__text" href="/#apps">Apps</a>
        <a className="nav__link nav__text" href="/#privacy">Privacy</a>
        <a className="btn btn--primary btn--sm" href={`mailto:${SITE.email}`}>Get in touch</a>
      </nav>
    </div>
  </header>
)

export const Footer = ({ year }) => (
  <footer className="site-footer">
    <div className="footer">
      <div>
        <div className="footer__brand-row">
          <img src={asset('logo.png')} alt="AISixteen" width="30" height="34" />
          <span>AISixteen</span>
        </div>
        <p>Small, fast, private apps for iPhone, iPad &amp; Mac. Available for collaborations, pilots, and custom tooling.</p>
        <a className="btn btn--primary" href={`mailto:${SITE.email}`}>Email {SITE.email}</a>
      </div>
      <div className="footer__links">
        <b>Links</b>
        <a className="nav__link" href="/#apps">All apps</a>
        <a className="nav__link" href="/#privacy">Privacy</a>
        <a className="nav__link" href={`mailto:${SITE.email}`}>Contact</a>
      </div>
    </div>
    <div className="footer__bottom">© {year} AISixteen</div>
  </footer>
)

const AppStoreButton = ({ app }) => (
  <a className="btn btn--appstore" href={appStoreUrl(app)} target="_blank" rel="noreferrer">
    <AppleIcon />
    <span className="as-lines">
      <span className="as-top">Download on the</span>
      <span className="as-big">App Store</span>
    </span>
  </a>
)

/* ---------------- home ---------------- */
const AppCard = ({ app }) => (
  <a className="card" href={`/${app.slug}/`} data-group={app.group} style={{ '--accent': app.accent }} aria-label={`Open ${app.name}`}>
    <div className="card__shotwrap">
      <img className="card__shot" src={asset(app.screenshot)} alt="" loading="lazy" decoding="async" />
      <div className="card__shotfade" />
      <div className="card__bar" />
    </div>
    <div className="card__body">
      <div className="card__head">
        <img className="card__icon" src={asset(app.icon)} alt={`${app.name} icon`} width="56" height="56" loading="lazy" decoding="async" />
        <div style={{ minWidth: 0 }}>
          <div className="card__name">{app.name}</div>
          <span className="badge">{app.category}</span>
        </div>
      </div>
      <p className="card__desc">{app.tagline}</p>
      <span className="card__more">Learn more <span className="card__arrow">&rarr;</span></span>
    </div>
  </a>
)

const Featured = ({ app }) => (
  <section className="section">
    <a className="featured" href={`/${app.slug}/`} style={{ '--accent': app.accent }} aria-label={`Open ${app.name}`}>
      <div className="featured__body">
        <span className="eyebrow">Featured</span>
        <div className="featured__head">
          <img className="featured__icon" src={asset(app.icon)} alt={`${app.name} icon`} width="60" height="60" />
          <div>
            <div className="featured__name">{app.name}</div>
            <div className="featured__cat">{app.category}</div>
          </div>
        </div>
        <p className="featured__desc">{app.tagline} {app.short}</p>
        <span className="btn btn--primary">View app <span style={{ fontSize: 17 }}>&rarr;</span></span>
      </div>
      <div className="featured__media">
        <img src={asset(app.screenshot)} alt={`${app.name} screenshot`} />
      </div>
    </a>
  </section>
)

const PrivacyBlock = () => (
  <section className="privacy" id="privacy">
    <div className="privacy__box">
      <div className="privacy__icon"><ShieldIcon /></div>
      <div>
        <h2>Privacy by default</h2>
        <p>Our apps do not collect, store, or transmit any personal data — no identifiers, no usage analytics, no device information. Everything happens on your device. There's no account to create and nothing to opt out of, because there was never anything to collect.</p>
      </div>
    </div>
  </section>
)

export const Home = ({ apps, featured, year }) => (
  <div className="page">
    <Header />
    <main>
      <section className="hero rise">
        <div className="hero__badge"><span className="dot-live" /> Independent apps for iPhone, iPad &amp; Mac</div>
        <h1 className="hero__title">Apps that keep<br /><span className="grad">to themselves.</span></h1>
        <p className="hero__sub">AISixteen builds small, fast, thoughtfully crafted apps that run entirely on your device — no accounts, no tracking, nothing sent to a server.</p>
        <div className="hero__cta">
          <a className="btn btn--primary" href="#apps">Explore the apps</a>
          <a className="btn btn--ghost" href="#privacy">Our privacy stance</a>
        </div>
        <div className="hero__stats">
          <div className="stat"><b>{apps.length}</b>apps shipped</div>
          <div className="stat"><b>0</b>data collected</div>
          <div className="stat"><b>100%</b>on-device</div>
        </div>
      </section>

      <Featured app={featured} />

      <section className="apps" id="apps">
        <div className="apps__head">
          <div>
            <div className="apps__eyebrow">Catalog</div>
            <h2>All apps</h2>
            <p>Every one runs offline and collects nothing.</p>
          </div>
          <div className="filters">
            {FILTERS.map((f) => (
              <span key={f.key} className={`chip${f.key === 'all' ? ' is-active' : ''}`} data-filter={f.key}>{f.label}</span>
            ))}
          </div>
        </div>
        <div className="grid">
          {apps.map((app) => <AppCard key={app.slug} app={app} />)}
        </div>
      </section>

      <PrivacyBlock />
    </main>
    <Footer year={year} />
  </div>
)

/* ---------------- landing preview (multi-device carousel) ---------------- */
const FrameMac = ({ app, children }) => (
  <div className="frame-mac">
    <div className="frame-mac__bar">
      <span className="tl tl--r" /><span className="tl tl--y" /><span className="tl tl--g" />
      <span className="frame-mac__title">{app.name}</span>
    </div>
    <div className="frame-mac__screen"><div className="frame__glow" />{children}</div>
  </div>
)
const FrameIpad = ({ children }) => (
  <div className="frame-ipad">
    <div className="frame-ipad__screen"><div className="frame__glow" />{children}</div>
  </div>
)
const FrameIphone = ({ children }) => (
  <div className="frame-iphone">
    <div className="frame-iphone__screen">
      <div className="frame-iphone__island" />
      <div className="frame__glow" />{children}
    </div>
  </div>
)
const FRAME = { mac: FrameMac, ipad: FrameIpad, iphone: FrameIphone }
const FRAME_LABEL = { mac: 'Mac', ipad: 'iPad', iphone: 'iPhone' }

// Rotates through every platform's screenshots, each in its own device frame.
// site.js crossfades the .cslide items (5s hold, 0.5s fade).
const Carousel = ({ app }) => {
  const fallbackFrame = app.device === 'ipad' ? 'ipad' : app.device === 'ios' ? 'iphone' : 'mac'
  const slides = app.slides && app.slides.length ? app.slides : [{ frame: fallbackFrame, src: app.screenshot }]
  return (
    <div className={`carousel carousel--${app.carouselSize || 'mac'}`}>
      {slides.map((s, i) => {
        const Frame = FRAME[s.frame] || FrameMac
        return (
          <div className={`cslide${i === 0 ? ' is-active' : ''}`} key={i}>
            <div className="device">
              <div className="device__label"><span>&#9658;</span> {FRAME_LABEL[s.frame]} preview</div>
              <Frame app={app}>
                <img
                  className="media"
                  src={asset(s.src)}
                  alt={i === 0 ? `${app.name} preview` : ''}
                  loading={i === 0 ? undefined : 'lazy'}
                  decoding="async"
                />
              </Frame>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export const Landing = ({ app, more, year }) => (
  <div className="page" style={{ '--accent': app.accent }}>
    <Header />
    <main>
      <section className="landing-hero" style={{ paddingTop: 34, paddingBottom: 0 }}>
        <a className="back" href="/"><span>&larr;</span> All apps</a>
      </section>

      <section className="landing-hero rise">
        <div className="split">
          <div>
            <span className="landing__cat">{app.category}</span>
            <div className="landing__head">
              <img className="landing__icon" src={asset(app.icon)} alt={`${app.name} icon`} width="78" height="78" />
              <h1 className="landing__title">{app.name}</h1>
            </div>
            <p className="landing__tagline">{app.tagline}</p>
            <p className="landing__blurb">{app.blurb}</p>
            <div className="landing__actions">
              <AppStoreButton app={app} />
              <span className="meta-note">On the App Store · {platformsOf(app)}</span>
            </div>
            <div className="trust-row">
              <span className="trust"><CheckCircleIcon /> Runs 100% on-device</span>
              <span className="trust"><CheckCircleIcon /> No tracking, ever</span>
              <span className="trust"><CheckCircleIcon /> No account or subscription</span>
            </div>
          </div>
          <Carousel app={app} />
        </div>
      </section>

      <section className="inside">
        <h2>What's inside</h2>
        <div className="features">
          {app.features.map((feat, i) => (
            <div className="feature" key={i}>
              <div className="feature__icon"><CheckIcon /></div>
              <p>{feat}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="privacy-strip">
        <div className="privacy-strip__box">
          <ShieldIcon size={26} />
          <p>No account, no tracking, no data collection. {app.name} works fully offline.</p>
        </div>
      </section>

      <section className="faq">
        <h2>Questions</h2>
        <div className="faq__list">
          {faqsOf(app).map((f, i) => (
            <details className="faq__item" key={i}>
              <summary>{f.q}<span className="faq__plus">+</span></summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="more">
        <h2>More from AISixteen</h2>
        <div className="more-grid">
          {more.map((m) => (
            <a className="mini-card" href={`/${m.slug}/`} key={m.slug} style={{ '--accent': m.accent }} aria-label={`Open ${m.name}`}>
              <img className="mini-card__icon" src={asset(m.icon)} alt={`${m.name} icon`} width="46" height="46" loading="lazy" decoding="async" />
              <div style={{ minWidth: 0 }}>
                <div className="mini-card__name">{m.name}</div>
                <div className="mini-card__cat">{m.category}</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="final-cta-wrap">
        <div className="final-cta">
          <h2>Get {app.name}</h2>
          <p>{app.tagline} On-device, no account, no tracking.</p>
          <AppStoreButton app={app} />
        </div>
      </section>

      <div className="stickpad" />
    </main>

    <div className="sticky-cta">
      <div className="sticky-cta__app">
        <img src={asset(app.icon)} alt="" width="38" height="38" loading="lazy" decoding="async" />
        <span className="sticky-cta__name">{app.name}</span>
      </div>
      <a className="sticky-cta__btn" href={appStoreUrl(app)} target="_blank" rel="noreferrer">
        <AppleIcon size={16} /> App Store
      </a>
    </div>

    <Footer year={year} />
  </div>
)

/* ---------------- 404 ---------------- */
export const NotFound = ({ year }) => (
  <div className="page">
    <Header />
    <main>
      <section className="notfound">
        <h1 className="grad">404</h1>
        <p>That page drifted off into space. Let's get you back.</p>
        <a className="btn btn--primary" href="/">Back to all apps</a>
      </section>
    </main>
    <Footer year={year} />
  </div>
)
