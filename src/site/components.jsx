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

export const Home = ({ apps, featured, fantastic, year }) => {
  const liveApps = apps.filter((a) => a.live).map((a) => a.name)
  return (
  <div className="page">
    <Header />
    <main>
      <section className="hero rise">
        <div className="hero__badge"><span className="dot-live" /> Independent apps for iPhone, iPad &amp; Mac</div>
        <h1 className="hero__title">Apps that keep<br /><span className="grad">to themselves.</span></h1>
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

      {fantastic && <FantasticBanner f={fantastic} />}

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

/* ---------------- fantastic ---------------- */
const GitHubIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.39-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z" />
  </svg>
)

// Home-page block: kept apart from the consumer-app grid on purpose.
const FantasticBanner = ({ f }) => (
  <section className="section">
    <a className="fx-banner" href={`/${f.slug}/`} style={{ '--accent': f.accent }} aria-label={`Open ${f.name}`}>
      <img className="fx-banner__icon" src={asset(f.icon)} alt={`${f.name} icon`} width="72" height="72" loading="lazy" decoding="async" />
      <div className="fx-banner__body">
        <span className="eyebrow">{f.status}</span>
        <div className="fx-banner__name">{f.fullName}</div>
        <p className="fx-banner__desc">{f.tagline} {f.short}</p>
      </div>
      <span className="btn btn--ghost fx-banner__cta">Explore Fantastic <span className="card__arrow">&rarr;</span></span>
    </a>
  </section>
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

export const FantasticPage = ({ f, year }) => (
  <div className="page" style={{ '--accent': f.accent }}>
    <Header />
    <main>
      <section className="landing-hero" style={{ paddingTop: 34, paddingBottom: 0 }}>
        <a className="back" href="/"><span>&larr;</span> AISixteen</a>
      </section>

      <section className="landing-hero rise">
        <div className="split">
          <div>
            <span className="landing__cat">{f.status}</span>
            <div className="landing__head">
              <img className="landing__icon" src={asset(f.icon)} alt={`${f.name} icon`} width="78" height="78" />
              <h1 className="landing__title">{f.name}</h1>
            </div>
            <p className="landing__tagline">{f.tagline}</p>
            <p className="landing__blurb">{f.blurb}</p>
            <div className="landing__actions">
              <a className="btn btn--primary" href={f.releases} target="_blank" rel="noreferrer">Download the CLI</a>
              <a className="btn btn--ghost" href={f.repo} target="_blank" rel="noreferrer"><GitHubIcon /> Source on GitHub</a>
            </div>
            {f.badges && f.badges.length > 0 && (
              <div className="fx-badges">
                {f.badges.map((b) => (
                  <a href={b.href} target="_blank" key={b.href}>
                    <img src={b.src} alt={b.alt} width={b.width} height={b.height} />
                  </a>
                ))}
              </div>
            )}
            <p className="meta-note fx-meta">macOS &amp; Linux · arm64 &amp; x86_64 · {f.license} · <a className="fx-link" href={f.crate} target="_blank" rel="noreferrer">on crates.io</a></p>
          </div>
          <div>
            <Terminal title="the idea in one call">{f.oneCall}</Terminal>
            <p className="fx-note">{f.oneCallNote}</p>
          </div>
        </div>
      </section>

      <section className="inside">
        <h2>One primitive, all the way down</h2>
        <div className="features">
          {f.concepts.map((c) => (
            <div className="feature" key={c.term}>
              <h3 className="fx-term-name">{c.term}</h3>
              <p>{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="inside">
        <h2>What's in the box</h2>
        <div className="features fx-grid-2">
          {f.inTheBox.map((b) => (
            <div className="feature" key={b.title}>
              <div className="feature__icon"><CheckIcon /></div>
              <h3 className="fx-h3">{b.title}</h3>
              <p>{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="inside" id="install">
        <h2>Install</h2>
        <div className="fx-install">
          {f.install.map((i) => (
            <div key={i.label}>
              <h3 className="fx-h3">{i.label}</h3>
              {i.note && <p className="fx-p">{i.note}</p>}
              <pre className="fx-code fx-code--block">{i.code}</pre>
            </div>
          ))}
          <div>
            <h3 className="fx-h3">Or start with your coding agent</h3>
            <p className="fx-p">Open Claude Code, Codex, Gemini CLI or any CLI agent in a project folder and paste:</p>
            <blockquote className="fx-quote">{f.agentPrompt}</blockquote>
            <p className="fx-p">Run from an agent's shell, <code>fantastic</code> starts in doc mode: it prints its readme and command list, and starts and writes nothing.</p>
          </div>
        </div>
        <div className="fx-commands">
          {f.commands.map(([cmd, what]) => (
            <div className="fx-cmd" key={cmd}><code>{cmd}</code><span>{what}</span></div>
          ))}
        </div>
      </section>

      <section className="inside">
        <h2>Four runtimes, one protocol</h2>
        <p className="fx-p fx-lead">Interchangeable hosts share one wire protocol and one <code>.fantastic/</code> workdir. A shared contract corpus pins identical behaviour across them, and model-driven end-to-end tests score live models by what they built — not by what they said.</p>
        <div className="features">
          {f.runtimes.map((r) => (
            <div className="feature" key={r.name}>
              <h3 className="fx-term-name">{r.name}</h3>
              <p>{r.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="inside">
        <h2>The Fantastic family</h2>
        <div className="features">
          {f.family.map((m) => (
            <div className="feature" key={m.name}>
              <span className={`fx-state${m.state === 'Available' ? ' is-live' : ''}`}>{m.state}</span>
              <h3 className="fx-h3">{m.name}</h3>
              <p>{m.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="privacy-strip">
        <div className="privacy-strip__box">
          <ShieldIcon size={26} />
          <p><b>Deny-all by default.</b> {f.security}</p>
        </div>
      </section>

      <section className="final-cta-wrap">
        <div className="final-cta">
          <h2>Try {f.name}</h2>
          <p>Free and open source under {f.license}. Alpha — expect sharp edges, and tell us what you build.</p>
          <pre className="fx-code fx-code--block fx-code--inline">cargo install fantastic</pre>
          <div className="fx-cta-row">
            <a className="btn btn--primary" href={f.releases} target="_blank" rel="noreferrer">Download the CLI</a>
            <a className="btn btn--ghost" href={f.repo} target="_blank" rel="noreferrer"><GitHubIcon /> GitHub</a>
          </div>
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
