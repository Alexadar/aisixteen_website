import React from 'react'
import { SITE, FILTERS, appStoreUrl, platformsOf, faqsOf, trustPointsOf, privacyLineOf, claimOf, fmtDate } from './theme.js'

const asset = (p) => `/${p}`

// Site-wide data the chrome needs (the footer lists every app). Set once by render.jsx.
export const ctx = { apps: [], posts: [] }

/* ---------------- icons ---------------- */
const ShieldIcon = ({ size = 34, stroke = '#55d3ff', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)
const CheckIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)
const AppleIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
    <path d="M16.365 1.43c0 1.14-.42 2.2-1.12 2.98-.85.94-2.24 1.66-3.4 1.57-.13-1.1.44-2.28 1.1-3.02.75-.85 2.06-1.5 3.42-1.53zM20.44 17.1c-.55 1.27-.82 1.84-1.53 2.97-.99 1.57-2.38 3.53-4.1 3.54-1.53.02-1.92-1-4-1-2.07 0-2.5.98-4.03 1.02-1.72.03-3.03-1.7-4.02-3.27-2.77-4.4-3.06-9.55-1.35-12.3 1.21-1.94 3.13-3.08 4.93-3.08 1.84 0 2.99 1.01 4.5 1.01 1.47 0 2.36-1.01 4.5-1.01 1.6 0 3.3.87 4.5 2.38-3.96 2.17-3.31 7.82.6 9.62z" />
  </svg>
)
const CheckCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)
const GitHubIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.39-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z" />
  </svg>
)
// Used by the /fantastic/ page (styles in fantastic.css).
const Terminal = ({ title, children }) => (
  <div className="frame-mac fx-term">
    <div className="frame-mac__bar">
      <span className="tl tl--r" /><span className="tl tl--y" /><span className="tl tl--g" />
      <span className="frame-mac__title">{title}</span>
    </div>
    <pre className="fx-code">{children}</pre>
  </div>
)

/* ---------------- shared chrome ---------------- */
const Logo = ({ size = 32 }) => (
  <img src={asset('logo-96.webp')} alt="" width={Math.round(size * 0.875)} height={size} />
)

export const Header = () => (
  <>
    <a className="skip" href="#main">Skip to content</a>
    <header className="site-header">
      <div className="site-header__inner">
        <a className="brand" href="/" aria-label="AISixteen home">
          <Logo />
          <span className="brand__name">AISixteen</span>
        </a>
        <nav className="nav" aria-label="Main">
          <a className="nav__link" href="/#apps">Apps</a>
          <a className="nav__link" href="/#guides">Guides</a>
          <a className="nav__link" href="/fantastic/">Fantastic</a>
          <a className="btn btn--primary btn--sm nav__cta" href={`mailto:${SITE.email}`}>Get in touch</a>
        </nav>
      </div>
    </header>
  </>
)

export const Footer = ({ year }) => {
  const withPosts = ctx.apps.filter((a) => a.posts && a.posts.length)
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer">
          <div>
            <div className="footer__brand-row"><Logo /><span>AISixteen</span></div>
            <p>Small, fast, private apps for iPhone, iPad, Mac and Apple Watch, and Fantastic, an open-source kernel of agents.</p>
            <a className="btn btn--ghost btn--sm" href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </div>
          <nav aria-label="Apps">
            <h2>Apps</h2>
            <ul className="footer__apps">
              {ctx.apps.map((a) => <li key={a.slug}><a href={`/${a.slug}/`}>{a.name}</a></li>)}
            </ul>
          </nav>
          <nav aria-label="More">
            <h2>Guides</h2>
            <ul>
              {withPosts.map((a) => <li key={a.slug}><a href={`/${a.slug}/blog/`}>{a.name} guides</a></li>)}
            </ul>
            <h2 style={{ marginTop: 22 }}>AISixteen</h2>
            <ul>
              <li><a href="/fantastic/">Fantastic</a></li>
              <li><a href="/#privacy">Privacy</a></li>
              <li><a href={SITE.developerUrl} target="_blank" rel="noreferrer">App Store developer page</a></li>
              <li><a href={SITE.github} target="_blank" rel="noreferrer">GitHub</a></li>
            </ul>
          </nav>
        </div>
        <div className="footer__bottom"><span>© {year} AISixteen</span><span>No accounts. No tracking.</span></div>
      </div>
    </footer>
  )
}

