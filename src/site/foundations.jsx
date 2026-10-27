import React from 'react'
import { Header, Footer } from './components.jsx'

// /fantastic/foundations/: a blog-style shell over the #443 tree (src/data/foundations/registry.json,
// loaded by scripts/foundations-data.mjs). A fixed left menu holds the whole tree as nested
// <details> (the current branch open, the page being read marked; works without JS); at phone
// width the same tree sits in a drop-down menu at the top. The page is on the right, with
// previous/next links in reading order at the end. Everything is static HTML; the Manim clips
// are an addition, and every clip's meaning is in its caption and in the text around it.

export const BASE = '/fantastic/foundations/'

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
const minutes = (a) => Math.max(1, Math.round(wordCount(a) / 220))

const Video = ({ c, n }) => {
  const id = c.htmlId
  return (
    <figure className="fd-figure" id={id}>
      <div className="fd-player">
        <video className="fd-video" id={`${id}-video`} width={c.meta.width} height={c.meta.height} poster={c.files.poster}
          muted loop playsInline controls preload="metadata" data-fd-video=""
          aria-label={`Animation: ${c.title}`} aria-describedby={`${id}-cap`}>
          <source src={c.files.webm} type='video/webm; codecs="vp9"' />
        </video>
      </div>
      <figcaption className="fd-caption">
        <span className="fd-caption__bar">
          {/* shown by site.js; without JS the video keeps its native controls */}
          <button type="button" className="fd-toggle" data-fd-toggle={id} aria-label={`Play the animation: ${c.title}`}>
            <svg className="fd-i-play" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" /></svg>
            <svg className="fd-i-pause" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /></svg>
          </button>
          <span className="fd-caption__n">Animation {n} · {Math.round(c.meta.duration)} s</span>
        </span>
        <span id={`${id}-cap`}><strong>{c.title}.</strong> {c.caption}</span>
      </figcaption>
    </figure>
  )
}

const Block = ({ b, ctx }) => {
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
    return <Video c={b.resolved} n={ctx.n} />
  }
  return null
}

/* ---------------- the menu tree ---------------- */

const Chevron = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5" /></svg>
)

const inBranch = (n, current) => !!current && (current === n || current.ancestors.includes(n))

const TreeNode = ({ n, current, toc }) => {
  const on = current === n
  const planned = n.status === 'planned'
  const cls = ['fd-node', on && 'is-current', planned && 'is-planned', n.children.length && 'has-kids'].filter(Boolean).join(' ')
  return (
    <li className={cls}>
      <a className="fd-node__link" href={n.url} aria-current={on ? 'page' : undefined}>
        {n.depth === 0 && <span className="fd-menu__n" aria-hidden="true">{n.order}</span>}
        <span className="fd-node__t">{n.title}</span>
        {planned && <span className="fd-node__soon">soon</span>}
      </a>
      {on && toc && n.article && n.status === 'published' && (
        <ol className="fd-toc" aria-label="On this page">
          {n.article.sections.map((s) => <li key={s.id}><a href={`#${s.id}`}>{s.title}</a></li>)}
          {n.children.length > 0 && <li><a href="#in-this-part">In this part</a></li>}
        </ol>
      )}
      {n.children.length > 0 && (
        <details className="fd-node__kids" open={inBranch(n, current) || undefined}>
          <summary className="fd-node__toggle" aria-label={`${n.title}: show its articles`}><Chevron /></summary>
          <Tree nodes={n.children} current={current} toc={toc} sub />
        </details>
      )}
    </li>
  )
}

const Tree = ({ nodes, current, toc, sub }) => (
  <ol className={sub ? 'fd-tree fd-tree--sub' : 'fd-tree'}>
    {nodes.map((n) => <TreeNode key={n.key} n={n} current={current} toc={toc} />)}
  </ol>
)

const Home = ({ current }) => (
  <a className={`fd-menu__home${current ? '' : ' is-current'}`} href={BASE} aria-current={current ? undefined : 'page'}>
    <span className="fd-menu__eyebrow">Fantastic</span> Foundations
  </a>
)

