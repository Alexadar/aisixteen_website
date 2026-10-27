import React from 'react'
import { Header, Footer } from './components.jsx'

// /fantastic/foundations/: a blog-style shell. A sticky menu of articles on the left (a row of
// links at the top on phones), the article on the right, previous/next links at the end.
// Everything is static HTML; the Manim clips are an addition, and every clip's meaning is in
// its caption and in the text around it.

const BASE = '/fantastic/foundations/'
export const articleUrl = (a) => `${BASE}${a.slug}/`
export const videoFiles = (a, slug) => {
  const name = slug.split('_').slice(1).join('_')
  return { mp4: `${articleUrl(a)}${name}.mp4`, webm: `${articleUrl(a)}${name}.webm`, poster: `${articleUrl(a)}${name}.webp` }
}

// Inline markup: `code`, **bold**, [text](url).
const TOKEN = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g
export const Rich = ({ children }) => String(children).split(TOKEN).filter(Boolean).map((part, i) => {
  if (part.startsWith('`')) return <code key={i}>{part.slice(1, -1)}</code>
  if (part.startsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>
  const m = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part)
  if (m) return <a key={i} className="fx-link" href={m[2]}>{m[1]}</a>
  return part
})

export const plainText = (s) => String(s).replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')

// Words in an article, for the reading-time line.
export function wordCount(a) {
  const strs = [...a.lead]
  for (const s of a.sections) for (const b of s.blocks) {
    if (typeof b === 'string') strs.push(b)
    else if (b.list || b.ol) strs.push(...(b.list || b.ol))
    else if (b.quote) strs.push(b.quote)
    else if (b.table) strs.push(...b.table.rows.flat())
  }
  return strs.join(' ').split(/\s+/).length
}

const Video = ({ a, slug, n, meta, v }) => {
  const f = videoFiles(a, slug)
  const id = `anim-${slug.replace('_', '-')}`
  return (
    <figure className="fd-figure" id={id}>
      <div className="fd-player">
        <video className="fd-video" id={`${id}-video`} width={meta.width} height={meta.height} poster={f.poster}
          muted loop playsInline controls preload="metadata" data-fd-video=""
          aria-label={`Animation: ${v.title}`} aria-describedby={`${id}-cap`}>
          <source src={f.webm} type='video/webm; codecs="vp9"' />
          <source src={f.mp4} type="video/mp4" />
        </video>
      </div>
      <figcaption className="fd-caption">
        <span className="fd-caption__bar">
          {/* shown by site.js; without JS the video keeps its native controls */}
          <button type="button" className="fd-toggle" data-fd-toggle={id} aria-label={`Play the animation: ${v.title}`}>
            <svg className="fd-i-play" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" /></svg>
            <svg className="fd-i-pause" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /></svg>
          </button>
          <span className="fd-caption__n">Animation {n} · {Math.round(meta.duration)} s</span>
        </span>
        <span id={`${id}-cap`}><strong>{v.title}.</strong> {v.caption}</span>
      </figcaption>
    </figure>
  )
}

const Block = ({ b, a, ctx }) => {
  if (typeof b === 'string') return <p><Rich>{b}</Rich></p>
  if (b.h3) return <h3 className="fd-h3"><Rich>{b.h3}</Rich></h3>
  if (b.code) return (
    <figure className="fd-code">
      {b.label && <figcaption className="fd-code__label">{b.label}</figcaption>}
      <pre className="fx-code"><code>{b.code}</code></pre>
    </figure>
  )
  if (b.list) return <ul className="fd-list">{b.list.map((x, i) => <li key={i}><Rich>{x}</Rich></li>)}</ul>
  if (b.ol) return <ol className="fd-list fd-list--ol">{b.ol.map((x, i) => <li key={i}><Rich>{x}</Rich></li>)}</ol>
  if (b.quote) return (
    <blockquote className="fd-quote">
      <p><Rich>{b.quote}</Rich></p>
      {b.cite && <cite>{b.cite}</cite>}
    </blockquote>
  )
  if (b.note) return <p className="fd-note"><Rich>{b.note}</Rich></p>
  if (b.table) return (
    <div className="fd-table" role="region" aria-label="Table" tabIndex={0}>
      <table>
        <thead><tr>{b.table.head.map((h, i) => <th key={i} scope="col"><Rich>{h}</Rich></th>)}</tr></thead>
        <tbody>{b.table.rows.map((r, i) => <tr key={i}>{r.map((c, j) => (j === 0 ? <th key={j} scope="row"><Rich>{c}</Rich></th> : <td key={j}><Rich>{c}</Rich></td>))}</tr>)}</tbody>
      </table>
    </div>
  )
  if (b.video) {
    ctx.n += 1
    return <Video a={a} slug={b.video} n={ctx.n} meta={ctx.meta[b.video]} v={ctx.videos[b.video]} />
  }
  return null
}

const Menu = ({ f, current }) => (
  <nav className="fd-menu" aria-label="Foundations articles">
    <a className={`fd-menu__home${current ? '' : ' is-current'}`} href={BASE} aria-current={current ? undefined : 'page'}>
      <span className="fd-menu__eyebrow">Fantastic</span> Foundations
    </a>
    <ol className="fd-menu__list">
      {f.articles.map((a) => {
        const on = current && current.slug === a.slug
        return (
          <li key={a.slug} className={on ? 'is-current' : undefined}>
            <a className="fd-menu__link" href={articleUrl(a)} aria-current={on ? 'page' : undefined}>
              <span className="fd-menu__n" aria-hidden="true">{a.n}</span>
              <span className="fd-menu__t fd-menu__t--long">{a.title}</span>
              <span className="fd-menu__t fd-menu__t--short">{a.short}</span>
            </a>
            {on && (
              <ol className="fd-toc" aria-label="On this page">
                {a.sections.map((s) => <li key={s.id}><a href={`#${s.id}`}>{s.title}</a></li>)}
              </ol>
            )}
          </li>
        )
      })}
    </ol>
    <p className="fd-menu__more">More articles to come.</p>
    <a className="fd-menu__back" href="/fantastic/">&larr; Back to Fantastic</a>
  </nav>
)

