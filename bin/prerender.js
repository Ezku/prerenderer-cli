const prerender = require('../index');

const args = require('minimist')(process.argv.slice(2));
console.log(args);

prerender({
  workingDirectory: process.cwd(),
  sourceDirectory: args.source || '.',
  targetDirectory: args.target || 'prerender',
  routes: args._
}).catch(e => console.error(e));
