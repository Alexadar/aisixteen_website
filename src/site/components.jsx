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
const Md = ({ children }) => String(children).split('`').map((part, i) => (i % 2 ? <code key={i}>{part}</code> : part))

const fmtTime = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`

const CopyLine = ({ code }) => (
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


/* ---------------- fantastic: stack, roadmap, architecture ---------------- */
const issueUrl = (f, n) => `${f.repo}/issues/${n}`
const IssueRef = ({ f, n }) => (
  <a className="fx-issue" href={issueUrl(f, n)} target="_blank" rel="noreferrer" aria-label={`Issue ${n} on GitHub`}>#{n}</a>
)
// Status chip: colour AND glyph shape differ per status, so it never relies on colour alone.
const Chip = ({ f, s }) => <span className={`fx-chip fx-chip--${s}`}>{f.statuses[s].label}</span>
// Done / not-yet mark for a roadmap part; the hidden text is what a screen reader hears.
const Mark = ({ done, status = 'soon' }) => (
  <span className={`fx-mark fx-mark--${done ? 'done' : status}`}>
    <span className="sr-only">{done ? 'Done: ' : `${status === 'progress' ? 'In progress' : status === 'stretch' ? 'Stretch' : 'Planned'}: `}</span>
  </span>
)

const StackLegend = ({ f, keys = ['available', 'progress', 'dev', 'soon', 'stretch', 'host'] }) => (
  <ul className="fx-legend" aria-label="Status legend">
    {keys.map((k) => (
      <li key={k}><Chip f={f} s={k} /><span>{f.statuses[k].note}</span></li>
    ))}
  </ul>
)

const StackBlock = ({ f, b }) => (
  <li className={`fx-sb fx-sb--${b.status}${b.span >= 6 ? ' fx-sb--wide' : ''}`} style={{ '--span': b.span }}>
    <div className="fx-sb__top">
      <h4 className="fx-sb__name">{b.name}</h4>
      <Chip f={f} s={b.status} />
    </div>
    {b.id && <code className="fx-sb__id">{b.id}</code>}
    <p className="fx-sb__text">{b.text}</p>
    {b.parts && (
      <ul className="fx-parts">
        {b.parts.map((p) => (
          <li key={p.issue}><Mark done={p.done} status="progress" />{p.text} <IssueRef f={f} n={p.issue} /></li>
        ))}
      </ul>
    )}
    {b.issue && <p className="fx-sb__ref">Roadmap <IssueRef f={f} n={b.issue} /></p>}
  </li>
)

// The centerpiece: every layer of the stack, top (what you touch) to bottom (the machine).
const StackDiagram = ({ f }) => (
  <ol className="fx-stack" aria-label="The Fantastic stack, from apps at the top to hardware at the bottom">
    {f.stack.map((l, i) => (
      <li className={`fx-layer-row fx-layer-row--${l.key}`} key={l.key}>
        <div className="fx-layer-row__label">
          <span className="fx-layer-row__n" aria-hidden="true">L{f.stack.length - i}</span>
          <h3 className="fx-layer-row__name">{l.name}</h3>
          <code className="fx-layer-row__id">{l.id}</code>
        </div>
        <ul className="fx-layer-row__blocks">
          {l.blocks.map((b) => <StackBlock f={f} b={b} key={b.name} />)}
        </ul>
      </li>
    ))}
  </ol>
)

// Compact stack for the home hero: one row per layer, one glyph per block, links to the full diagram.
// `row` lays the layers out left to right (the /fantastic/ hero); the default stacks them (home).
const StackStrip = ({ f, row = false }) => {
  const layers = f.stack.filter((l) => l.key !== 'hw')
  const count = (l, ks) => l.blocks.filter((b) => ks.includes(b.status)).length
  return (
    <a className={`fx-strip${row ? ' fx-strip--row' : ''}`} href={row ? '#stack' : `/${f.slug}/#stack`}>
      <span className="fx-strip__title">{row ? 'Every layer, top to bottom' : 'The stack, built from scratch'} <span className="card__arrow">&rarr;</span></span>
      <span className="fx-strip__rows">
        {layers.map((l) => {
          const live = count(l, ['available'])
          const doing = count(l, ['progress', 'dev'])
          const later = count(l, ['soon', 'stretch'])
          const said = [live && `${live} available`, doing && `${doing} in progress`, later && `${later} planned`].filter(Boolean).join(', ')
          return (
            <span className="fx-strip__row" key={l.key}>
              <span className="fx-strip__name">{l.name}</span>
              <span className="fx-strip__dots" aria-hidden="true">
                {l.blocks.map((b) => <i className={`fx-dot fx-dot--${b.status}`} key={b.name} />)}
              </span>
              <span className="sr-only">: {said}.</span>
            </span>
          )
        })}
      </span>
      <span className="fx-strip__key" aria-hidden="true">
        <span><i className="fx-dot fx-dot--available" /> Available</span>
        <span><i className="fx-dot fx-dot--progress" /> In progress</span>
        <span><i className="fx-dot fx-dot--soon" /> Coming soon</span>
        <span><i className="fx-dot fx-dot--stretch" /> Stretch</span>
        <span><i className="fx-dot fx-dot--host" /> Host</span>
      </span>
    </a>
  )
}

