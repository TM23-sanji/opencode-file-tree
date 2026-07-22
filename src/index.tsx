/** @jsxImportSource @opentui/solid */
import type { TuiPlugin, TuiPluginApi, TuiPluginModule } from '@opencode-ai/plugin/tui'
import { createMemo, createSignal, For, Show } from 'solid-js'
import { readdir, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'

const IGNORE_DIRS = new Set([
  'node_modules', '.git', '.next', 'dist', 'build', '.cache',
  '__pycache__', '.venv', 'venv', '.env', '.pnpm-store',
  'uv-cache', '.trash-1000', '$RECYCLE.BIN', 'System Volume Information',
  'target', 'vendor', '.gradle', 'bin', 'obj',
])

const IGNORE_EXTS = new Set([
  '.pyc', '.pyo', '.so', '.dylib', '.dll', '.exe', '.o', '.a',
  '.class', '.jar', '.png', '.jpg', '.jpeg', '.gif', '.ico',
  '.svg', '.woff', '.woff2', '.ttf', '.eot', '.pdf',
  '.mp4', '.mp3', '.avi', '.mov', '.flv', '.webm',
  '.db', '.sqlite', '.sqlite3', '.lock', '.tsbuildinfo',
  '.deb', '.rpm', '.AppImage',
])

interface DirEntry {
  name: string
  path: string
  isDir: boolean
}

async function readDir(dirPath: string): Promise<DirEntry[]> {
  try {
    const entries = await readdir(dirPath, { withFileTypes: true })
    const nodes: DirEntry[] = []
    for (const entry of entries) {
      if (IGNORE_DIRS.has(entry.name)) continue
      if (entry.name.startsWith('.') && entry.name !== '.env') continue
      if (entry.isDirectory()) {
        nodes.push({ name: entry.name, path: join(dirPath, entry.name), isDir: true })
      } else if (entry.isFile()) {
        const ext = entry.name.slice(entry.name.lastIndexOf('.')).toLowerCase()
        if (IGNORE_EXTS.has(ext)) continue
        nodes.push({ name: entry.name, path: join(dirPath, entry.name), isDir: false })
      }
    }
    nodes.sort((a, b) => {
      if (a.isDir !== b.isDir) return a.isDir ? -1 : 1
      return a.name.localeCompare(b.name)
    })
    return nodes
  } catch {
    return []
  }
}

const PLUGIN_ID = 'file-tree-sidebar'

const tui: TuiPlugin = async (api) => {
  const rawDir = api.state.path.worktree || api.state.path.directory || ''
  const rootPath = rawDir && rawDir !== '/' ? rawDir : process.cwd()
  const [dirCache, setDirCache] = createSignal<Record<string, DirEntry[]>>({})
  const [expanded, setExpanded] = createSignal<Set<string>>(new Set())
  const [loadError, setLoadError] = createSignal<string>()

  async function loadDir(dirPath: string) {
    const entries = await readDir(dirPath)
    setDirCache((prev) => ({ ...prev, [dirPath]: entries }))
  }

  if (rootPath === '/') {
    setLoadError('No project directory set')
  } else {
    loadDir(rootPath).catch((e: Error) => setLoadError(e.message))
  }

  async function toggleDir(dirPath: string) {
    const exp = new Set(expanded())
    const willExpand = !exp.has(dirPath)
    if (willExpand) {
      exp.add(dirPath)
    } else {
      exp.delete(dirPath)
    }
    setExpanded(exp)

    if (willExpand && !(dirPath in dirCache())) {
      await loadDir(dirPath)
    }
  }

  function refreshTree() {
    const current = rootPath
    setDirCache({})
    setExpanded(new Set())
    loadDir(current).catch((e: Error) => setLoadError(e.message))
  }

  const [openFile, setOpenFile] = createSignal<{ path: string; lines: string[]; name: string; total: number } | null>(null)

  function closeFile() { setOpenFile(null) }

  async function showFile(filePath: string) {
    try {
      const content = await readFile(filePath, 'utf-8')
      const lines = content.split('\n')
      setOpenFile({
        path: filePath,
        lines,
        name: relative(rootPath, filePath),
        total: lines.length,
      })
    } catch {
      api.ui.toast({ message: `Could not read ${relative(rootPath, filePath)}`, variant: 'error' })
    }
  }

  const flatTree = createMemo(() => {
    const result: (DirEntry & { depth: number })[] = []
    const cache = dirCache()
    const exp = expanded()

    function walk(dir: string, depth: number) {
      const entries = cache[dir]
      if (!entries) return
      for (const entry of entries) {
        result.push({ ...entry, depth })
        if (entry.isDir && exp.has(entry.path)) {
          walk(entry.path, depth + 1)
        }
      }
    }

    walk(rootPath, 0)
    return result
  })

  api.slots.register({
    slots: {
      sidebar_content() {
        return (
          <box gap={0}>
            <Show when={!loadError()} fallback={
              <text fg={api.theme.current.error}>Error: {loadError()}</text>
            }>
              <Show when={flatTree().length > 0} fallback={
                <text fg={api.theme.current.textMuted}>Loading...</text>
              }>
                <box gap={0}>
                  <box flexDirection="row" gap={1} paddingBottom={1}>
                    <text fg={api.theme.current.text}><b>Files</b></text>
                    <text
                      fg={api.theme.current.textMuted}
                      onMouseDown={() => refreshTree()}
                    >↻</text>
                  </box>
                  <For each={flatTree()}>
                    {(item) => (
                      <box
                        flexDirection="row"
                        gap={0}
                        onMouseDown={() => {
                          if (item.isDir) toggleDir(item.path)
                          else if (openFile()?.path === item.path) closeFile()
                          else showFile(item.path)
                        }}
                      >
                        <text fg={api.theme.current.textMuted}>
                          {'  '.repeat(item.depth)}
                        </text>
                        <Show when={item.isDir} fallback={
                          <text fg={api.theme.current.text}>
                            {openFile()?.path === item.path ? '● ' : '  '}
                            {item.name}
                          </text>
                        }>
                          <text fg={api.theme.current.primary}>
                            {expanded().has(item.path) ? '▼ ' : '▶ '}
                            {item.name}
                          </text>
                        </Show>
                      </box>
                    )}
                  </For>
                  <Show when={openFile()}>
                    {(of) => (
                      <box gap={0} paddingTop={1}>
                        <box flexDirection="row" gap={1}>
                          <text
                            fg={api.theme.current.textMuted}
                            onMouseDown={() => closeFile()}
                          >×</text>
                          <text fg={api.theme.current.text}>
                            <b>{of().name}</b>
                            <span style={{ fg: api.theme.current.textMuted }}>
                              &nbsp;({of().total} lines)
                            </span>
                          </text>
                        </box>
                        <box gap={0} paddingTop={1}>
                          <For each={of().lines}>
                            {(line, i) => (
                              <box flexDirection="row" gap={2}>
                                <text
                                  fg={api.theme.current.textMuted}
                                  textAlign="right"
                                  width={4}
                                >{i() + 1}</text>
                                <text fg={api.theme.current.text} wrap="none">{line}</text>
                              </box>
                            )}
                          </For>
                        </box>
                      </box>
                    )}
                  </Show>
                </box>
              </Show>
            </Show>
          </box>
        )
      },
    },
  })
}

const plugin: TuiPluginModule & { id: string } = { id: PLUGIN_ID, tui }
export default plugin