const AppStoreButton = ({ app }) => (
  <a className="btn btn--appstore" href={appStoreUrl(app)} target="_blank" rel="noreferrer" aria-label={`Download ${app.name} on the App Store`}>
    <AppleIcon />
    <span className="as-lines">
      <span className="as-top">Download on the</span>
      <span className="as-big">App Store</span>
    </span>
  </a>
)

const Crumbs = ({ items }) => (
  <nav className="crumbs wrap" aria-label="Breadcrumb">
    <ol>
      {items.map((c, i) => (
        <li key={i}>{c.href ? <a href={c.href}>{c.name}</a> : <span aria-current="page">{c.name}</span>}</li>
      ))}
    </ol>
  </nav>
)

const minutes = (n) => `${n} min read`

// One post in a list. `showApp` adds the app's icon and name (home page, where apps mix).
const PostCard = ({ post, showApp = false, level = 3 }) => {
  const H = `h${level}`
  return (
    <li>
      <a className="post-card acc" href={post.url} style={{ '--accent': post.app.accent }}>
        {showApp && <span className="post-card__app"><img src={asset(post.app.iconSm)} alt="" width="22" height="22" loading="lazy" decoding="async" />{post.app.name}</span>}
        <H className="post-card__title">{post.title}</H>
        <p className="post-card__desc">{post.description}</p>
        <span className="post-card__meta"><time dateTime={post.date}>{fmtDate(post.date)}</time> · {minutes(post.minutes)}</span>
      </a>
    </li>
  )
}

/* ---------------- home ---------------- */
const AppCard = ({ app }) => (
  <a className="card acc" id={app.slug} href={`/${app.slug}/`} data-group={app.group} style={{ '--accent': app.accent }}>
    <img className="card__shot" src={asset(app.shotSm)} alt={`${app.name} screenshot`} width="960" height="600" loading="lazy" decoding="async" />
    <div className="card__body">
      <div className="card__head">
        <img className="card__icon" src={asset(app.iconSm)} alt="" width="48" height="48" loading="lazy" decoding="async" />
        <div style={{ minWidth: 0 }}>
          <h3 className="card__name">{app.name}</h3>
          <span className="card__cat">{app.category}</span>
        </div>
      </div>
      <p className="card__desc">{app.tagline}</p>
    </div>
  </a>
)

const FantasticStage = ({ f }) => (
  <div className="stage">
    <img className="stage__icon" src={asset(f.iconSm)} alt="" width="68" height="68" />
    <div className="term">
      <div className="term__bar"><i /><i /><i /><span>the idea in one call</span></div>
      <pre>{f.oneCall}</pre>
    </div>
    <ul className="layers" aria-label="The Fantastic stack, layer by layer">
      {f.stackLayers.map((l) => (
        <li key={l.key}>
          <span>{l.name}</span>
          <span className={`layers__state${l.status.includes('available') ? ' is-on' : ''}`}>{l.status.map((s) => f.statuses[s].label).join(' / ')}</span>
        </li>
      ))}
    </ul>
    <a className="stage__more" href={`/${f.slug}/#stack`}>The stack, built from scratch <span className="card__arrow">&rarr;</span></a>
  </div>
)

