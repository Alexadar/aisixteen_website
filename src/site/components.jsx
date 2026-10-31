import React from 'react'
import { SITE, FILTERS, appStoreUrl, deviceLabel, appFolder, platformsOf, faqsOf, trustPointsOf, privacyLineOf, claimOf } from './theme.js'

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
        <a className="nav__link nav__text" href="/fantastic/">Fantastic</a>
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
        <a className="nav__link" href="/fantastic/">Fantastic</a>
        <a className="nav__link" href="/fantastic/foundations/">Foundations</a>
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
        <p>Our apps do not collect, store, or transmit any personal data — no identifiers, no usage analytics, no device information. Nothing about you leaves your device. There's no account to create and nothing to opt out of, because there was never anything to collect.</p>
      </div>
    </div>
  </section>
)

/* ---------------- fantastic ---------------- */
const GitHubIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.39-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z" />
  </svg>
)

const Terminal = ({ title, children }) => (
  <div className="frame-mac fx-term">
    <div className="frame-mac__bar">
      <span className="tl tl--r" /><span className="tl tl--y" /><span className="tl tl--g" />
      <span className="frame-mac__title">{title}</span>
    </div>
    <pre className="fx-code">{children}</pre>
  </div>
)

// Home: Fantastic is the headline product; the consumer apps follow as their own section.
const FantasticHero = ({ f }) => (
  <section className="hero fx-hero rise" style={{ '--accent': f.accent }}>
    <a className="hero__badge" href={`/${f.slug}/`}><span className="dot-live" /> {f.fullName} · {f.status}</a>
    <h1 className="hero__title fx-hero__title">Humans and AIs,<br /><span className="grad">one workspace.</span></h1>
    <p className="hero__sub">{f.homeSub}</p>
    <div className="hero__cta">
      <a className="btn btn--primary" href={`/${f.slug}/`}>Explore Fantastic</a>
      <a className="btn btn--ghost" href={f.repo} target="_blank" rel="noreferrer"><GitHubIcon /> Source on GitHub</a>
    </div>
    <div className="fx-hero__install">
      <span className="fx-hero__prompt">$</span><code>cargo install fantastic --locked</code>
    </div>
    <div className="fx-hero__duo">
      <StackStrip f={f} />
      <div className="fx-hero__visual">
        <img className="fx-hero__icon" src={asset(f.icon)} alt={`${f.name} icon`} width="96" height="96" />
        <Terminal title="the idea in one call">{f.oneCall}</Terminal>
      </div>
    </div>
  </section>
)

export const Home = ({ apps, featured, fantastic, year }) => {
  const liveApps = apps.filter((a) => a.live).map((a) => a.name)
  return (
  <div className="page">
    <Header />
    <main>
      {fantastic && <FantasticHero f={fantastic} />}

      <section className="hero apps-intro" id="apps-intro">
        <div className="hero__badge"><span className="dot-live" /> Independent apps for iPhone, iPad &amp; Mac</div>
        <h2 className="hero__title apps-intro__title">Apps that keep<br /><span className="grad">to themselves.</span></h2>
        <p className="hero__sub">AISixteen builds small, fast, thoughtfully crafted apps that run on your device — no accounts, no tracking, nothing about you sent to a server.</p>
        <div className="hero__cta">
          <a className="btn btn--primary" href="#apps">Explore the apps</a>
          <a className="btn btn--ghost" href="#privacy">Our privacy stance</a>
        </div>
        <div className="hero__stats">
          <div className="stat"><b>{apps.length}</b>apps shipped</div>
          <div className="stat"><b>0</b>data collected</div>
          <div className="stat"><b>0</b>accounts needed</div>
        </div>
      </section>

      <Featured app={featured} />

      <section className="apps" id="apps">
        <div className="apps__head">
          <div>
            <div className="apps__eyebrow">Catalog</div>
            <h2>All apps</h2>
            <p>Every one collects nothing{liveApps.length ? `, and all but ${liveApps.join(' and ')} run fully offline` : ' and runs offline'}.</p>
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
}

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
      <div className="frame__glow" />{children}
    </div>
  </div>
)
const FrameWatch = ({ children }) => (
  <div className="frame-watch">
    <div className="frame-watch__crown" />
    <div className="frame-watch__screen frame__screen"><div className="frame__glow" />{children}</div>
  </div>
)
const FRAME = { mac: FrameMac, ipad: FrameIpad, iphone: FrameIphone, watch: FrameWatch }
const FRAME_LABEL = { mac: 'Mac', ipad: 'iPad', iphone: 'iPhone', watch: 'Apple Watch' }

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

