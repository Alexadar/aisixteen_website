// Helpers shared by every Foundations article file. Writers import from here; only the
// integrator changes it.
export const REPO = 'https://github.com/aisixteen/fantastic'
// A link to a file (optionally a line) on fantastic main: src('README.md', 42).
export const src = (path, line) => `${REPO}/blob/main/${path}${line ? `#L${line}` : ''}`
// A link to a folder on fantastic main.
export const tree = (path) => `${REPO}/tree/main/${path}`