export const Home = ({ apps, featured, fantastic: f, posts, year }) => {
  const liveApps = apps.filter((a) => a.live).map((a) => a.name)
  const withPosts = apps.filter((a) => a.posts.length)
  return (
    <div className="page">
      <Header />
      <main id="main">
        <section className="hero wrap acc" style={{ '--accent': f.accent }}>
          <div className="hero__grid">
            <div>
              <a className="pill" href={`/${f.slug}/`}><span className="pill__dot" /> {f.fullName} · {f.status}</a>
              <h1 className="hero__title">Humans and AIs,<br /><span className="grad">one workspace.</span></h1>
              <p className="hero__sub">{f.homeSub}</p>
              <div className="hero__cta">
                <a className="btn btn--primary" href={`/${f.slug}/`}>Explore Fantastic</a>
                <a className="btn btn--ghost" href={f.repo} target="_blank" rel="noreferrer"><GitHubIcon /> Source on GitHub</a>
              </div>
              <div className="cmd"><b>$</b><code>cargo install fantastic --locked</code></div>
            </div>
            <FantasticStage f={f} />
          </div>
        </section>

        <section className="band wrap" id="apps-intro" aria-labelledby="apps-intro-title">
          <div className="sec-head">
            <p className="kicker">Independent apps for iPhone, iPad, Mac and Apple Watch</p>
            <h2 className="h2" id="apps-intro-title">Apps that keep to themselves.</h2>
            <p className="lead">AISixteen builds small, fast, carefully made apps that run on your device. No accounts, no tracking, and nothing about you sent to a server.</p>
            <dl className="stats">
              <div><dt>apps on the App Store</dt><dd>{apps.length}</dd></div>
              <div><dt>accounts needed</dt><dd>0</dd></div>
              <div><dt>personal data collected</dt><dd>0</dd></div>
            </dl>
          </div>
          <a className="featured acc" href={`/${featured.slug}/`} style={{ '--accent': featured.accent }}>
            <div className="featured__body">
              <p className="kicker">Featured</p>
              <div className="featured__head">
                <img className="featured__icon" src={asset(featured.iconSm)} alt="" width="64" height="64" />
                <div>
                  <h3 className="featured__name">{featured.name}</h3>
                  <span className="featured__cat">{featured.category}</span>
                </div>
              </div>
              <p className="featured__desc">{featured.tagline} {featured.short}</p>
              <span className="featured__go">View {featured.name} <span className="card__arrow">&rarr;</span></span>
            </div>
            <div className="featured__media">
              <img src={asset(featured.shotSm)} alt={`${featured.name} screenshot`} width="960" height="600" loading="lazy" decoding="async" />
            </div>
          </a>
        </section>

        <section className="band--tight wrap" id="apps" aria-labelledby="apps-title">
          <div className="apps__head">
            <div className="sec-head" style={{ marginBottom: 0 }}>
              <p className="kicker">Catalog</p>
              <h2 className="h2" id="apps-title">All apps</h2>
              <p className="lead">Every one collects nothing{liveApps.length ? `, and all but ${liveApps.join(' and ')} run fully offline` : ' and runs offline'}.</p>
            </div>
            <div className="filters" role="group" aria-label="Filter apps by category">
              {FILTERS.map((x) => (
                <button type="button" key={x.key} className={`chip${x.key === 'all' ? ' is-active' : ''}`} data-filter={x.key} aria-pressed={x.key === 'all' ? 'true' : 'false'}>{x.label}</button>
              ))}
            </div>
          </div>
          <div className="grid">
            {apps.map((app) => <AppCard key={app.slug} app={app} />)}
          </div>
        </section>

        {posts.length > 0 && (
          <section className="band wrap" id="guides" aria-labelledby="guides-title">
            <div className="sec-head">
              <p className="kicker">Guides</p>
              <h2 className="h2" id="guides-title">How the numbers work</h2>
              <p className="lead">Plain explanations of the problems these apps solve, with worked examples and the sources behind them.</p>
            </div>
            <ul className="posts">
              {posts.map((p) => <PostCard key={p.url} post={p} showApp />)}
            </ul>
            <div className="guide-index" aria-label="Guides by app">
              {withPosts.map((a) => (
                <a href={`/${a.slug}/blog/`} key={a.slug}><img src={asset(a.iconSm)} alt="" width="24" height="24" loading="lazy" decoding="async" />{a.name} guides</a>
              ))}
            </div>
          </section>
        )}

        <section className="band--tight wrap" id="privacy" aria-labelledby="privacy-title">
          <div className="privacy__box">
            <div className="privacy__icon"><ShieldIcon stroke="currentColor" /></div>
            <div>
              <h2 className="h2" id="privacy-title">Privacy by default</h2>
              <p>Our apps do not collect, store, or transmit any personal data: no identifiers, no usage analytics, no device information. Nothing about you leaves your device. There's no account to create and nothing to opt out of, because there was never anything to collect.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer year={year} />
    </div>
  )
}

