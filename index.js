const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const Prerenderer = require('@prerenderer/prerenderer');

const PuppeteerRenderer = require('@prerenderer/renderer-puppeteer');
const JSDOMRenderer = require('@prerenderer/renderer-jsdom');

module.exports = async function prerender({
  // Current working directory
  workingDirectory,
  // Source directory for files to prerender, in relation to working directory
  sourceDirectory,
  // Target directory for prerendered files, in relation to working directory
  targetDirectory,
  // File names, in relation to target directory
  routes,
  // 'puppeteer' or 'jsdom'
  rendererName
}) {
  const prerenderer = makePrerenderer(workingDirectory, sourceDirectory, rendererName);
  const writeRenderedOutput = makeRenderedOutputWriter(workingDirectory, targetDirectory);

  try {
    await prerenderer.initialize();
    const renderedRoutes = await prerenderer.renderRoutes(prefixRoutes(routes));
    for (const renderedRoute of renderedRoutes) {
      const filename = writeRenderedOutput(renderedRoute);
      console.log(filename);
    }
  } finally {
    prerenderer.destroy();
  }
};

function prefixRoutes(routes) {
  return routes.map(route => (route.startsWith('/') ? route : `/${route}`));
}

function makePrerenderer(workingDirectory, sourceDirectory, rendererName) {
  return new Prerenderer({
    // Required - The path to the app to prerender. Should have an index.html and any other needed assets.
    staticDir: path.join(workingDirectory, sourceDirectory),
    // The plugin that actually renders the page.
    renderer: makeRenderer(rendererName)
  });
}

function makeRenderer(rendererName) {
  switch (rendererName) {
    case 'puppeteer':
      return new PuppeteerRenderer();
    case 'jsdom':
      return new JSDOMRenderer();
    default:
      throw new Error(`Unknown renderer name '${rendererName}'`);
  }
}

function makeRenderedOutputWriter(workingDirectory, targetDirectory) {
  return ({ route, html }) => {
    const outputFile = path.join(workingDirectory, targetDirectory, route);
    mkdirp.sync(path.dirname(outputFile));
    fs.writeFileSync(outputFile, html.trim());
    return outputFile;
  };
}