const Roadmap = ({ f }) => (
  <section className="inside" id="roadmap" aria-labelledby="roadmap-title">
    <p className="fx-kicker">Roadmap</p>
    <h2 id="roadmap-title">{f.roadmapTitle}</h2>
    <p className="fx-p fx-lead">Public, milestone by milestone, in epic <IssueRef f={f} n={57} />. No dates: every phase lands only when CI is green on Linux, macOS and Windows. Ticked items are merged in the source; they reach a release with the milestone.</p>
    <ol className="fx-rm">
      {f.milestones.map((m) => {
        const done = m.items.filter((i) => i.done).length
        return (
          <li className={`fx-rm__m fx-rm__m--${m.status}`} key={m.id}>
            <span className="fx-rm__node" aria-hidden="true">{m.id}</span>
            <div className="fx-rm__card">
              <div className="fx-rm__head">
                <h3 className="fx-rm__name">
                  {m.id !== '+' && <span className="fx-rm__id">{m.id} · </span>}
                  {m.url ? <a href={m.url} target="_blank" rel="noreferrer">{m.name}</a> : m.name}
                </h3>
                <Chip f={f} s={m.status} />
              </div>
              <p className="fx-rm__text">{m.text}</p>
              <p className="fx-rm__count">{done} of {m.items.length} done</p>
              <ul className="fx-rm__items">
                {m.items.map((it) => (
                  <li key={it.issue} className={it.done ? 'is-done' : ''}>
                    <Mark done={it.done} status={it.status || (m.status === 'stretch' ? 'stretch' : 'soon')} />
                    <span>{it.text} <IssueRef f={f} n={it.issue} /></span>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        )
      })}
    </ol>
    <p className="fx-rm__deferred"><b>Deferred:</b> {f.deferred.text} <IssueRef f={f} n={f.deferred.issue} /></p>
    <div className="fx-row-links">
      <a className="btn btn--primary" href={f.roadmap} target="_blank" rel="noreferrer">Full roadmap</a>
      <a className="btn btn--ghost" href={f.epic} target="_blank" rel="noreferrer"><GitHubIcon /> Epic #57</a>
    </div>
  </section>
)

const ArchLink = ({ link }) => (
  Array.isArray(link) ? (
    <div className="fx-arch__link fx-arch__link--pair" aria-hidden="true">
      <span className="fx-arch__wire fx-arch__wire--down">{link[0]}</span>
      <span className="fx-arch__wire fx-arch__wire--up">{link[1]}</span>
    </div>
  ) : (
    <div className="fx-arch__link" aria-hidden="true"><span className="fx-arch__wire fx-arch__wire--down">{link}</span></div>
  )
)

const Architecture = ({ f }) => (
  <section className="inside" id="architecture" aria-labelledby="arch-title">
    <p className="fx-kicker">Architecture</p>
    <h2 id="arch-title">One UI, many skins, a pure core</h2>
    <p className="fx-p fx-lead">How the desktop app and fantastic OS are put together, from the window you see down to the one place that touches the OS.</p>
    <div className="fx-arch">
      <ol className="fx-arch__flow" aria-label="From the outermost shell to the OS layer">
        {f.arch.map((n) => (
          <li className="fx-arch__step" key={n.layer}>
            <div className="fx-arch__node">
              <span className="fx-arch__layer">{n.layer}</span>
              <div className="fx-arch__body">
                <div className="fx-arch__top">
                  <h3 className="fx-arch__name">{n.name}</h3>
                  <Chip f={f} s={n.status} />
                </div>
                <code className="fx-arch__id">{n.id}</code>
                <p className="fx-arch__text">{n.text}</p>
                <p className="fx-arch__refs">
                  {n.issues.map((i) => (
                    <span key={i.n}><Mark done={i.done} status={i.status} /><IssueRef f={f} n={i.n} /></span>
                  ))}
                </p>
              </div>
            </div>
            {n.link && <ArchLink link={n.link} />}
            {n.link && <p className="sr-only">{Array.isArray(n.link) ? `${n.link[0]} go down to the next layer; ${n.link[1]} come back up.` : `It ${n.link} the next layer.`}</p>}
          </li>
        ))}
      </ol>
      <dl className="fx-principles">
        {f.principles.map((p) => (
          <div key={p.term}>
            <dt>{p.term}</dt>
            <dd>{p.text}</dd>
          </div>
        ))}
      </dl>
    </div>
  </section>
)

const ComingSoon = ({ f }) => (
  <section className="final-cta-wrap fx-soon-wrap" aria-labelledby="soon-title">
    <div className="fx-soon">
      <p className="fx-kicker">Coming soon</p>
      <h2 id="soon-title">The desktop app, then fantastic OS</h2>
      <p className="fx-soon__lead">Built in the open, phase by phase. No release dates: each one ships when it is ready and green on CI.</p>
      <div className="fx-soon__cards">
        {f.comingSoon.map((c) => (
          <div className={`fx-soon__card fx-soon__card--${c.status}`} key={c.name}>
            <Chip f={f} s={c.status} />
            <h3 className="fx-h3">{c.name}</h3>
            <p>{c.text}</p>
          </div>
        ))}
      </div>
      <div className="fx-cta-row">
        <a className="btn btn--primary" href={f.roadmap} target="_blank" rel="noreferrer">Follow the roadmap</a>
        <a className="btn btn--ghost" href={f.repo} target="_blank" rel="noreferrer"><GitHubIcon /> Watch or star on GitHub</a>
      </div>
    </div>
  </section>
)


/* ---------------- fantastic: ad-style infographic carousel ---------------- */
// Drawings, not screenshots: the OS and app slides show the plan and say "Concept".
const AdVisualOS = () => (
  <div className="fx-v fx-v--os" aria-hidden="true">
    <span className="fx-v__concept">Concept · planned</span>
    <div className="fx-v-os__screen">
      <div className="fx-v-os__boot">
        <span><b>[ ok ]</b> Debian, headless</span>
        <span><b>[ ok ]</b> Wayland kiosk compositor</span>
        <span><b>[ ok ]</b> the desktop app, full-screen</span>
      </div>
      <div className="fx-v-os__home">
        <span className="fx-v-os__homebar">Home</span>
        <span className="fx-v-os__tiles"><i /><i /><i /><i /><i /><i /></span>
      </div>
    </div>
    <div className="fx-v-os__stand" />
    <div className="fx-v-os__bus">
      {['network', 'audio', 'power', 'displays'].map((a) => <span className="fx-v-os__agent" key={a}><code>{a}</code></span>)}
    </div>
    <span className="fx-v-os__buslabel">system agents · reached with send</span>
  </div>
)

const AdVisualApp = () => (
  <div className="fx-v fx-v--app" aria-hidden="true">
    <span className="fx-v__concept">Concept · in progress</span>
    <div className="fx-v-app__win">
      <div className="frame-mac__bar">
        <span className="tl tl--r" /><span className="tl tl--y" /><span className="tl tl--g" />
        <span className="frame-mac__title">fantastic · Home</span>
      </div>
      <div className="fx-v-app__body">
        {[['dashboard', '~/work/dashboard', 'on'], ['artwork', '~/art/scene', 'on'], ['chatbot', '~/srv/chatbot', 'off'], ['notes', '~/notes', 'off']].map(([n, p, st]) => (
          <div className="fx-v-app__row" key={n}>
            <i className={`fx-v-app__led fx-v-app__led--${st}`} />
            <span className="fx-v-app__name">{n}<code>{p}</code></span>
            <span className="fx-v-app__btn">{st === 'on' ? 'Open' : 'Start'}</span>
            <span className="fx-v-app__btn fx-v-app__btn--ghost">{st === 'on' ? 'Stop' : '···'}</span>
          </div>
        ))}
      </div>
    </div>
    <div className="fx-v-app__foot">
      <span className="fx-v-app__skins"><span className="is-on">dark</span><span>glass</span></span>
      <span className="fx-v-app__oses">macOS · Windows · Linux</span>
    </div>
  </div>
)

const AdVisualCLI = ({ f }) => (
  <div className="fx-v fx-v--cli" aria-hidden="true">
    <div className="frame-mac fx-v-cli__term">
      <div className="frame-mac__bar">
        <span className="tl tl--r" /><span className="tl tl--y" /><span className="tl tl--g" />
        <span className="frame-mac__title">~/project</span>
      </div>
      <pre className="fx-v-cli__code">{[
        ['$ cargo install fantastic --locked', ''],
        ['$ fantastic', '# the terminal UI'],
        ['$ fantastic canvas', '# the browser canvas'],
        ['$ fantastic mcp', '# MCP for your coding agent'],
      ].map(([c, k], i) => <span key={i}><b>{c}</b>{k && <em>  {k}</em>}{'\n'}</span>)}</pre>
    </div>
    <div className="fx-v-cli__faces">
      <span className="fx-v-cli__face"><code>TUI</code>in your terminal</span>
      <span className="fx-v-cli__face"><code>canvas</code>in your browser</span>
      <span className="fx-v-cli__face"><code>mcp</code>in Claude Code, Codex…</span>
    </div>
  </div>
)

const AdVisualLib = ({ f }) => (
  <div className="fx-v fx-v--lib" aria-hidden="true">
    <div className="fx-v-lib__grid">
      {f.runtimes.map((r) => (
        <span className={`fx-v-lib__rt fx-v-lib__rt--${r.name.toLowerCase()}`} key={r.name}>
          <b>{r.name}</b><small>{r.short}</small>
        </span>
      ))}
      <span className="fx-v-lib__core">
        <code>send</code>
        <small>one protocol</small>
      </span>
    </div>
    <div className="fx-v-lib__contract"><code>contract/</code> one corpus, run by every host</div>
  </div>
)

const AD_VISUAL = { os: AdVisualOS, app: AdVisualApp, cli: AdVisualCLI, lib: AdVisualLib }

const AdCarousel = ({ f }) => (
  <section className="fx-ads" id="family" aria-roledescription="carousel" aria-label="The Fantastic family: OS, app, CLI and library">
    <div className="fx-ads__head">
      <div>
        <p className="fx-kicker">The family</p>
        <h2 className="fx-ads__title">One protocol, from the OS to the library.</h2>
      </div>
      <div className="fx-ads__nav">
        <div className="fx-ads__tabs" role="group" aria-label="Choose a slide">
          {f.ads.map((a, i) => (
            <button type="button" className={`fx-ads__tab${i === 0 ? ' is-active' : ''}`} data-slide={i} key={a.key} aria-label={`${a.name}, slide ${i + 1} of ${f.ads.length}`} style={{ '--tone': a.tone }}>
              <span className="fx-ads__tabn">{a.n}</span>{a.tab}
            </button>
          ))}
        </div>
        <div className="fx-ads__arrows">
          <button type="button" className="fx-ads__arrow" data-step="-1" aria-label="Previous slide">&larr;</button>
          <button type="button" className="fx-ads__arrow" data-step="1" aria-label="Next slide">&rarr;</button>
        </div>
      </div>
    </div>
    <div className="fx-ads__track" tabIndex={0} aria-label="Slides; scroll sideways or use the buttons">
      {f.ads.map((a, i) => {
        const Visual = AD_VISUAL[a.key]
        return (
          <article className={`fx-ad fx-ad--${a.key}`} key={a.key} style={{ '--tone': a.tone }} aria-roledescription="slide" aria-label={`${i + 1} of ${f.ads.length}: ${a.name}`}>
            <div className="fx-ad__copy">
              <div className="fx-ad__meta">
                <span className="fx-ad__n">{a.n}</span>
                <span className="fx-ad__name">{a.name}</span>
                <Chip f={f} s={a.status} />
              </div>
              <h3 className="fx-ad__title">{a.title}</h3>
              <p className="fx-ad__text">{a.text}</p>
              <dl className="fx-ad__stats">
                {a.stats.map(([n, l]) => (
                  <div key={l}><dt>{n}</dt><dd>{l}</dd></div>
                ))}
              </dl>
              <div className="fx-ad__cta">
                {a.status === 'available' && a.key === 'cli' && <CopyLine code={f.install[0].code} />}
                {a.status === 'available' && a.key === 'lib' && <a className="btn btn--primary" href={f.repo} target="_blank" rel="noreferrer"><GitHubIcon /> Read the source</a>}
                {a.status !== 'available' && <a className="btn btn--ghost" href={issueUrl(f, a.issue)} target="_blank" rel="noreferrer">Follow #{a.issue} on GitHub</a>}
              </div>
            </div>
            <div className="fx-ad__visual"><Visual f={f} /></div>
          </article>
        )
      })}
    </div>
  </section>
)

export const FantasticPage = ({ f, year }) => {
  const installCmd = f.install[0].code
  return (
  <div className="page" style={{ '--accent': f.accent }}>
    <Header />
    <main>
      <section className="hero fx-hero fx-phero rise">
        <span className="hero__badge"><img src={asset(f.icon)} alt="" width="22" height="22" className="fx-phero__icon" /> {f.fullName} · {f.status}</span>
        <h1 className="hero__title fx-hero__title">Built from scratch,<br /><span className="grad">layer by layer.</span></h1>
        <p className="hero__sub">{f.tagline} {f.heroSub}</p>
        <div className="fx-phero__install">
          <CopyLine code={installCmd} />
          <p className="fx-phero__note">From <a className="fx-link" href={f.crate} target="_blank" rel="noreferrer">crates.io</a> · Rust 1.88+ · macOS, Linux &amp; Windows · <a className="fx-link" href="#install">other ways to install</a> · <a className="fx-link" href={f.roadmap} target="_blank" rel="noreferrer">roadmap</a></p>
        </div>
        <div className="hero__cta">
          <a className="btn btn--primary" href="#install">Install</a>
          <a className="btn btn--ghost" href={f.repo} target="_blank" rel="noreferrer"><GitHubIcon /> Source on GitHub</a>
        </div>
        <StackStrip f={f} row />
        <HeroVideo v={f.video} />
      </section>

      <AdCarousel f={f} />

      <section className="inside fx-stack-wrap" id="stack" aria-labelledby="stack-title">
        <p className="fx-kicker">The stack</p>
        <h2 id="stack-title">One product family, every layer</h2>
        <p className="fx-p fx-lead">{f.stackLead}</p>
        <StackLegend f={f} />
        <StackDiagram f={f} />
        <p className="fx-stack__foot">Status as of the public roadmap, epic <IssueRef f={f} n={57} />. <a className="fx-link" href="#roadmap">Milestones below</a> · <a className="fx-link" href={f.roadmap} target="_blank" rel="noreferrer">full roadmap</a></p>
      </section>

      <section className="inside fx-layers-wrap">
        <p className="fx-kicker">Not a simple harness</p>
        <h2>A meta-runtime — ready to power any AI app.</h2>
        <div className="fx-layers">
          {[f.layers.product, f.layers.engine].map((l) => (
            <div className={`fx-layer${l === f.layers.engine ? ' fx-layer--engine' : ''}`} key={l.name}>
              <span className="fx-layer__name">{l.name}</span>
              <h3 className="fx-layer__title">{l.title}</h3>
              <p>{l.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="inside">
        <h2>The idea in one call</h2>
        <div className="split fx-split">
          <div>
            <p className="fx-p fx-lead">{f.blurb}</p>
            <p className="fx-p">{f.oneCallNote}</p>
          </div>
          <Terminal title="one batch send">{f.oneCall}</Terminal>
        </div>
        <div className="features fx-concepts">
          {f.concepts.map((c) => (
            <div className="feature" key={c.term}>
              <h3 className="fx-term-name">{c.term}</h3>
              <p>{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="inside" id="compare">
        <p className="fx-kicker">Fantastic and other agent harnesses</p>
        <h2>Not another agent loop</h2>
        <p className="fx-p fx-lead">What agent frameworks and coding harnesses typically offer as of October 2026 (LangGraph, Microsoft Agent Framework, OpenAI Agents SDK, Claude Agent SDK, Google ADK, CrewAI, Mastra, Pydantic AI, Letta, Claude Code, Codex, Gemini CLI and others), and what Fantastic does instead. “Not built” means exactly that.</p>
        <div className="fx-cmp-legend" aria-hidden="true">
          <span className="fx-cmp-key fx-cmp-key--typ">Typical harness</span>
          <span className="fx-cmp-key fx-cmp-key--fx">Aisixteen Fantastic</span>
          <span className="fx-cmp-key fx-cmp-key--gap">Not built — said plainly</span>
        </div>
        <div className="fx-cmp">
          {f.compareGroups.map((g) => (
            <div className="fx-cmp__group" key={g.group}>
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
          ))}
        </div>
      </section>

      <section className="inside">
        <p className="fx-kicker">fantastic canvas</p>
        <h2>Two kernels, one tree</h2>
        <div className="fx-kgrid">
        <div className="fx-kernels">
          {[f.twoKernels.page, f.twoKernels.host].map((k, i) => (
            <React.Fragment key={k.name}>
              {i === 1 && <div className="fx-kernels__wire"><span>one WebSocket · the same send</span></div>}
              <div className={`fx-kernel${i ? ' fx-kernel--host' : ''}`}>
                <span className="fx-kernel__where">{k.where}</span>
                <h3 className="fx-layer__title">{k.name}</h3>
                <p>{k.role}</p>
              </div>
            </React.Fragment>
          ))}
        </div>
        <ul className="fx-points">
          {f.twoKernels.points.map((p) => <li key={p}><CheckIcon /> <span>{p}</span></li>)}
        </ul>
        </div>
      </section>

      <section className="inside">
        <h2>A coding agent moves in</h2>
        <ol className="fx-flow">
          {f.flow.map((s, i) => (
            <li className="fx-flow__step" key={s.cmd}>
              <span className="fx-flow__n">{i + 1}</span>
              <code className="fx-flow__cmd">{s.cmd}</code>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="inside">
        <h2>What you can build</h2>
        <div className="features fx-build">
          {f.build.map((b) => (
            <div className={`feature fx-build__card fx-build--${b.key}`} key={b.key}>
              <h3 className="fx-h3">{b.title}</h3>
              <p>{b.text}</p>
              <button type="button" className="fx-watch" data-seek={b.t}>&#9654; Watch · {fmtTime(b.t)}</button>
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
            <h3 className="fx-h3">Then start with your coding agent</h3>
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

      <Roadmap f={f} />

      <Architecture f={f} />

      <ComingSoon f={f} />

      <section className="privacy-strip">
        <div className="privacy-strip__box">
          <ShieldIcon size={26} />
          <p><b>Deny-all by default.</b> {f.security}</p>
        </div>
      </section>

      <section className="final-cta-wrap">
        <div className="final-cta">
          <h2>Try {f.name}</h2>
          <p>Free and open source under {f.license}. Alpha — expect sharp edges, and tell us what you build. See what's next on the <a className="fx-link" href={f.roadmap} target="_blank" rel="noreferrer">public roadmap</a>.</p>
          <div className="fx-final-install"><CopyLine code={installCmd} /></div>
          <div className="fx-cta-row">
            <a className="btn btn--primary" href={f.crate} target="_blank" rel="noreferrer">View on crates.io</a>
            <a className="btn btn--ghost" href={f.repo} target="_blank" rel="noreferrer"><GitHubIcon /> GitHub</a>
          </div>
        </div>
      </section>
    </main>
    <Footer year={year} />
  </div>
  )
}

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