/* ---------------- app page ---------------- */
const PLATFORM_LABEL = { mac: 'Mac', ipad: 'iPad', ios: 'iPhone', watch: 'Apple Watch' }

// Every platform's screenshots in one strip: native horizontal scroll with snap, no script.
const Shots = ({ app }) => (
  <div className="shots" tabIndex={0} role="group" aria-label={`${app.name} screenshots`}>
    {app.slides.map((s, i) => (
      <figure key={s.src}>
        <img src={asset(s.src)} alt={`${app.name} on ${PLATFORM_LABEL[s.platform]}, screenshot ${s.n}`} width={s.w} height={s.h} loading="lazy" decoding="async" />
        <figcaption>{PLATFORM_LABEL[s.platform]}</figcaption>
      </figure>
    ))}
  </div>
)

const MadeInFantastic = ({ f }) => (
  <a className="mif" href={`/${f.slug}/`}>
    <img className="mif__icon" src={asset(f.iconSm)} alt="" width="44" height="44" loading="lazy" decoding="async" />
    <span className="mif__text">
      <span className="mif__label">Made in {f.name}</span>
      <span className="mif__sub">Built by humans and AIs in one workspace, our open-source kernel of agents.</span>
    </span>
    <span className="mif__cta">Explore <span className="card__arrow">&rarr;</span></span>
  </a>
)

const AppCta = ({ app, heading: H = 'h2' }) => (
  <aside className="app-cta acc" style={{ '--accent': app.accent }} aria-label={`About ${app.name}`}>
    <img className="app-cta__icon" src={asset(app.iconSm)} alt="" width="72" height="72" loading="lazy" decoding="async" />
    <div>
      <H className="app-cta__name">{app.name}</H>
      <p className="app-cta__text">{app.tagline} {claimOf(app)}</p>
    </div>
    <div className="app-cta__actions">
      <AppStoreButton app={app} />
      <a className="tlink" href={`/${app.slug}/`}>What {app.name} does</a>
    </div>
  </aside>
)

