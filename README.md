# opencode-file-tree

A TUI sidebar plugin for [opencode](https://opencode.ai/) that adds a navigable file tree in the sidebar. Browse directories, click files to preview their content inline, and refresh the tree.

![File tree screenshot](ss.png)

## Features

- **File tree** — directories first, sorted alphabetically, with ▶/▼ expand/collapse
- **Inline file preview** — click any file to view its content with line numbers
- **Smart ignore** — skips `node_modules`, `.git`, binaries, media, and build artifacts
- **Refresh** — ↻ button reloads the tree from disk

## Installation

Install the package:

```bash
opencode plugin opencode-file-tree
```

Or add it manually to `~/.config/opencode/tui.json`:

```json
{
  "$schema": "https://opencode.ai/tui.json",
  "plugin": ["./node_modules/opencode-file-tree/dist/index.js"]
}
```

## Usage

1. Restart opencode
2. Start or open a **session** — the sidebar only renders during active sessions
3. The file tree appears on the left sidebar showing your project's files
4. Click a file to preview it inline; click another file or the × button to close
5. Click the ↻ button to refresh the tree

## How it works

- Built with [@opentui/solid](https://opentui.com/) for TUI rendering
- Uses opencode's `sidebar_content` slot to place the file tree in the sidebar
- Reads directories via `fs/promises` on demand; caches results in signals
- Inline file preview reads the entire file and renders it with line numbers

## Development

```bash
git clone https://github.com/TM23-sanji/opencode-file-tree
cd opencode-file-tree
bun install
bun run build
```

The build uses `@opentui/solid/bun-plugin` to compile SolidJS JSX. The dist file is pre-built — you only need to rebuild if you modify the source.

## License

MIT