// Desktop: the fixed left menu.
const Menu = ({ F, current }) => (
  <nav className="fd-menu" aria-label="Foundations">
    <Home current={current} />
    <Tree nodes={F.roots} current={current} toc />
    <a className="fd-menu__back" href="/fantastic/">&larr; Back to Fantastic</a>
  </nav>
)

// Phone: a menu bar at the top that opens the same tree.
const TopNav = ({ F, current }) => (
  <nav className="fd-topnav" aria-label="Foundations menu">
    <details className="fd-topnav__drop">
      <summary className="fd-topnav__bar">
        <span className="fd-topnav__eyebrow">Foundations</span>
        <span className="fd-topnav__here">{current ? current.short : 'All parts'}</span>
        <span className="fd-topnav__open">Menu <Chevron /></span>
      </summary>
      <div className="fd-topnav__panel">
        <Home current={current} />
        <Tree nodes={F.roots} current={current} />
      </div>
    </details>
  </nav>
)

const Shell = ({ F, current, year, children }) => (
  <div className="page fd-page">
    <Header />
    <TopNav F={F} current={current} />
    <div className="fd-layout">
      <Menu F={F} current={current} />
      <main className="fd-main">{children}</main>
    </div>
    <Footer year={year} />
  </div>
)

export const crumbsOf = (n) => [['Fantastic', '/fantastic/'], ['Foundations', BASE], ...n.ancestors.map((a) => [a.short, a.url]), [n.short]]

const Crumbs = ({ items }) => (
  <nav className="fd-crumbs" aria-label="Breadcrumb">
    <ol>
      {items.map(([label, href], i) => (
        <li key={i}>{href ? <a href={href}>{label}</a> : <span aria-current="page">{label}</span>}</li>
      ))}
    </ol>
  </nav>
)

const eyebrowOf = (n) => ['Foundations', ...n.ancestors.map((a) => a.short)].join(' · ')

const Pager = ({ n }) => {
  const { prev, next } = n
  return (
    <nav className="fd-pager" aria-label="Previous and next page">
      {prev ? (
        <a className="fd-pager__link" href={prev.url} rel="prev">
          <span className="fd-pager__dir">&larr; Previous</span><span className="fd-pager__t">{prev.title}</span>
        </a>
      ) : <span />}
      {next ? (
        <a className="fd-pager__link fd-pager__link--next" href={next.url} rel="next">
          <span className="fd-pager__dir">Next &rarr;</span><span className="fd-pager__t">{next.title}</span>
        </a>
      ) : (
        <a className="fd-pager__link fd-pager__link--next" href="/fantastic/">
          <span className="fd-pager__dir">Back to &rarr;</span><span className="fd-pager__t">Fantastic</span>
        </a>
      )}
    </nav>
  )
}

// The children of a pillar or section: published ones linked with their summary, planned ones
// listed as coming.
const Children = ({ n }) => (
  <ul className="fd-kids">
    {n.children.map((c) => (
      <li key={c.key} className={c.status === 'planned' ? 'is-planned' : undefined}>
        <a className="fd-kids__link" href={c.url}>
          <span className="fd-kids__t">{c.title}</span>
          {c.status === 'published'
            ? <span className="fd-kids__text">{c.article.summary}</span>
            : <span className="fd-kids__soon">Coming soon</span>}
        </a>
      </li>
    ))}
  </ul>
)

export const FoundationsIndex = ({ F, year }) => (
  <Shell F={F} year={year}>
    <article className="fd-article">
      <Crumbs items={[['Fantastic', '/fantastic/'], ['Foundations']]} />
      <header className="fd-head">
        <p className="fl-eyebrow"><span className="fl-eyebrow__dot" />Aisixteen Fantastic</p>
        <h1 className="fd-title">{F.hub.title}</h1>
        <p className="fd-lead">{F.hub.lead}</p>
      </header>
      <ol className="fd-cards">
        {F.roots.map((p, i) => {
          const done = p.children.filter((c) => c.status === 'published').length
          return (
            <li key={p.key} className="fd-card">
              <a className="fd-card__media" href={p.url} tabIndex={-1} aria-hidden="true">
                <img className="fd-card__img" src={p.cover.files.poster} width="1280" height="720" alt="" loading={i === 0 ? 'eager' : 'lazy'} decoding="async" />
              </a>
              <div className="fd-card__body">
                <span className="fd-card__n">Part {p.order} · {p.children.length} articles{done ? ` · ${done} published` : ''}</span>
                <h2 className="fd-card__title"><a href={p.url}>{p.title}</a></h2>
                <p className="fd-card__text">{p.article.summary}</p>
                <a className="fd-card__more" href={p.url} aria-label={`Read: ${p.title}`}>Read <span className="card__arrow">&rarr;</span></a>
              </div>
            </li>
          )
        })}
      </ol>
      <p className="fd-note">Every page follows the source on the main branch of <a className="fx-link" href="https://github.com/aisixteen/fantastic">github.com/aisixteen/fantastic</a> and names the files it draws on. The animations are rendered with Manim from scripts kept next to this site’s source; ids and agent names in them are illustrative.</p>
      <Pager n={F.hub} />
    </article>
  </Shell>
)

