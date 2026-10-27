// Agents › File agent. Facts: coder/tmp/foundations/facts/agents_file.md (fantastic main df457a0f).
import { src, tree } from '../lib.js'

export default {
  headline: 'The file agent: the filesystem as an agent',
  description: 'How Aisixteen Fantastic exposes a folder as an agent: versioned text verbs, all-or-nothing edits, raw byte streams, directory verbs, disk watching and per-file views.',
  summary: 'The file bridge is an agent over a folder. Callers read, edit, stream, list, rename, delete and watch files by sending it verbs.',
  cover: { clip: 'text' },
  about: ['Aisixteen Fantastic', 'File agent', 'Filesystem'],
  lead: [
    'In Fantastic a folder on disk is reached the way any other agent is: by sending it a verb. The bundle that does this is `file_bridge`, with the handler module `file_bridge.tools`. There is no agent called `file`.',
    'This page covers what a file bridge can do once it is open: text verbs that guard against lost updates, edits that apply to every file or to none, raw byte streams, directory verbs and path watching. Who may open it, and what the `allow` list exposes, is on the [Security page](/fantastic/foundations/protocol/security/#edges).',
  ],
  sections: [
    {
      id: 'bridge',
      title: 'A folder with verbs',
      blocks: [
        'A file bridge is an agent whose record names a `root` folder and may carry a `readonly` flag. The disk itself lies outside the trust domain, so the bridge is the gate: it checks the caller, the clamp and the `allow` list, and only then touches the disk. A new bridge is sealed, and a path it does not expose answers `not_found`. [Security](/fantastic/foundations/protocol/security/#edges) explains both rules, so this page assumes a bridge that is open and exposes the path in question.',
        'The verb table has 17 entries, the same in the Rust and Python runtimes. Besides `reflect` and `boot`, they fall into five groups.',
        { table: { head: ['group', 'verbs'], rows: [
          ['text documents', '`read`, `write`, `edit`, `append`, `undo`'],
          ['byte streams', '`read_stream`, `write_stream`, `pump`'],
          ['the directory tree', '`list`, `mkdir`, `rename`, `delete`'],
          ['watching', '`watch_path`, `unwatch_path`'],
          ['views', '`open_view`'],
        ] } },
        'With `readonly: true` on the record, every mutating verb is refused in the [common refusal shape](/fantastic/foundations/protocol/refusals/) with the reason `unauthorized` and the error “agent is readonly”. Reads still work. `reflect` is the one verb a sealed bridge answers: it reports the root, the `readonly` flag, the number of `allow` entries and the edit grammar.',
        'The records store described in [State](/fantastic/foundations/kernel/state/) is one such bridge, rooted at `.fantastic`. This page is about the bridge as a filesystem, not about how records are saved.',
      ],
    },
    {
      id: 'text',
      title: 'Text documents and versions',
      blocks: [
        '`read {path, offset?, limit?}` returns a page of lines, numbered from 1. `offset` counts lines and starts at 0, and `limit` defaults to 200. The reply holds `lines: [{n, text}]`, `total`, `eof` and `newline`, which says whether the file ends in a newline. A file with a NUL byte, or one that is not valid UTF-8, is refused with `bad_arg`: the text verbs work on text.',
        'The reply also holds a **version**: the first 16 hex digits of the SHA-256 of the file’s bytes. It is computed when asked and never stored. If those digits would parse as a number, the first one becomes `a`, so a JSON client cannot lose digits. Python applies the same rule, so both runtimes give the same version for the same bytes.',
        '`write {path, bytes, if_match?}` replaces the whole document. The bridge writes a fresh temporary file next to the target and renames it over, so a reader sees the old file or the new one, never half of one. Missing parent folders are created. The reply is `{path, size, version}`.',
        'With `if_match` set to the version you read, the write is refused if the file has changed since. The check runs under a lock held per bridge and path, so two writers cannot both pass it. The refusal carries `reason: "version_mismatch"` together with the `expected` and `actual` versions. `actual` is null when the file is gone.',
        { code: '{"error": "version mismatch — the document changed since you read it",\n "reason": "version_mismatch", "path": "notes.md",\n "expected": "5e0b94a1c2d7f3a8", "actual": "c41d02e7b9a6f358"}', label: 'the refusal (illustrative versions)' },
        { video: 'text' },
        '`append {path, bytes}` adds one chunk at the end and creates the file when it is absent. For all three content verbs, the document travels in `bytes`. On a binary transport it is the raw body. On a JSON-only channel a string is encoded as UTF-8.',
        { h3: 'edit: every hunk or none' },
        '`edit {edits, bytes, dry_run?}` changes several files in one transaction. `edits` is a list of `{path, hunks, if_match?}`, and `bytes` holds the patch: SEARCH/REPLACE blocks written as `<<<<<<< SEARCH`, `=======` and `>>>>>>> REPLACE`. Each SEARCH text must occur exactly once in its file. A path appears at most once in `edits`.',
        'The bridge verifies every hunk of every file before it writes anything. A SEARCH that is not found fails with the reason `no_match`, and one that matches more than once fails with `ambiguous`. Either way the reply is “a hunk did not apply — nothing written”, with the failing path and hunk index. `dry_run: true` stops after this check and writes nothing.',
        'If the writes themselves fail part way, the files already written are put back from the copies the bridge holds. Text that itself contains conflict markers takes the 8-character fence: `<<<<<<<< SEARCH`, `========` and `>>>>>>>> REPLACE`. A successful edit replies `{edited: true, edits: [{path, hunks, size, version}]}`.',
        { video: 'edit' },
        { h3: 'undo' },
        '`write`, `edit` and `append` each keep what they replaced. `undo {path}` swaps the file with that copy, and a second `undo` swaps back, so it is also redo. There is one slot per bridge and path, held in memory: a restart drops it and nothing is kept on disk. If the file did not exist before the change, `undo` deletes it and replies `deleted: true`. With no slot, the reply is `not_found`.',
      ],
    },
    {
      id: 'streams',
      title: 'Streams: raw bytes in chunks',
      blocks: [
        'The text verbs fit documents. Anything else, such as an image, an archive or a large file, moves in chunks over the stream verbs. A chunk is raw bytes and never base64: on a web socket or a bridge it rides as a binary frame.',
        '`read_stream {path, offset?, length?}` returns one chunk. `offset` defaults to 0 and `length` to 65536. The chunk is the body of the reply, and the JSON beside it holds `next_offset`, `eof` and `size`. The bridge keeps no open handle: a reader calls again with `offset` set to `next_offset` until `eof` is true.',
        '`write_stream {path, bytes, offset?, truncate?}` writes one chunk. Without `offset` it appends at the end of the file. `truncate: true`, or a file that does not exist yet, starts from an empty file. The reply is `{path, written, offset, size}`. A JSON string where raw bytes belong is refused with `missing_arg`.',
        '`pump {source?, source_path, sink?, sink_path?, chunk?}` does the whole copy in one call. It loops over `read_stream` on the source and `write_stream` on the sink, and the first write truncates. `source` and `sink` are agent ids, and an omitted one means this bridge. `sink_path` defaults to `source_path`. The reply is `{source, sink, bytes, chunks}`.',
        'A pump runs both ends as the bridge itself. The bridge’s `can_call` must reach the source and the sink, and each end’s `callable_by` must accept the bridge, as the [call gate](/fantastic/foundations/protocol/call-gate/) requires for any send. Each end also checks its own seal and clamp. A pump whose sink is its own source file is refused with `bad_arg`, because the first write would truncate the file being read.',
      ],
    },
    {
      id: 'tree',
      title: 'Listing, creating, renaming, deleting',
      blocks: [
        'Four verbs work on the directory tree. Each one needs its path to be exposed, and the three that change anything need the bridge not to be `readonly`.',
        { table: { head: ['verb', 'what it does', 'reply'], rows: [
          ['`list {path?}`', 'the entries of a folder, sorted by name, as `{name, path, type, size?}` with `type` `file` or `dir`. Shows only exposed entries, plus the folders on the way to one', '`{path, files}`'],
          ['`mkdir {path}`', 'creates the folder and its parents. An existing folder is fine, an existing file is not', '`{path, created: true}`'],
          ['`rename {old_path, new_path}`', 'moves a file or folder and creates the new path’s missing parents. Both ends must be exposed', '`{old_path, new_path}`'],
          ['`delete {path, recursive?}`', 'removes a file, an empty folder, or with `recursive: true` a whole tree. A symlink is unlinked, never followed', '`{path, deleted: true}`'],
        ] } },
        'The root is never an operand. For `mkdir`, `rename` and `delete`, an empty path or `.` is `missing_arg`, and a path that resolves to the root itself is `bad_arg` (“a path inside the root, not the root itself”). So `delete` with `recursive: true` cannot empty the whole served folder. A path that does not exist is `not_found`. `list` on a file is `bad_arg`.',
      ],
    },
    {
      id: 'watch',
      title: 'Watching paths',
      blocks: [
        '`watch_path {path}` puts an exposed file or folder under a disk watcher. From then on, any change to it, by any writer, is emitted on the bridge’s own inbox as `{type: "changed", path, kind}`. The writer can be this bridge, an editor or another process. A caller receives the events by registering as a watcher of the bridge, which needs an inbox and passes the gate like a send; a watcher without an inbox is refused `no_consumer` (the kernel refuses it). The reply is `{watching, paths}`.',
        'The `kind` is not the platform’s event name. The bridge keeps a stamp for each path (inode, change time, modification time and size) and judges the new stamp against the last one. A different inode is `added`, a changed stamp on the same inode is `modified`, a missing path is `deleted`, and an unchanged stamp is no event at all. An editor that saves by writing a temporary file and renaming it gives a new inode, so it reports `added`. The consumer’s rule is to treat any `changed` as a prompt to read again.',
        'A file is watched through its parent folder, so such a save is seen. A folder reports its entries, not its subfolders. A burst of events within 50 ms for one path becomes one `changed`. The `allow` list is read live: a path the bridge stops exposing reports nothing more.',
        { video: 'watch' },
        'A path that does not exist yet is accepted, and the reply carries `pending: true`. The bridge watches the nearest folder that exists, moves down as folders appear, and reports `added` when the path itself appears. A watch that cannot be armed, such as an unreadable folder, is refused with `transport_error` and holds nothing.',
        'Watches are held per caller. `unwatch_path {path}` drops the caller’s own hold, and the disk watch ends when no caller holds a path. Watches live in memory only. The Rust runtime uses the operating system’s native events and Python uses `watchfiles`, with the same verbs and the same kinds.',
      ],
    },
    {
      id: 'views',
      title: 'Views: one file or one folder as an agent',
      blocks: [
        '`open_view {kind, path, id?}` hands out a narrower agent. `kind` is `file` or `folder`, and the reply is `{id, kind, path, created}`. There is one view per path, and a second open returns the same agent. A view is a `file_bridge.tools` record that carries `view: file` or `view: folder`, and it is a child of its bridge.',
        'A view reaches its bridge as itself, with a fixed grant. A file view may send `read`, `write`, `watch_path` and `unwatch_path`. A folder view may send `list`, `watch_path` and `unwatch_path`. The [call gate](/fantastic/foundations/protocol/call-gate/) limits a view to those verbs, and the bridge holds it to its own path, so it refuses a verb naming any other path. The `allow` list still decides what exists.',
        'The verbs a view answers are fewer than the bridge’s. A file view answers `read`, `write`, `watch` and `reflect`. A folder view answers `list`, `reveal` (which folders to open on the way down to a path inside it), `watch` and `reflect`. Its `watch` relays the bridge’s changes to the view, and only those inside its path. A folder view names them `added`, `changed` and `removed`. An agent given only a view can do nothing the view does not offer.',
      ],
    },
  ],
  sources: [
    ['file_bridge: the verb table and the gate (Rust)', src('src/lib/rust/crates/bundles/fantastic-file/src/lib.rs', 68)],
    ['text verbs: read, write, edit, undo (Rust)', src('src/lib/rust/crates/bundles/fantastic-file/src/text.rs', 243)],
    ['directory and disk operations (Rust)', src('src/lib/rust/crates/bundles/fantastic-file/src/fs.rs', 224)],
    ['watch_path and the change stamps (Rust)', src('src/lib/rust/crates/bundles/fantastic-file/src/watch.rs', 36)],
    ['file and folder views (Rust)', src('src/lib/rust/crates/bundles/fantastic-file/src/views.rs', 27)],
    ['the verb table (Python)', src('src/lib/python/bundled_agents/io/file_bridge/src/file_bridge/tools.py', 1462)],
    ['the file_bridge readme', src('src/lib/rust/crates/bundles/fantastic-file/src/readme.md')],
    ['the Python bundle', tree('src/lib/python/bundled_agents/io/file_bridge/src/file_bridge')],
  ],
  clips: {
    text: {
      title: 'read, then write only if unchanged',
      caption: 'read returns notes.md as numbered lines with version 5e0b94a1c2d7f3a8. Another writer changes line 2, so the version becomes c41d02e7b9a6f358. A write with if_match 5e0b… is refused with version_mismatch and nothing is written. After a new read, a write with if_match c41d… lands and the reply holds the new version.',
    },
    edit: {
      title: 'edit: every hunk, or nothing',
      caption: 'An edit lists a.py and b.py with one hunk each. The hunk for a.py matches once, but the SEARCH text for b.py is not found: no_match. The bridge writes nothing, so both files are unchanged. With the search text fixed, both files are written together and the reply is edited: true.',
    },
    watch: {
      title: 'watch_path: changes arrive as events',
      caption: 'watch_path puts docs/ under a disk watcher. A change to a.md arrives in the bridge’s inbox as changed with kind modified. A new c.md arrives as added, and the removal of b.md arrives as deleted. Each event carries the path and the kind.',
    },
  },
}
