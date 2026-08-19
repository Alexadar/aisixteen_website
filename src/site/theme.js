// Small derivations shared by the components. Colors are handled in CSS via the
// single `--accent` custom property, so this only computes structural extras.

export const SITE = {
  name: 'AISixteen',
  origin: 'https://aisixteen.com',
  email: 'info@aisixteen.com',
  tagline: 'Apps that keep to themselves.', // hero headline; edit here to change
}

export const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'games', label: 'Games' },
  { key: 'tools', label: 'Creative tools' },
  { key: 'ai', label: 'AI & utilities' },
  { key: 'science', label: 'Sky & science' },
]

export const appStoreUrl = (app) => `https://apps.apple.com/app/id${app.appStoreId}`

export const deviceLabel = (device) =>
  device === 'ios' ? 'iPhone' : device === 'ipad' ? 'iPad' : 'Mac'

// Folder that holds an app's media (icon/screenshot/preview.mp4 live together).
export const appFolder = (app) => app.icon.split('/')[0]

// Supported devices line (defaults unless an app overrides).
export const platformsOf = (app) => app.platforms || 'iPhone, iPad & Mac'

// `app.live` marks an app that fetches public live data (e.g. NOAA space weather). Those apps
// are still account-free and tracking-free, but they are NOT offline — never claim otherwise.
export const trustPointsOf = (app) => app.live
  ? [app.liveSource ? `Live ${app.liveSource} data` : 'Live public data', 'No tracking, ever', 'No account or subscription']
  : ['Runs 100% on-device', 'No tracking, ever', 'No account or subscription']

export const privacyLineOf = (app) => app.live
  ? `No account, no tracking, no data collection. ${app.name} only fetches public ${app.liveSource || 'data'} feeds — nothing about you is sent anywhere.`
  : app.icloud
    ? `No account, no tracking, no data collection. ${app.name} computes everything on your device, and anything you save syncs through your own iCloud — never our servers.`
    : `No account, no tracking, no data collection. ${app.name} works fully offline.`

// Honest, generated FAQ — one source for both the visible accordion and FAQPage schema.
export const faqsOf = (app) => app.faqs || [
  app.live
    ? { q: `Does ${app.name} need an internet connection?`, a: `Yes, for live readings. ${app.name} pulls public ${app.liveSource || 'data'} feeds to show current conditions; previously loaded values stay visible offline.` }
    : app.icloud
      ? { q: `Does ${app.name} work offline?`, a: `Yes. Every calculation runs on your device, so it works with no internet connection. Anything you save syncs through your own iCloud whenever a connection is available.` }
      : { q: `Does ${app.name} work offline?`, a: `Yes. ${app.name} runs entirely on your device, so it works with no internet connection.` },
  { q: 'Is there an account or subscription?', a: `No. There's no sign-up, no login, and no subscription — just download ${app.name} from the App Store and open it.` },
  { q: `What data does ${app.name} collect?`, a: app.live
    ? 'None. It collects no personal data and has no analytics or tracking — the only network requests are to the public data feeds it displays.'
    : app.icloud
      ? 'None. There are no accounts, no analytics and no tracking, and we receive nothing. Anything you save is stored in your own private iCloud container, not on our servers.'
      : 'None. It collects, stores, and transmits zero personal data — nothing ever leaves your device.' },
  { q: 'Which devices are supported?', a: `${app.name} is available for ${platformsOf(app)}.` },
]
