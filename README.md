# `prerenderer-cli`

Uses [`prerenderer`](https://github.com/Tribex/prerenderer) to generate prerendered versions of static HTML assets. This is useful if your page is implemented using e.g. React, and you _would not_ like to implement server-side rendering but _would_ like to benefit from fast initial page loads.

Usage:

```
yarn global add https://github.com/Ezku/prerenderer-cli
prerender <options> [files]
```

Options:

- **`--source=<directory>`**: base directory for prerendered files, in relation to current working directory
- **`--target=<directory>`**: target directory for prerendered files, in relation to current working directory
- **`--renderer=<name>`**: `puppeteer` or `jsdom`, optional, defaults to `jsdom`
- all key-value options not specified here: optional [arguments to renderer](https://github.com/Tribex/prerenderer#prerendererrenderer-jsdom-options)
- **`[files]`**: list of file names in relation to source directory

Example:

```
prerender \
  --renderer=puppeteer \
  --source=dist \
  --target=prerendered \
  --renderAfterDocumentEvent=render-complete \
  index.html
```

This command uses `puppeteer` to render `dist/index.html`, waits for the document to emit `render-complete` and saves the document to `prerendered/index.html`.