// Slim cross-promo bar on every app page. Border runs from the app's accent to Fantastic's.
const MadeInFantastic = ({ f }) => (
  <section className="mif-wrap">
    <a className="mif" href={`/${f.slug}/`} style={{ '--fx': f.accent }} aria-label={`Made in ${f.name} — learn about ${f.fullName}`}>
      <img className="mif__icon" src={asset(f.icon)} alt="" width="40" height="40" loading="lazy" decoding="async" />
      <span className="mif__text">
        <span className="mif__label">Made in <b>{f.name}</b></span>
        <span className="mif__sub">Built by humans and AIs in one workspace — our open-source kernel of agents.</span>
      </span>
      <span className="mif__cta">Explore <span className="card__arrow">&rarr;</span></span>
    </a>
  </section>
)

export const Landing = ({ app, more, fantastic, year }) => (
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
              <span className="meta-note">On the App Store{app.storeName ? ` as ${app.storeName}` : ''} · {platformsOf(app)}</span>
            </div>
            <div className="trust-row">
              {trustPointsOf(app).map((t, i) => (
                <span className="trust" key={i}><CheckCircleIcon /> {t}</span>
              ))}
            </div>
          </div>
          <Carousel app={app} />
        </div>
      </section>

      {fantastic && app.madeInFantastic !== false && <MadeInFantastic f={fantastic} />}

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
          <p>{privacyLineOf(app)}</p>
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
          <p>{app.tagline} {claimOf(app)}</p>
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

// `code` spans in README-sourced copy.
export const Md = ({ children }) => String(children).split('`').map((part, i) => (i % 2 ? <code key={i}>{part}</code> : part))

const fmtTime = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`

export const CopyLine = ({ code }) => (
  <div className="fx-install-line">
    <span className="fx-hero__prompt">$</span>
    <code>{code}</code>
    <button type="button" className="fx-copy" data-copy={code} aria-label={`Copy: ${code}`}>Copy</button>
  </div>
)

const HeroVideo = ({ v }) => (
  <figure className="fx-video">
    <div className="frame-mac fx-video__frame">
      <div className="frame-mac__bar">
        <span className="tl tl--r" /><span className="tl tl--y" /><span className="tl tl--g" />
        <span className="frame-mac__title">{v.title.toLowerCase()}</span>
      </div>
      <video className="fx-video__el" src={asset(v.src)} poster={asset(v.poster)} width={v.width} height={v.height}
        muted playsInline loop controls preload="none" data-autoplay="" aria-label={v.title} />
    </div>
    <figcaption className="fx-chapters" aria-label="Chapters">
      {v.chapters.map((c) => (
        <button type="button" className="fx-chapter" data-seek={c.t} key={c.t}>
          <span className="fx-chapter__t">{fmtTime(c.t)}</span>{c.label}
        </button>
      ))}
    </figcaption>
  </figure>
)


/* ---------------- fantastic: landing (/fantastic/) ---------------- */
// Status pill: colour AND glyph shape differ per status, so it never relies on colour alone.
const Chip = ({ f, s }) => <span className={`fx-chip fx-chip--${s}`}>{f.statuses[s].label}</span>

// Section header used across the landing: mono eyebrow, big title, optional lead.
export const Head = ({ eyebrow, title, lead, center = false, id }) => (
  <header className={`fl-head${center ? ' fl-head--center' : ''}`} data-reveal="">
    <p className="fl-eyebrow"><span className="fl-eyebrow__dot" />{eyebrow}</p>
    <h2 className="fl-title" id={id}>{title}</h2>
    {lead && <p className="fl-lead">{lead}</p>}
  </header>
)

const StarIcon = () => (
  <svg className="fl-star" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" />
  </svg>
)
export const GitHubCta = ({ f, label = 'Star on GitHub', primary = false }) => (
  <a className={`btn ${primary ? 'btn--primary' : 'btn--ghost'} fl-gh`} href={f.repo} target="_blank" rel="noreferrer">
    <GitHubIcon /> {label} {!primary && <StarIcon />}
  </a>
)

// Compact stack for the home hero: one row per layer, one glyph per status, links to the full stack.
const StackStrip = ({ f }) => (
  <a className="fx-strip" href={`/${f.slug}/#stack`}>
    <span className="fx-strip__title">The stack, built from scratch <span className="card__arrow">&rarr;</span></span>
    <span className="fx-strip__rows">
      {f.stackLayers.map((l) => (
        <span className="fx-strip__row" key={l.key}>
          <span className="fx-strip__name">{l.name}</span>
          <span className="fx-strip__dots" aria-hidden="true">
            {l.status.map((s) => <i className={`fx-dot fx-dot--${s}`} key={s} />)}
          </span>
          <span className="sr-only">: {l.status.map((s) => f.statuses[s].label).join(', ')}.</span>
        </span>
      ))}
    </span>
    <span className="fx-strip__key" aria-hidden="true">
      <span><i className="fx-dot fx-dot--available" /> Available</span>
      <span><i className="fx-dot fx-dot--soon" /> Coming soon</span>
    </span>
  </a>
)

