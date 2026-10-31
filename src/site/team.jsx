import React from 'react'
import { Header, Footer, Head, Md, CopyLine, GitHubCta } from './components.jsx'
import { Rich } from './foundations.jsx'

// /team/: the product page for AISixteen Fantastic Team. Same shell and section styles as
// the /fantastic/ page (fl-*); the few team-only pieces use tm-*. Static HTML, no video.

const Modes = ({ t }) => (
  <section className="fl-section" id="modes" aria-labelledby="modes-title">
    <Head eyebrow="Run it" id="modes-title" title={t.modes.title} lead={t.modes.lead} />
    <div className="tm-grid tm-grid--2">
      {t.modes.cards.map((c) => (
        <article className="tm-card" key={c.key} data-reveal="">
          <p className="tm-card__tag">{c.tag}</p>
          <h3 className="tm-card__title">{c.name}</h3>
          <p className="tm-card__text"><Md>{c.text}</Md></p>
          <ul className="tm-list">{c.points.map((p) => <li key={p}><Md>{p}</Md></li>)}</ul>
        </article>
      ))}
    </div>
  </section>
)

const How = ({ t }) => (
  <section className="fl-section" id="how" aria-labelledby="how-title">
    <Head eyebrow="Inside" id="how-title" title={t.how.title} lead={t.how.lead} />
    <ol className="tm-flow" aria-label="Path of a task">
      {t.how.flow.map((x) => <li key={x}>{x}</li>)}
    </ol>
    <p className="tm-flow__note">{t.how.flowNote}</p>
    <div className="tm-grid tm-grid--2">
      {t.how.parts.map((p, i) => (
        <article className="tm-card" key={p.key} data-reveal="">
          <span className="tm-card__n" aria-hidden="true">{i + 1}</span>
          <h3 className="tm-card__title">{p.title}</h3>
          <p className="tm-card__text"><Md>{p.text}</Md></p>
        </article>
      ))}
    </div>
  </section>
)

const UI = ({ t }) => (
  <section className="fl-section" id="ui" aria-labelledby="ui-title">
    <Head eyebrow="The interface" id="ui-title" title={t.ui.title} lead={t.ui.lead} />
    <div className="tm-ui">
      <dl className="tm-ui__points" data-reveal="">
        {t.ui.points.map((p) => (
          <div className="tm-ui__point" key={p.term}><dt>{p.term}</dt><dd><Md>{p.text}</Md></dd></div>
        ))}
      </dl>
      <figure className="tm-shot" data-reveal="">
        <div className="tm-shot__box" role="img" aria-label={`${t.ui.placeholder}: ${t.ui.placeholderNote}`}>
          <span className="tm-shot__badge">Placeholder</span>
          <strong>{t.ui.placeholder}</strong>
          <span>{t.ui.placeholderNote}</span>
        </div>
        <figcaption className="tm-shot__cap">{t.ui.appNote}</figcaption>
      </figure>
    </div>
  </section>
)

const Diff = ({ t }) => (
  <section className="fl-section" id="differs" aria-labelledby="differs-title">
    <Head eyebrow="Compared" id="differs-title" title={t.diff.title} />
    <div className="tm-grid tm-grid--3">
      {t.diff.items.map((d) => (
        <article className="tm-card" key={d.title} data-reveal="">
          <h3 className="tm-card__title">{d.title}</h3>
          <p className="tm-card__text"><Md>{d.text}</Md></p>
        </article>
      ))}
    </div>
  </section>
)

const Start = ({ t }) => (
  <section className="fl-section" id="start" aria-labelledby="start-title">
    <Head eyebrow="Start" id="start-title" title={t.start.title} lead={t.start.lead} />
    <ol className="tm-steps">
      {t.start.steps.map((s) => (
        <li className="tm-step" key={s.n} data-reveal="">
          <span className="tm-card__n" aria-hidden="true">{s.n}</span>
          <div className="tm-step__body">
            <h3 className="tm-card__title">{s.title}</h3>
            <pre className="fx-code fx-code--block">{s.code}</pre>
            <p className="tm-card__text"><Md>{s.note}</Md></p>
          </div>
        </li>
      ))}
    </ol>
    <div className="fl-cta-row">
      <GitHubCta f={t} primary label="Fantastic Team on GitHub" />
      {t.links.slice(1).map((l) => <a className="btn btn--ghost" href={l.href} target="_blank" rel="noreferrer" key={l.href}>{l.label}</a>)}
    </div>
  </section>
)

export const TeamPage = ({ t, year }) => (
  <div className="page fl-page" style={{ '--accent': t.accent }}>
    <Header />
    <main>
      <section className="fl-hero">
        <div className="fl-hero__bg" aria-hidden="true"><span /><span /><span /></div>
        <a className="fl-pill fl-in" href="#start" style={{ '--d': '0s' }}>
          <span className="fl-pill__tag">Alpha</span> Build from source, no releases yet <span className="card__arrow">&rarr;</span>
        </a>
        <h1 className="fl-hero__title fl-in" style={{ '--d': '.08s' }}>Queue the work.<br /><span className="grad">Review the results.</span></h1>
        <p className="fl-hero__sub fl-in" style={{ '--d': '.16s' }}>{t.heroSub}</p>
        <div className="fl-hero__cta fl-in" style={{ '--d': '.24s' }}>
          <CopyLine code="git clone https://github.com/aisixteen/fantastic_team" />
          <GitHubCta f={t} />
        </div>
        <p className="fl-hero__meta fl-in" style={{ '--d': '.3s' }}>
          {t.fullName} · {t.status} · {t.license} ·{' '}
          <a className="fx-link" href={t.roadmap} target="_blank" rel="noreferrer">roadmap</a> ·{' '}
          <a className="fx-link" href="/fantastic/">built on Fantastic</a>
        </p>
      </section>

      <section className="fl-section" id="what" aria-labelledby="what-title">
        <Head eyebrow="What it is" id="what-title" title={t.what.title} lead={t.what.lead} />
        <div className="tm-what" data-reveal="">
          <p className="tm-card__text">{t.what.text}</p>
          <ul className="fl-principles" aria-label="Kinds of work">{t.what.kinds.map((k) => <li key={k}>{k}</li>)}</ul>
          <p className="tm-card__text">{t.what.note}</p>
        </div>
      </section>

      <Modes t={t} />
      <How t={t} />
      <UI t={t} />
      <Diff t={t} />
      <Start t={t} />

      <section className="fl-final tm-final">
        <div className="fl-final__glow" aria-hidden="true" />
        <h2 className="fl-final__title">Come back to <span className="grad">done work.</span></h2>
        <p className="fl-lead">{t.statusNote}</p>
        <p className="fl-lead tm-related"><Rich>{t.related}</Rich></p>
        <div className="fl-cta-row fl-cta-row--center">
          <GitHubCta f={t} primary label="Star on GitHub" />
          <a className="btn btn--ghost" href={t.roadmap} target="_blank" rel="noreferrer">Roadmap</a>
          <a className="btn btn--ghost" href={t.board} target="_blank" rel="noreferrer">Project board</a>
        </div>
      </section>
    </main>
    <Footer year={year} />
  </div>
)
