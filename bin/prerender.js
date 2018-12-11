#!/usr/bin/env node
const prerender = require('../index');

const args = require('minimist')(process.argv.slice(2));
console.log(args);

const { source, target, renderer, _: routes, ...rendererOptions } = args;

console.log({ source, target, renderer, routes, rendererOptions });

prerender({
  workingDirectory: process.cwd(),
  sourceDirectory: source || '.',
  targetDirectory: target || 'prerender',
  routes: routes,
  rendererName: renderer || 'jsdom',
  rendererOptions
}).catch(e => console.error(e));