/* ---- the reel: drawn, animated "ads" for each member of the family ---- */
// Drawings, not screenshots: the OS and desktop slides depict the plan and say "Concept".
// `fl-morph` marks each slide's main frame: between slides it morphs into the next one's.
const Cursor = () => (
  <svg width="20" height="24" viewBox="0 0 20 24" aria-hidden="true">
    <path d="M2 1.5v18.2l4.6-4.3 3 6.8 3.2-1.4-3-6.7 6.4-.3z" fill="#fff" stroke="#0b1020" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
)
const VisualOS = () => (
  <div className="fx-v fx-v--os" aria-hidden="true">
    <span className="fx-v__concept">Concept</span>
    <div className="fx-v-os__screen fl-morph">
      <div className="fx-v-os__boot">
        <span><b>[ ok ]</b> system image</span>
        <span><b>[ ok ]</b> kiosk compositor</span>
        <span><b>[ ok ]</b> fantastic, full-screen</span>
      </div>
      <div className="fx-v-os__home">
        <span className="fx-v-os__homebar">Home</span>
        <span className="fx-v-os__tiles">
          <i /><i /><i /><i /><i />
          <i className="fx-v-os__new"><b /><b /><b /></i>
        </span>
      </div>
      <span className="fx-v-os__ask">make me a mixer</span>
    </div>
    <div className="fx-v-os__stand" />
    <div className="fx-v-os__bus">
      {['network', 'audio', 'power', 'displays'].map((a) => <span className={`fx-v-os__agent fx-v-os__agent--${a}`} key={a}><code>{a}</code></span>)}
    </div>
  </div>
)
const VisualApp = () => (
  <div className="fx-v fx-v--app" aria-hidden="true">
    <span className="fx-v__concept">Concept</span>
    <div className="fx-v-app__win fl-morph">
      <div className="frame-mac__bar">
        <span className="tl tl--r" /><span className="tl tl--y" /><span className="tl tl--g" />
        <span className="frame-mac__title fx-v-app__title"><span className="fx-v-app__t1">Home</span><span className="fx-v-app__t2">dashboard · canvas</span></span>
      </div>
      <div className="fx-v-app__body">
        <div className="fx-v-app__list">
          {[['dashboard', 'on'], ['artwork', 'on'], ['chatbot', 'off'], ['notes', 'off']].map(([n, st], i) => (
            <div className="fx-v-app__row" key={n}>
              <i className={`fx-v-app__led fx-v-app__led--${st}`} />
              <span className="fx-v-app__name">{n}</span>
              <span className={`fx-v-app__btn${i === 0 ? ' fx-v-app__btn--target' : ''}`}>{st === 'on' ? 'Open' : 'Start'}</span>
            </div>
          ))}
        </div>
        <div className="fx-v-app__canvas">
          <span className="fx-v-app__cell fx-v-app__cell--chart"><small>chart_agent</small><span className="fx-v-app__bars"><i /><i /><i /><i /><i /><i /><i /></span></span>
          <span className="fx-v-app__cell fx-v-app__cell--term"><small>terminal</small><span className="fx-v-app__lines"><i /><i /><i /></span></span>
          <span className="fx-v-app__cell fx-v-app__cell--ai"><small>ai</small><span className="fx-v-app__chat"><i /><i /><i className="fx-v-app__typing"><b /><b /><b /></i></span></span>
        </div>
        <span className="fx-v-app__cursor"><Cursor /></span>
      </div>
    </div>
    <div className="fx-v-app__foot">
      <span className="fx-v-app__skins"><span className="fx-v-app__thumb" /><span>dark</span><span>glass</span></span>
      <span>macOS · Windows · Linux</span>
    </div>
  </div>
)
const VisualCLI = () => (
  <div className="fx-v fx-v--cli" aria-hidden="true">
    <div className="frame-mac fx-v-cli__term fl-morph">
      <div className="frame-mac__bar">
        <span className="tl tl--r" /><span className="tl tl--y" /><span className="tl tl--g" />
        <span className="frame-mac__title">~/project</span>
      </div>
      <div className="fx-v-cli__code">
        {['cargo install fantastic --locked', 'fantastic', 'fantastic canvas', 'fantastic mcp'].map((c, i) => (
          <span className="fx-v-cli__line" key={c} style={{ '--n': c.length + 2, '--d': `${0.35 + i * 0.75}s` }}><b>$ </b>{c}</span>
        ))}
      </div>
    </div>
    <div className="fx-v-cli__faces">
      <span className="fx-v-cli__face"><code>TUI</code>your terminal</span>
      <span className="fx-v-cli__face"><code>canvas</code>your browser</span>
      <span className="fx-v-cli__face"><code>mcp</code>your coding agent</span>
    </div>
  </div>
)
const VisualLib = ({ f }) => (
  <div className="fx-v fx-v--lib" aria-hidden="true">
    <div className="fx-v-lib__grid fl-morph">
      {f.runtimes.map((r) => (
        <span className={`fx-v-lib__rt fx-v-lib__rt--${r.name.toLowerCase()}`} key={r.name}>
          <b>{r.name}</b><small>{r.short}</small>
        </span>
      ))}
      <span className="fx-v-lib__ring" />
      <span className="fx-v-lib__core"><code>send</code><small>one protocol</small></span>
    </div>
    <div className="fx-v-lib__contract"><code>contract/</code> the same behaviour in every runtime</div>
  </div>
)
const VISUAL = { os: VisualOS, app: VisualApp, cli: VisualCLI, lib: VisualLib }

