# Blog Writing Skill

Styles, conventions, and HTML template for writing blog posts on this site.
Use this skill when asked to write, edit, format, or create a new blog post.

## Design System

### Colors

```
--bg:              #000000   (page background)
--text:            #ffffff   (primary text, links)
--text-main:       #ff6b6b   (headings, hover links, accent)
--text-light:      #c8c8c8   (body paragraphs, meta text, LaTeX)
--highlight-bg:    #2a2a2a   (code/pre background)
--highlight-border:#3a3a3a   (code/pre border, image borders)
--code-text:       #ffd93d   (inline and block code text, yellow)
```

### Typography

- **Primary font:** Roboto Mono Light 300 (`custom_mono`)
- **Fallback stack:** `"SF Mono", "Consolas", "Menlo", monospace`
- **Body:** 16px, line-height 1.7, weight 300, color `--text-light`
- **H1 (header):** 1.5em, bold, color `--text-main`
- **H2/H3 (article):** 1em, bold, color `--text-main`, margin-bottom 1.5rem
- **Code (`<code>`):** color `--code-text` (yellow)
- **Inline code in headings:** not used (headings are plain)

### Layout

- **Container:** max-width 750px, margin 0 auto, centered
- **Body padding:** 3rem (desktop), 1.5rem (max-width 768px)
- **Header margin-bottom:** 4rem
- **Section margin-bottom:** 3rem
- **Article margin-top:** 2rem

### Links

- Color: `--text` (white), underline with thickness 1px
- Hover: color `--text-main` (red), transition 0.2s ease-in-out
- No visited color override (stays white)

### Code / Pre Blocks

- `<pre>`: background `--highlight-bg`, border 1px solid `--highlight-border`, border-radius 4px, padding 1rem, font-size 0.85em, line-height 1.5, color `--text-light`, overflow-x auto, margin-bottom 1rem
- `<code>` inside pre: color `--code-text` (yellow)
- All `<code>` elements globally: color `--code-text`

### Images

- `<img>`: max-width 100%, border 1px solid `#3a3a3a`, border-radius 4px, margin 1rem 0

### Meta / Byline

- `.meta` class: color `--text-light`, font-size 0.9em, margin-top 0.5rem
- Format: `"Month Year · X min read"`

## Font Loading

```html
@font-face {
  font-family: "custom_mono";
  src: url("https://fonts.gstatic.com/s/robotomono/v22/L0x5DF4xlVMF-BfR8bXMIjhGq3-cXbKDO1w.woff2") format("woff2");
  font-weight: 300;
  font-style: normal;
}
```

## KaTeX / LaTeX Configuration

