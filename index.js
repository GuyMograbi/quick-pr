#!/usr/bin/env node
const Client = require('./client');
const open = require('open');
const input = require('./input').get();

if (input._[0] === 'list') {
  require('./list-prs').run(input);
} else {
  require('./open-pr').run(input);
}