// Tabbed carousel (WAI pattern). site.js plays it: each tab's bar fills, and the bar's
// animationend advances the reel, so hover/offscreen/pause just pause the bar. Where the
// browser has View Transitions, the frame, headline and steps morph into the next slide's.
const Reel = ({ f }) => (
  <section className="fl-section fl-reel-wrap" id="family" aria-labelledby="family-title">
    <Head eyebrow="The family" id="family-title" center title={<>One protocol.<br /><span className="grad">Every layer.</span></>}
      lead="Four layers of one product, from the operating system down to the kernel. Here is what each one does." />
    <div className="fl-reel" data-reel="" aria-roledescription="carousel" aria-label="The Fantastic family">
      <div className="fl-reel__stage">
        {f.reel.map((r, i) => {
          const V = VISUAL[r.key]
          return (
            <div className={`fl-reel__slide fl-reel__slide--${r.key}${i === 0 ? ' is-active' : ''}`} key={r.key} id={`reel-${r.key}`}
              role="tabpanel" aria-labelledby={`reel-tab-${r.key}`} aria-roledescription="slide" style={{ '--tone': r.tone }}>
              <div className="fl-reel__copy">
                <p className="fl-reel__kicker"><span>{r.name}</span><Chip f={f} s={r.status} /></p>
                <h3 className="fl-reel__title">{r.title}</h3>
                <p className="fl-reel__text">{r.text}</p>
                <ol className="fl-reel__steps">
                  {r.steps.map(([s, t], k) => (
                    <li key={s} style={{ '--t': `${t}s` }}><span className="fl-reel__stepn">{k + 1}</span><span>{s}</span></li>
                  ))}
                </ol>
              </div>
              <div className="fl-reel__visual"><V f={f} /></div>
            </div>
          )
        })}
      </div>
      <div className="fl-reel__bar">
        <div className="fl-reel__tabs" role="tablist" aria-label="Choose a slide">
          {f.reel.map((r, i) => (
            <button type="button" role="tab" className={`fl-reel__tab${i === 0 ? ' is-active' : ''}`} id={`reel-tab-${r.key}`} key={r.key}
              aria-controls={`reel-${r.key}`} aria-selected={i === 0 ? 'true' : 'false'} tabIndex={i === 0 ? 0 : -1} data-slide={i} style={{ '--tone': r.tone }}>
              <span className="fl-reel__track"><span className="fl-reel__fill" /></span>
              <span className="fl-reel__tabname">{r.name}</span>
              <span className="fl-reel__tabstate">{f.statuses[r.status].label}</span>
            </button>
          ))}
        </div>
        <button type="button" className="fl-reel__pause" data-reel-pause="" aria-label="Pause the slideshow">
          <span className="fl-reel__pause-i" aria-hidden="true" />
        </button>
      </div>
      <noscript><style>{'.fl-reel__stage{display:flex;flex-direction:column;gap:16px}.fl-reel__slide{opacity:1;visibility:visible}.fl-reel__bar{display:none}'}</style></noscript>
    </div>
    <div className="fl-cta-row fl-cta-row--center" data-reveal="">
      <GitHubCta f={f} primary label="Follow Fantastic on GitHub" />
      <a className="btn btn--ghost" href={f.roadmap} target="_blank" rel="noreferrer">See the roadmap</a>
    </div>
  </section>
)