export const FoundationsPage = ({ F, n, year, modified }) => {
  const a = n.article
  const ctx = { n: 0 }
  return (
    <Shell F={F} current={n} year={year}>
      <article className="fd-article">
        <Crumbs items={crumbsOf(n)} />
        <header className="fd-head">
          <p className="fl-eyebrow"><span className="fl-eyebrow__dot" />{eyebrowOf(n)}</p>
          <h1 className="fd-title">{n.title}</h1>
          {a.lead.map((p, k) => <p className="fd-lead" key={k}><Rich>{p}</Rich></p>)}
          <p className="fd-meta">
            Updated <time dateTime={modified}>{modified}</time> · {minutes(a)} min read · {n.clips.length} {n.clips.length === 1 ? 'animation' : 'animations'}
          </p>
        </header>
        {a.sections.map((s) => (
          <section className="fd-section" id={s.id} key={s.id} aria-labelledby={`${s.id}-h`}>
            <h2 className="fd-h2" id={`${s.id}-h`}><a href={`#${s.id}`}>{s.title}</a></h2>
            {s.blocks.map((b, k) => <Block b={b} ctx={ctx} key={k} />)}
          </section>
        ))}
        {n.children.length > 0 && (
          <section className="fd-section" id="in-this-part" aria-labelledby="in-this-part-h">
            <h2 className="fd-h2" id="in-this-part-h"><a href="#in-this-part">In this part</a></h2>
            <Children n={n} />
          </section>
        )}
        <section className="fd-section fd-sources" id="sources" aria-labelledby="sources-h">
          <h2 className="fd-h2" id="sources-h"><a href="#sources">Sources</a></h2>
          <p>Read from the main branch of the open-source repo. Quotes are from these files; JSON shapes follow the code, with illustrative ids and values.</p>
          <ul className="fd-list">
            {a.sources.map(([label, href]) => <li key={href + label}><a className="fx-link" href={href}>{label}</a></li>)}
          </ul>
        </section>
        <Pager n={n} />
      </article>
    </Shell>
  )
}

// A planned node: a noindex placeholder so every menu link works.
export const FoundationsComing = ({ F, n, year }) => {
  const up = n.ancestors[n.ancestors.length - 1]
  return (
    <Shell F={F} current={n} year={year}>
      <article className="fd-article">
        <Crumbs items={crumbsOf(n)} />
        <header className="fd-head">
          <p className="fl-eyebrow"><span className="fl-eyebrow__dot" />{eyebrowOf(n)}</p>
          <h1 className="fd-title">{n.title}</h1>
          <p className="fd-lead">This page is planned and not written yet.</p>
        </header>
        {n.children.length > 0 && (
          <section className="fd-section" id="in-this-part" aria-labelledby="in-this-part-h">
            <h2 className="fd-h2" id="in-this-part-h">In this part</h2>
            <Children n={n} />
          </section>
        )}
        <nav className="fd-pager" aria-label="Where to go instead">
          <a className="fd-pager__link" href={up ? up.url : BASE}>
            <span className="fd-pager__dir">&larr; Up</span><span className="fd-pager__t">{up ? up.title : 'Foundations'}</span>
          </a>
          <a className="fd-pager__link fd-pager__link--next" href={BASE}>
            <span className="fd-pager__dir">All parts &rarr;</span><span className="fd-pager__t">Foundations</span>
          </a>
        </nav>
      </article>
    </Shell>
  )
}
