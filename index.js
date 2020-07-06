#!/usr/bin/env node
const input = require('./input').get();

if (input._[0] === 'list') {
  require('./list-prs').run(input);
} else {
  require('./open-pr').run(input);
}
