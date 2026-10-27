// AI-crawler files, generated from the same data as the pages so they never drift:
//   robots.txt     — every crawler allowed, the major AI agents named explicitly
//   llms-full.txt  — the whole site as plain Markdown, for LLMs and answer engines
// The short index, /llms.txt, is hand-written in src/site/llms.txt.
import { appStoreUrl, faqsOf, claimOf, platformsOf } from '../src/site/theme.js'

const ORIGIN = 'https://aisixteen.com'

// Search, answer and training crawlers. All are welcome: the site is public marketing for
// free and open-source software, and being cited by AI answers is the point.
const AI_AGENTS = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',
  'ClaudeBot', 'Claude-SearchBot', 'Claude-User',
  'PerplexityBot', 'Perplexity-User',
  'Google-Extended', 'Applebot-Extended', 'Bingbot',
  'Meta-ExternalAgent', 'Amazonbot', 'DuckAssistBot', 'MistralAI-User', 'CCBot',
]

export function robotsTxt() {
  return `# aisixteen.com — all crawlers welcome, including AI search, answer and training bots.
# A plain-text summary for LLMs: ${ORIGIN}/llms.txt (full text: ${ORIGIN}/llms-full.txt)

User-agent: *
Allow: /

${AI_AGENTS.map((a) => `User-agent: ${a}`).join('\n')}
Allow: /

Sitemap: ${ORIGIN}/sitemap.xml
`
}

const md = (s) => String(s).replace(/\n+/g, ' ').trim()

// A published Foundations page as Markdown: the same blocks the page renders, each animation
// given as its title, caption and file, then its published children. Planned pages are left out.
function articleMd(n) {
  const a = n.article
  const url = `${ORIGIN}${n.url}`
  const block = (b) => {
    if (typeof b === 'string') return b
    if (b.h3) return `#### ${b.h3}`
    if (b.code) return `${b.label ? `${b.label}:\n\n` : ''}\`\`\`\n${b.code}\n\`\`\``
    if (b.list) return b.list.map((x) => `- ${x}`).join('\n')
    if (b.ol) return b.ol.map((x, i) => `${i + 1}. ${x}`).join('\n')
    if (b.quote) return `> ${b.quote}${b.cite ? ` (${b.cite})` : ''}`
    if (b.note) return b.note
    if (b.table) return [`| ${b.table.head.join(' | ')} |`, `|${b.table.head.map(() => '---').join('|')}|`, ...b.table.rows.map((r) => `| ${r.join(' | ')} |`)].join('\n')
    if (b.video) {
      const c = b.resolved
      return `*Animation: ${c.title}* (${ORIGIN}${c.files.mp4}). ${c.caption}`
    }
    return ''
  }
  const path = ['Foundations', ...n.ancestors.map((x) => x.title), n.title].join(' › ')
  const kids = n.children.filter((c) => c.status === 'published')
  return `### ${path}

URL: ${url}

${a.lead.join('\n\n')}

${a.sections.map((sec) => `#### ${sec.title}\n\n${sec.blocks.map(block).join('\n\n')}`).join('\n\n')}
${kids.length ? `\nIn this part: ${kids.map((c) => `${c.title} (${ORIGIN}${c.url})`).join('; ')}\n` : ''}
Sources: ${a.sources.map(([label, href]) => `${label} (${href})`).join('; ')}
`
}

export function llmsFullTxt({ apps, fantastic: f, foundations }) {
  const out = []
  out.push(`# AISixteen — full site text

> AISixteen is an independent developer. Its main product is Aisixteen Fantastic, an open-source kernel of agents built from scratch at every layer; it also makes small, private apps for iPhone, iPad, Mac and Apple Watch with no accounts and no tracking.

Short index: ${ORIGIN}/llms.txt · Sitemap: ${ORIGIN}/sitemap.xml · Contact: info@aisixteen.com
`)

  // Fantastic
  out.push(`## ${f.fullName}

URL: ${ORIGIN}/${f.slug}/
Source: ${f.repo} · crates.io: ${f.crate} · Roadmap: ${f.roadmap}
Status: ${f.status}. License: ${f.license}.

${f.tagline}

${f.blurb}

${f.oneCallNote}

### Built from scratch at every layer

${f.stackLead}

${f.stackLayers.map((l) => `- **${l.name}** (${l.status.map((s) => f.statuses[s].label).join(' / ')}): ${l.text}`).join('\n')}

### Concepts

${f.concepts.map((c) => `- **${c.term}**: ${c.text}`).join('\n')}

### What's in the box

${f.inTheBox.map((b) => `- **${b.title}**: ${b.text}`).join('\n')}

### Runtimes

${f.runtimes.map((r) => `- **${r.name}**: ${r.role}`).join('\n')}

### Roadmap (from the fantastic app to fantastic OS)

Not shipped unless marked done. Full board: ${f.roadmap}

${f.milestones.map((m) => `- **${m.id} — ${m.name}** (${f.statuses[m.status].label}; ${m.done} of ${m.total} done): ${m.text}`).join('\n')}

### Compared with other agent harnesses

${f.compareGroups.map((g) => `#### ${g.group}\n\n${g.rows.map((r) => `- **${r.area}** — typical: ${r.typical}. Fantastic: ${r.text}.${r.gap ? ` ${r.gap}.` : ''}`).join('\n')}`).join('\n\n')}

### Security

${f.security}

### Install

${f.install.map((i) => `**${i.label}.** ${i.note || ''}\n\n\`\`\`sh\n${i.code}\n\`\`\``).join('\n\n')}

Or ask a coding agent (Claude Code, Codex, Gemini CLI): "${f.agentPrompt}"

Commands:

${f.commands.map(([c, w]) => `- \`${c}\` — ${w}`).join('\n')}
`)

  // Foundations
  if (foundations) {
    out.push(`## ${foundations.hub.headline}

URL: ${ORIGIN}/fantastic/foundations/

${foundations.hub.lead}
`)
    for (const n of foundations.published) out.push(articleMd(n))
  }

  // Apps
  out.push(`## Apps

Every app: no account, no subscription, no personal data collected. Downloaded from the Apple App Store.
`)
  for (const a of apps) {
    out.push(`### ${a.name}

URL: ${ORIGIN}/${a.slug}/ · App Store: ${appStoreUrl(a)}
Category: ${a.category} · Platforms: ${platformsOf(a)}

${md(a.tagline)} ${md(a.short)}

${md(a.blurb)}

${(a.features || []).map((x) => `- ${md(x)}`).join('\n')}

Privacy: ${claimOf(a)}

${faqsOf(a).map((q) => `**${q.q}** ${q.a}`).join('\n\n')}
`)
  }
  return out.join('\n')
}
