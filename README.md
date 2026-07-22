# opencode-file-tree

A TUI sidebar plugin for [opencode](https://opencode.ai/) that adds a navigable file tree in the sidebar. Browse directories, click files to preview their content inline, and refresh the tree manually.

## Features

- **File tree** — directories first, sorted alphabetically, with `▶`/`▼` expand/collapse
- **Inline file preview** — click any file to view its content with line numbers in the sidebar
- **Smart ignore** — skips `node_modules`, `.git`, binaries, large media, and build artifacts automatically
- **Refresh** — `↻` button reloads the tree from disk

## Installation

```bash
bun add opencode-file-tree
# or
npm install opencode-file-tree
```

Add to your TUI config:

```json
{
  "plugin": ["opencode-file-tree"]
}
```

Restart opencode. The file tree appears in the sidebar.

## Development

```bash
git clone <repo-url>
cd opencode-file-tree
bun install
bun run build
```

## License

MIT
