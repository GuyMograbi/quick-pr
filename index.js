#!/usr/bin/env node
const Client = require('./client');
const open = require('open');
const input = require('./input').get();

if (input.help) {
  console.log(`
    Usage: quick-pr --open --title <title> --description <description> --user <username> --token <token> --repo <repo-slug> --source <source-branch> --target <target-branch> --reviewer name@of.user --reviewer second@reviewer.here

    source - optional. by default will be current branch
    target - target branch. by default it will be develop
    reviewer - list of reviewers. none by default
    repo - repo slug (for example express/express)
    user - username
    token - token
    title - optional. defaults to last git message
    description - optional. defaults to last git message
  `);
  process.exit(0);
}

new Client(input.credentials).pullRequests.create({
  destination: {
    branch: {
      name: input.target
    }
  },
  source: {
    branch: {
      name: input.source
    }
  },
  description: input.description,
  title: input.title,
  reviewers: input.reviewers.map((r) => ({username: r}))
}).then((result) => {
  if (input.open) {
    open(result.links.self.href);
  } else {
    console.log(result.links.self.href);
  }
}).catch((e) => {
  console.log(e.message);
});