const Shell = ({ f, current, year, children }) => (
  <div className="page fd-page">
    <Header />
    <div className="fd-layout">
      <Menu f={f} current={current} />
      <main className="fd-main">{children}</main>
    </div>
    <Footer year={year} />
  </div>
)

const Crumbs = ({ items }) => (
  <nav className="fd-crumbs" aria-label="Breadcrumb">
    <ol>
      {items.map(([label, href], i) => (
        <li key={i}>{href ? <a href={href}>{label}</a> : <span aria-current="page">{label}</span>}</li>
      ))}
    </ol>
  </nav>
)

export const FoundationsIndex = ({ f, meta, videos, year }) => (
  <Shell f={f} year={year}>
    <article className="fd-article">
      <Crumbs items={[['Fantastic', '/fantastic/'], ['Foundations']]} />
      <header className="fd-head">
        <p className="fl-eyebrow"><span className="fl-eyebrow__dot" />Aisixteen Fantastic</p>
        <h1 className="fd-title">Foundations</h1>
        <p className="fd-lead">{f.lead}</p>
      </header>
      <ol className="fd-cards">
        {f.articles.map((a) => {
          const v = videoFiles(a, a.cover)
          const clips = a.sections.flatMap((s) => s.blocks).filter((b) => b.video).length
          return (
            <li key={a.slug}>
              <a className="fd-card" href={articleUrl(a)}>
                <img className="fd-card__img" src={v.poster} width="1280" height="720" alt={`A frame of the animation “${videos[a.cover].title}”`} loading={a.n === 1 ? 'eager' : 'lazy'} decoding="async" />
                <span className="fd-card__body">
                  <span className="fd-card__n">Article {a.n} · {clips} animations · {Math.max(1, Math.round(wordCount(a) / 220))} min read</span>
                  <h2 className="fd-card__title">{a.title}</h2>
                  <span className="fd-card__text">{a.summary}</span>
                  <span className="fd-card__more">Read <span className="card__arrow">&rarr;</span></span>
                </span>
              </a>
            </li>
          )
        })}
      </ol>
      <p className="fd-note">Every article follows the source on the main branch of <a className="fx-link" href="https://github.com/aisixteen/fantastic">github.com/aisixteen/fantastic</a> and names the files it draws on. The animations are rendered with Manim from scripts kept next to this site’s source; ids and agent names in them are illustrative.</p>
    </article>
  </Shell>
)

export const FoundationsArticle = ({ f, a, meta, videos, year, modified }) => {
  const i = f.articles.indexOf(a)
  const prev = f.articles[i - 1]
  const next = f.articles[i + 1]
  const ctx = { n: 0, meta, videos }
  const clips = a.sections.flatMap((s) => s.blocks).filter((b) => b.video).length
  return (
    <Shell f={f} current={a} year={year}>
      <article className="fd-article">
        <Crumbs items={[['Fantastic', '/fantastic/'], ['Foundations', BASE], [a.short]]} />
        <header className="fd-head">
          <p className="fl-eyebrow"><span className="fl-eyebrow__dot" />Foundations · {a.n}</p>
          <h1 className="fd-title">{a.title}</h1>
          {a.lead.map((p, k) => <p className="fd-lead" key={k}><Rich>{p}</Rich></p>)}
          <p className="fd-meta">
            Updated <time dateTime={modified}>{modified}</time> · {Math.max(1, Math.round(wordCount(a) / 220))} min read · {clips} animations
          </p>
        </header>
        {a.sections.map((s) => (
          <section className="fd-section" id={s.id} key={s.id} aria-labelledby={`${s.id}-h`}>
            <h2 className="fd-h2" id={`${s.id}-h`}><a href={`#${s.id}`}>{s.title}</a></h2>
            {s.blocks.map((b, k) => <Block b={b} a={a} ctx={ctx} key={k} />)}
          </section>
        ))}
        <section className="fd-section fd-sources" id="sources" aria-labelledby="sources-h">
          <h2 className="fd-h2" id="sources-h"><a href="#sources">Sources</a></h2>
          <p>Read from the main branch of the open-source repo. Quotes are from these files; JSON shapes follow the code, with illustrative ids and values.</p>
          <ul className="fd-list">
            {a.sources.map(([label, href]) => <li key={href}><a className="fx-link" href={href}>{label}</a></li>)}
          </ul>
        </section>
        <nav className="fd-pager" aria-label="Previous and next article">
          {prev ? (
            <a className="fd-pager__link" href={articleUrl(prev)} rel="prev">
              <span className="fd-pager__dir">&larr; Previous</span><span className="fd-pager__t">{prev.n}. {prev.title}</span>
            </a>
          ) : (
            <a className="fd-pager__link" href={BASE}>
              <span className="fd-pager__dir">&larr; All articles</span><span className="fd-pager__t">Foundations</span>
            </a>
          )}
          {next ? (
            <a className="fd-pager__link fd-pager__link--next" href={articleUrl(next)} rel="next">
              <span className="fd-pager__dir">Next &rarr;</span><span className="fd-pager__t">{next.n}. {next.title}</span>
            </a>
          ) : (
            <a className="fd-pager__link fd-pager__link--next" href="/fantastic/">
              <span className="fd-pager__dir">Back to &rarr;</span><span className="fd-pager__t">Fantastic</span>
            </a>
          )}
        </nav>
      </article>
    </Shell>
  )
}