/* ---- the stack, as an isometric layer cake ---- */
const Stack = ({ f }) => (
  <section className="fl-section" id="stack" aria-labelledby="stack-title">
    <div className="fl-stack">
      <div className="fl-iso" data-reveal="" aria-hidden="true">
        {f.stackLayers.map((l, i) => (
          <div className={`fl-iso__plate fl-iso__plate--${l.key}${l.status.includes('available') ? '' : ' is-soon'}`} key={l.key} style={{ '--i': i, zIndex: 20 - i }}>
            <span className="fl-iso__label">{l.name}</span>
          </div>
        ))}
      </div>
      <div className="fl-stack__copy">
        <Head eyebrow="Built from scratch" id="stack-title" title={<>From the kernel up.<br /><span className="grad">Layer by layer.</span></>} lead={f.stackLead} />
        <ol className="fl-layers" data-reveal="">
          {f.stackLayers.map((l) => (
            <li className="fl-layer" data-layer={l.key} key={l.key}>
              <div className="fl-layer__top">
                <h3 className="fl-layer__name">{l.name}</h3>
                <span className="fl-layer__chips">{l.status.map((s) => <Chip f={f} s={s} key={s} />)}</span>
              </div>
              <p className="fl-layer__text">{l.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  </section>
)

/* ---- the kernel, as a bento ---- */
const Kernel = ({ f }) => {
  const [agents, send, reflect, gate, bridges, memory] = f.concepts
  const box = Object.fromEntries(f.inTheBox.map((b) => [b.title, b]))
  return (
    <section className="fl-section" id="kernel" aria-labelledby="kernel-title">
      <Head eyebrow="The kernel" id="kernel-title" title="The idea in one call" lead={f.blurb} />
      <div className="fl-bento">
        <article className="fl-tile fl-tile--call" data-reveal="">
          <Terminal title="one batch send">{f.oneCall}</Terminal>
          <div className="fl-agents" aria-hidden="true">
            <span className="fl-agents__root">kernel</span>
            <span className="fl-agents__row">
              {['a model', 'a program', 'files', 'a shell', 'the canvas', 'you'].map((n) => <span className="fl-agents__node" key={n}>{n}</span>)}
            </span>
          </div>
          <p className="fl-tile__text">{f.oneCallNote}</p>
        </article>
        {[agents, send].map((c) => (
          <article className="fl-tile fl-tile--sm" key={c.term} data-reveal="">
            <h3 className="fl-tile__term">{c.term}</h3>
            <p className="fl-tile__text">{c.text}</p>
          </article>
        ))}
        {[reflect, gate, bridges, memory].map((c) => (
          <article className="fl-tile fl-tile--q" key={c.term} data-reveal="">
            <h3 className="fl-tile__term">{c.term}</h3>
            <p className="fl-tile__text">{c.text}</p>
          </article>
        ))}
        <article className="fl-tile fl-tile--half fl-tile--glow" data-reveal="">
          <p className="fl-tile__kicker">{f.layers.engine.name}</p>
          <h3 className="fl-tile__title">{f.layers.engine.title}</h3>
          <p className="fl-tile__text">{f.layers.engine.text}</p>
        </article>
        <article className="fl-tile fl-tile--half" data-reveal="">
          <p className="fl-tile__kicker">{f.layers.product.name}</p>
          <h3 className="fl-tile__title">{f.layers.product.title}</h3>
          <p className="fl-tile__text">{f.layers.product.text}</p>
        </article>
        <article className="fl-tile fl-tile--half" data-reveal="">
          <h3 className="fl-tile__title">{box['AI agents'].title}</h3>
          <p className="fl-tile__text">{box['AI agents'].text}</p>
          <div className="fl-pills" aria-hidden="true">{['vLLM', 'Ollama', 'OpenAI Responses', 'Anthropic', 'Apple on-device'].map((m) => <span key={m}>{m}</span>)}</div>
        </article>
        <article className="fl-tile fl-tile--half" data-reveal="">
          <h3 className="fl-tile__title">{box['IO legs'].title}</h3>
          <p className="fl-tile__text">{box['IO legs'].text}</p>
          <div className="fl-pills fl-pills--mono" aria-hidden="true">{['file_bridge', 'exec_bridge', 'web_ws', 'web_rest', 'ws_bridge', 'mcp_client'].map((m) => <span key={m}>{m}</span>)}</div>
        </article>
        <article className="fl-tile fl-tile--half" data-reveal="">
          <h3 className="fl-tile__title">{box['Folder bundles'].title}</h3>
          <p className="fl-tile__text">{box['Folder bundles'].text}</p>
          <pre className="fl-tree" aria-hidden="true">{'.fantastic/\n└─ bundles/\n   └─ <name>/\n      ├─ bundle.yaml\n      └─ agent.py'}</pre>
        </article>
        <article className="fl-tile fl-tile--half" data-reveal="">
          <h3 className="fl-tile__title">{box['Kernel services'].title}</h3>
          <p className="fl-tile__text">{box['Kernel services'].text}</p>
          <div className="fl-pills fl-pills--mono" aria-hidden="true">{['ps', 'cancel', 'schedule', '[secret]'].map((m) => <span key={m}>{m}</span>)}</div>
        </article>
        <article className="fl-tile fl-tile--wide fl-tile--secure" data-reveal="" id="security">
          <div className="fl-secure__icon"><ShieldIcon size={30} /></div>
          <div>
            <h3 className="fl-tile__title">Deny-all by default.</h3>
            <p className="fl-tile__text">{f.security}</p>
          </div>
        </article>
        <a className="fl-tile fl-tile--wide fl-foundations" data-reveal="" href="/fantastic/foundations/">
          <span className="fl-tile__kicker">Foundations</span>
          <span className="fl-foundations__title">How it works, one mechanism at a time <span className="card__arrow">&rarr;</span></span>
          <span className="fl-tile__text">Articles with short animations: 1. Kernel: agents and messaging · 2. Context folding.</span>
        </a>
      </div>
    </section>
  )
}

/* ---- fantastic canvas: two kernels, then a coding agent moves in ---- */
const Canvas = ({ f }) => (
  <section className="fl-section" id="canvas" aria-labelledby="canvas-title">
    <Head eyebrow="fantastic canvas" id="canvas-title" title={<>Two kernels.<br /><span className="grad">One tree.</span></>} />
    <div className="fl-kernels" data-reveal="">
      {[f.twoKernels.page, f.twoKernels.host].map((k, i) => (
        <React.Fragment key={k.name}>
          {i === 1 && (
            <div className="fl-wire" aria-hidden="true">
              <span className="fl-wire__line"><i /><i /><i /></span>
              <span className="fl-wire__label">one WebSocket · the same send</span>
            </div>
          )}
          <div className={`fl-kernel${i ? ' fl-kernel--host' : ''}`}>
            <span className="fl-kernel__where">{k.where}</span>
            <h3 className="fl-kernel__name">{k.name}</h3>
            <p>{k.role}</p>
          </div>
        </React.Fragment>
      ))}
    </div>
    <ul className="fl-points" data-reveal="">
      {f.twoKernels.points.map((p) => <li key={p}><CheckIcon /> <span>{p}</span></li>)}
    </ul>
    <h3 className="fl-subtitle" data-reveal="">A coding agent moves in</h3>
    <ol className="fl-steps" data-reveal="">
      {f.flow.map((s, i) => (
        <li className="fl-step" key={s.cmd}>
          <span className="fl-step__n">{i + 1}</span>
          <code className="fl-step__cmd">{s.cmd}</code>
          <p>{s.text}</p>
        </li>
      ))}
    </ol>
  </section>
)

const Build = ({ f }) => (
  <section className="fl-section" id="build" aria-labelledby="build-title">
    <Head eyebrow="What you can build" id="build-title" title={<>Whatever you imagine.<br /><span className="grad">Built with an AI.</span></>}
      lead={<>Already built on it: <a className="fx-link" href="/team/">Fantastic Team</a>, unattended team work where a team of AI agents takes your queued tasks and hands back results to review.</>} />
    <div className="fl-build">
      {f.build.map((b) => (
        <article className={`fl-build__card fl-build--${b.key}`} key={b.key} data-reveal="">
          <h3 className="fl-build__title">{b.title}</h3>
          <p>{b.text}</p>
          <button type="button" className="fx-watch" data-seek={b.t}>&#9654; Watch · {fmtTime(b.t)}</button>
        </article>
      ))}
    </div>
  </section>
)

const Compare = ({ f }) => {
  const [first, ...rest] = f.compareGroups
  const Group = ({ g }) => (
    <div className="fx-cmp__group">
      <h3 className="fx-cmp__gtitle">{g.group}</h3>
      {g.rows.map((r) => (
        <div className="fx-cmp__row" key={r.area}>
          <div className="fx-cmp__area">{r.area}</div>
          <div className="fx-cmp__typ"><span className="fx-cmp__tag">Typical</span><Md>{r.typical}</Md></div>
          <div className="fx-cmp__fx">
            <p className="fx-cmp__head">{r.headline}</p>
            <p className="fx-cmp__text"><Md>{r.text}</Md></p>
            {r.gap && <p className="fx-cmp__gap"><Md>{r.gap}</Md></p>}
          </div>
        </div>
      ))}
    </div>
  )
  return (
    <section className="fl-section" id="compare" aria-labelledby="compare-title">
      <Head eyebrow="Fantastic and other agent harnesses" id="compare-title" title="Not another agent loop"
        lead="What agent frameworks and coding harnesses typically offer as of October 2026 (LangGraph, Microsoft Agent Framework, OpenAI Agents SDK, Claude Agent SDK, Google ADK, CrewAI, Mastra, Pydantic AI, Letta, Claude Code, Codex, Gemini CLI and others), and what Fantastic does instead. “Not built” means exactly that." />
      <div className="fx-cmp-legend" aria-hidden="true">
        <span className="fx-cmp-key fx-cmp-key--typ">Typical harness</span>
        <span className="fx-cmp-key fx-cmp-key--fx">Aisixteen Fantastic</span>
        <span className="fx-cmp-key fx-cmp-key--gap">Not built — said plainly</span>
      </div>
      <div className="fx-cmp" data-reveal="">
        <Group g={first} />
        <details className="fl-more">
          <summary><span>See the full comparison</span><span className="fl-more__n">{rest.reduce((n, g) => n + g.rows.length, 0)} more areas</span></summary>
          <div className="fx-cmp">{rest.map((g) => <Group g={g} key={g.group} />)}</div>
        </details>
      </div>
    </section>
  )
}

const Next = ({ f }) => (
  <section className="fl-section" id="next" aria-labelledby="next-title">
    <div className="fl-next" data-reveal="">
      <div className="fl-next__glow" aria-hidden="true" />
      <div className="fl-next__copy">
        <p className="fl-eyebrow"><span className="fl-eyebrow__dot" />Coming soon</p>
        <h2 className="fl-title" id="next-title">The desktop app.<br /><span className="grad">Then fantastic OS.</span></h2>
        <p className="fl-lead">From the app to the operating system, built in the open. No release dates: each step ships when it is ready and green on CI.</p>
        <ul className="fl-principles">{f.principles.map((p) => <li key={p}>{p}</li>)}</ul>
        <div className="fl-cta-row">
          <GitHubCta f={f} primary label="Watch on GitHub" />
          <a className="btn btn--ghost" href={f.roadmap} target="_blank" rel="noreferrer">Follow the roadmap</a>
        </div>
      </div>
      <ol className="fl-miles">
        {f.milestones.map((m) => (
          <li className={`fl-mile fl-mile--${m.status}`} key={m.id} style={{ '--p': m.done / m.total }}>
            <span className="fl-mile__id" aria-hidden="true">{m.id}</span>
            <div className="fl-mile__body">
              <div className="fl-mile__top"><h3 className="fl-mile__name">{m.name}</h3><Chip f={f} s={m.status} /></div>
              <p className="fl-mile__text">{m.text}</p>
              <span className="fl-mile__meter" role="img" aria-label={`${m.done} of ${m.total} steps done`}><span /></span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  </section>
)

const Install = ({ f }) => (
  <section className="fl-section" id="install" aria-labelledby="install-title">
    <Head eyebrow="Install" id="install-title" title={<>Start in <span className="grad">one line.</span></>} />
    <div className="fl-install">
      <div className="fl-install__main" data-reveal="">
        {f.install.map((i, n) => (
          <div className="fl-install__item" key={i.label}>
            <h3 className="fl-install__label">{i.label}</h3>
            {n === 0 ? <CopyLine code={i.code} /> : <pre className="fx-code fx-code--block">{i.code}</pre>}
            {i.note && <p className="fl-install__note">{i.note}</p>}
          </div>
        ))}
      </div>
      <div className="fl-install__agent" data-reveal="">
        <h3 className="fl-install__label">Then hand it to your coding agent</h3>
        <p className="fl-install__note">Open Claude Code, Codex, Gemini CLI or any CLI agent in a project folder and paste:</p>
        <blockquote className="fl-prompt">
          <p>{f.agentPrompt}</p>
          <button type="button" className="fx-copy" data-copy={f.agentPrompt} aria-label="Copy the prompt">Copy</button>
        </blockquote>
        <p className="fl-install__note">Run from an agent's shell, <code>fantastic</code> starts in doc mode: it prints its readme and command list, and starts and writes nothing.</p>
        <div className="fl-cmds">
          {f.commands.map(([cmd, what]) => (
            <div className="fl-cmd" key={cmd}><code>{cmd}</code><span>{what}</span></div>
          ))}
        </div>
      </div>
    </div>
  </section>
)

export const FantasticPage = ({ f, year }) => (
  <div className="page fl-page" style={{ '--accent': f.accent }}>
    <Header />
    <main>
      <section className="fl-hero">
        <div className="fl-hero__bg" aria-hidden="true"><span /><span /><span /></div>
        <a className="fl-pill fl-in" href="#next" style={{ '--d': '0s' }}>
          <span className="fl-pill__tag">Coming soon</span> The desktop app and fantastic OS <span className="card__arrow">&rarr;</span>
        </a>
        <h1 className="fl-hero__title fl-in" style={{ '--d': '.08s' }}>Humans and AIs.<br /><span className="grad">One workspace.</span></h1>
        <p className="fl-hero__sub fl-in" style={{ '--d': '.16s' }}>{f.heroSub}</p>
        <div className="fl-hero__cta fl-in" style={{ '--d': '.24s' }}>
          <CopyLine code={f.install[0].code} />
          <GitHubCta f={f} />
        </div>
        <p className="fl-hero__meta fl-in" style={{ '--d': '.3s' }}>
          <img src={asset(f.icon)} alt="" width="20" height="20" /> {f.fullName} · {f.status} · macOS, Linux &amp; Windows ·{' '}
          <a className="fx-link" href={f.crate} target="_blank" rel="noreferrer">crates.io</a> ·{' '}
          <a className="fx-link" href={f.roadmap} target="_blank" rel="noreferrer">roadmap</a> ·{' '}
          <a className="fx-link" href="/fantastic/foundations/">how it works</a>
        </p>
        <div className="fl-hero__video fl-in" style={{ '--d': '.38s' }}><HeroVideo v={f.video} /></div>
      </section>

      <section className="fl-marquee" aria-label="Works with">
        <p className="fl-marquee__label">Drives any capable model · lives next to your coding agent</p>
        <div className="fl-marquee__mask">
          <ul className="fl-marquee__track">
            {[0, 1].map((copy) => f.worksWith.map((w) => (
              <li key={`${copy}-${w}`} aria-hidden={copy ? 'true' : undefined}>{w}</li>
            )))}
          </ul>
        </div>
      </section>

      <Reel f={f} />
      <Stack f={f} />
      <Kernel f={f} />
      <Canvas f={f} />
      <Build f={f} />
      <Compare f={f} />
      <Next f={f} />
      <Install f={f} />

      <section className="fl-final">
        <div className="fl-final__glow" aria-hidden="true" />
        <img className="fl-final__icon" src={asset(f.icon)} alt={`${f.name} icon`} width="88" height="88" loading="lazy" decoding="async" />
        <h2 className="fl-final__title">Build with <span className="grad">{f.name}.</span></h2>
        <p className="fl-lead">Free and open source under {f.license}. Alpha: expect sharp edges, and tell us what you build.</p>
        <div className="fl-final__install"><CopyLine code={f.install[0].code} /></div>
        <div className="fl-cta-row fl-cta-row--center">
          <GitHubCta f={f} primary label="Star on GitHub" />
          <a className="btn btn--ghost" href={f.crate} target="_blank" rel="noreferrer">View on crates.io</a>
          <a className="btn btn--ghost" href={f.roadmap} target="_blank" rel="noreferrer">Roadmap</a>
        </div>
      </section>
    </main>
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