**CDN (v0.16.9) — pinned version, do not bump without testing:**

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" />
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script>
```

**Delimiters:**

| Type      | Delimiter | Example                    |
|-----------|-----------|----------------------------|
| Display   | `$$...$$` | `$$\mathbb{E}[X]$$`        |
| Inline    | `$...$`   | `$H(\mathcal{C})$`         |

**Init script (must run after DOMContentLoaded):**

```js
document.addEventListener("DOMContentLoaded", function () {
  renderMathInElement(document.body, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false },
    ],
  });
});
```

**KaTeX display style:** color `--text-light`, overflow-x auto, overflow-y hidden, padding 0.5rem 0.

## Writing Conventions

- **Document title:** lowercase, no trailing period — e.g. `"training an llm to play wordle with rl"`
- **Section headings:** lowercase sentence case, no trailing period — e.g. `"how wordle works"`
- **Em-dashes:** use `&mdash;` HTML entity with spaces on both sides
- **Bullets:** use `<br />` separated lines (see template), not `<ul>/<li>`
- **Code references:** wrap game terms, words, letters, filenames in `<code>` tags
- **Pre blocks:** use for code, config files, metrics tables, command-line output
- **Strong emphasis:** use `<strong>` for key terms, not bold styling
- **Images:** always include `style="max-width:100%;border:1px solid #3a3a3a;border-radius:4px;margin:1rem 0;"` and descriptive `alt` text
- **Links section:** final section before closing `</article>`, consistently titled `"links"`, using `<br />`-separated `<a>` tags
- **Closing line:** always end the last prose section with `"Till then, keep experimenting :)"`

## Writing Conventions for Tables in Pre Blocks

Tables in pre blocks use a pipe-aligned format with a header separator row:

```
Metric                              Value
time/step (avg)                     97.3s
time/wait_for_batch (avg)           40.6s (41.8%)
```

Column 1 left-aligned (padded with spaces), column 2 right-aligned. No literal pipe characters — just space-padded alignment.

## HTML Template

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><!-- lowercase title here --></title>

    <link rel="icon" type="image/jpeg" href="good_pfp.jpg" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" />
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script>

    <style>
      :root {
        --bg: #000000;
        --text: #fff;
        --text-main: #ff6b6b;
        --text-light: #c8c8c8;
        --highlight-bg: #2a2a2a;
        --highlight-border: #3a3a3a;
      }

      @font-face {
        font-family: "custom_mono";
        src: url("https://fonts.gstatic.com/s/robotomono/v22/L0x5DF4xlVMF-BfR8bXMIjhGq3-cXbKDO1w.woff2") format("woff2");
        font-weight: 300;
        font-style: normal;
      }

      * {
        box-sizing: border-box;
      }

      body {
        background-color: var(--bg);
        color: var(--text);
        font-family: "custom_mono", "SF Mono", "Consolas", "Menlo", monospace;
        font-size: 16px;
        line-height: 1.7;
        font-weight: 300;
        margin: 0;
        padding: 3rem;
      }

      a {
        color: var(--text);
        text-decoration: underline;
        text-decoration-thickness: 1px;
        transition: color 0.2s ease-in-out;
      }

      a:hover {
        color: var(--text-main);
      }

      .container {
        max-width: 750px;
        margin: 0 auto;
      }

      header {
        margin-bottom: 4rem;
      }

      header h1 {
        font-weight: bold;
        font-size: 1.5em;
        color: #ff6b6b;
        line-height: 1.4;
      }

      header .meta {
        color: var(--text-light);
        font-size: 0.9em;
        margin-top: 0.5rem;
      }

      article {
        margin-top: 2rem;
      }

      article section {
        margin-bottom: 3rem;
      }

      article h2, article h3 {
        font-weight: bold;
        font-size: 1em;
        color: #ff6b6b;
        margin-bottom: 1.5rem;
      }

      article p {
        color: var(--text-light);
        margin-bottom: 1rem;
      }

      article pre {
        background: var(--highlight-bg);
        border: 1px solid var(--highlight-border);
        border-radius: 4px;
        padding: 1rem;
        overflow-x: auto;
        font-size: 0.85em;
        line-height: 1.5;
        color: var(--text-light);
        margin-bottom: 1rem;
      }

      article code {
        color: #ffd93d;
      }

      .katex {
        color: var(--text-light);
      }

      .katex-display {
        color: var(--text-light);
        overflow-x: auto;
        overflow-y: hidden;
        padding: 0.5rem 0;
      }

      @media (max-width: 768px) {
        body {
          padding: 1.5rem;
        }
      }
    </style>
  </head>

  <body>
    <div class="container">
      <header>
        <h1><!-- blog title --></h1>
        <p class="meta"><!-- Month Year &bull; X min read --></p>
      </header>

      <article>
        <section>
          <h2><!-- section heading --></h2>
          <p><!-- body text, may contain <code>, <strong>, $inline math$ --></p>
          <p>
            $$
            \mathbb{E}[H(\mathcal{C}) - H(\mathcal{C} \mid \text{guess})]
            $$
          </p>
        </section>

        <section>
          <h2><!-- next section --></h2>
          <pre>
# config or code block here
</pre>
        </section>

        <section>
          <h2>links</h2>
          <p>
            <a href="...">link description</a><br />
            <a href="...">link description</a>
          </p>
        </section>
      </article>
    </div>

    <script>
      document.addEventListener("DOMContentLoaded", function () {
        renderMathInElement(document.body, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false },
          ],
        });
      });
    </script>
  </body>
</html>
```