export const Landing = ({ app, more, fantastic, year }) => (
  <div className="page acc" style={{ '--accent': app.accent }}>
    <Header />
    <main id="main">
      <Crumbs items={[{ name: 'Home', href: '/' }, { name: 'Apps', href: '/#apps' }, { name: app.name }]} />
      <section className="app-hero wrap">
        <div className="split">
          <div>
            <span className="app-hero__cat">{app.category}</span>
            <div className="app-hero__head">
              <img className="app-hero__icon" src={asset(app.iconSm)} alt={`${app.name} app icon`} width="84" height="84" />
              <h1 className="app-hero__title">{app.name}</h1>
            </div>
            <p className="app-hero__tagline">{app.tagline}</p>
            <p className="app-hero__blurb">{app.blurb}</p>
            <div className="app-hero__actions">
              <AppStoreButton app={app} />
              <span className="meta-note">On the App Store{app.storeName ? ` as ${app.storeName}` : ''} · {platformsOf(app)}</span>
            </div>
            <ul className="trust-row">
              {trustPointsOf(app).map((t, i) => <li className="trust" key={i}><CheckCircleIcon /> {t}</li>)}
            </ul>
          </div>
          <div className="app-hero__shot">
            <img src={asset(app.shotSm)} alt={`${app.name}: ${app.tagline}`} width="960" height="600" fetchpriority="high" decoding="async" />
          </div>
        </div>
      </section>

      {app.slides.length > 0 && (
        <section className="band--tight wrap" aria-labelledby="shots-title">
          <div className="sec-head"><h2 className="h2" id="shots-title">{app.name} on {platformsOf(app).replace('&', 'and')}</h2></div>
          <Shots app={app} />
        </section>
      )}

      <section className="band--tight wrap" aria-labelledby="inside-title">
        <div className="sec-head"><h2 className="h2" id="inside-title">What's inside</h2></div>
        <ul className="features">
          {app.features.map((feat, i) => (
            <li className="feature" key={i}><span className="feature__icon"><CheckIcon /></span>{feat}</li>
          ))}
        </ul>
        <p className="note" style={{ marginTop: 16 }}><ShieldIcon size={24} stroke="currentColor" /><span>{privacyLineOf(app)}</span></p>
      </section>

      {app.posts.length > 0 && (
        <section className="band--tight wrap" id="guides" aria-labelledby="guides-title">
          <div className="sec-head">
            <p className="kicker">Guides</p>
            <h2 className="h2" id="guides-title">Guides from the {app.name} blog</h2>
          </div>
          <ul className="posts">
            {app.posts.slice(0, 3).map((p) => <PostCard key={p.url} post={p} />)}
          </ul>
          <p style={{ marginTop: 18 }}><a className="tlink" href={`/${app.slug}/blog/`}>All {app.name} guides</a></p>
        </section>
      )}

      <section className="band--tight wrap" aria-labelledby="faq-title">
        <div className="sec-head"><h2 className="h2" id="faq-title">Questions about {app.name}</h2></div>
        <div className="faq__list">
          {faqsOf(app).map((f, i) => (
            <details className="faq__item" key={i} open={i < (app.qa.length || 1)}>
              <summary>{f.q}<span className="faq__plus" aria-hidden="true">+</span></summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {fantastic && app.madeInFantastic !== false && (
        <section className="band--tight wrap" aria-label="Made in Fantastic"><MadeInFantastic f={fantastic} /></section>
      )}

      <section className="band--tight wrap" aria-labelledby="more-title">
        <div className="sec-head"><h2 className="h2" id="more-title">More from AISixteen</h2></div>
        <div className="more-grid">
          {more.map((m) => (
            <a className="mini-card acc" href={`/${m.slug}/`} key={m.slug} style={{ '--accent': m.accent }}>
              <img className="mini-card__icon" src={asset(m.iconSm)} alt="" width="46" height="46" loading="lazy" decoding="async" />
              <div style={{ minWidth: 0 }}>
                <div className="mini-card__name">{m.name}</div>
                <div className="mini-card__cat">{m.category}</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="band--tight wrap" aria-labelledby="get-title">
        <div className="final-cta">
          <h2 className="h2" id="get-title">Get {app.name}</h2>
          <p>{app.tagline} {claimOf(app)}</p>
          <AppStoreButton app={app} />
        </div>
      </section>
      <div className="stickpad" />
    </main>

    <div className="sticky-cta">
      <div className="sticky-cta__app">
        <img src={asset(app.iconSm)} alt="" width="38" height="38" loading="lazy" decoding="async" />
        <span className="sticky-cta__name">{app.name}</span>
      </div>
      <a className="sticky-cta__btn" href={appStoreUrl(app)} target="_blank" rel="noreferrer" aria-label={`${app.name} on the App Store`}>
        <AppleIcon size={16} /> App Store
      </a>
    </div>
    <Footer year={year} />
  </div>
)

/* ---------------- blog ---------------- */
export const BlogIndex = ({ app, year }) => (
  <div className="page acc" style={{ '--accent': app.accent }}>
    <Header />
    <main id="main">
      <Crumbs items={[{ name: 'Home', href: '/' }, { name: app.name, href: `/${app.slug}/` }, { name: 'Guides' }]} />
      <div className="wrap">
        <header className="blog-head">
          <a className="byapp" href={`/${app.slug}/`}><img src={asset(app.iconSm)} alt="" width="28" height="28" />{app.name}</a>
          <h1 className="blog-head__title">{app.name} guides</h1>
          <p className="lead">{app.blogIntro || `Articles about the problems ${app.name} solves, with worked examples and sources.`}</p>
        </header>
        <ul className="posts posts--rows" style={{ maxWidth: 860 }}>
          {app.posts.map((p) => <PostCard key={p.url} post={p} level={2} />)}
        </ul>
        <div style={{ maxWidth: 860 }}><AppCta app={app} /></div>
      </div>
    </main>
    <Footer year={year} />
  </div>
)

export const Article = ({ app, post, related, year }) => (
  <div className="page acc" style={{ '--accent': app.accent }}>
    <Header />
    <main id="main">
      <Crumbs items={[{ name: 'Home', href: '/' }, { name: app.name, href: `/${app.slug}/` }, { name: 'Guides', href: `/${app.slug}/blog/` }, { name: post.title }]} />
      <div className="wrap">
        <article className="article">
          <header className="article__head">
            <a className="byapp" href={`/${app.slug}/`}><img src={asset(app.iconSm)} alt="" width="28" height="28" />{app.name}</a>
            <h1 className="article__title">{post.title}</h1>
            <p className="article__meta">
              <span>By AISixteen</span>
              <span>Published <time dateTime={post.date}>{fmtDate(post.date)}</time></span>
              {post.updated !== post.date && <span>Updated <time dateTime={post.updated}>{fmtDate(post.updated)}</time></span>}
              <span>{minutes(post.minutes)}</span>
            </p>
            <p className="answer"><b>Short answer</b>{post.answer}</p>
          </header>
          {post.toc.length > 2 && (
            <nav className="toc" aria-labelledby="toc-title">
              <h2 id="toc-title">In this guide</h2>
              <ol>{post.toc.map((t) => <li key={t.id}><a href={`#${t.id}`}>{t.text}</a></li>)}</ol>
            </nav>
          )}
          <div className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />
          <AppCta app={app} />
          {related.length > 0 && (
            <section className="related" aria-labelledby="related-title">
              <h2 className="h2" id="related-title">More {app.name} guides</h2>
              <ul className="posts posts--rows">
                {related.map((p) => <PostCard key={p.url} post={p} />)}
              </ul>
            </section>
          )}
        </article>
      </div>
    </main>
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


/* ---------------- fantastic: landing (/fantastic/) ---------------- */
// Status pill: colour AND glyph shape differ per status, so it never relies on colour alone.
const Chip = ({ f, s }) => <span className={`fx-chip fx-chip--${s}`}>{f.statuses[s].label}</span>

// Section header used across the landing: mono eyebrow, big title, optional lead.
const Head = ({ eyebrow, title, lead, center = false, id }) => (
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
const GitHubCta = ({ f, label = 'Star on GitHub', primary = false }) => (
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
    <Head eyebrow="What you can build" id="build-title" title={<>Whatever you imagine.<br /><span className="grad">Built with an AI.</span></>} />
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
    <main id="main">
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
          <a className="fx-link" href={f.roadmap} target="_blank" rel="noreferrer">roadmap</a>
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
    <main id="main">
      <section className="notfound">
        <h1 className="grad">404</h1>
        <p>That page is not here. The apps and the guides are.</p>
        <a className="btn btn--primary" href="/">Back to all apps</a>
      </section>
    </main>
    <Footer year={year} />
  </div>
)
