const open = require('open');

async function openPr (input) {
  const Client = require('./vendors').get(input.vendor);
  if (input.help) {
    console.log(`
    Usage: quick-pr --open --draft --title <title> --description <description> --user <username> --token <token> --repo <repo-slug> --target <target-branch> --base <base-branch> --reviewer name@of.user --reviewer second@reviewer.here

    base - base branch. by default we will take remote's default
    target - optional. by default will be current branch
    reviewer - list of reviewers. none by default
    repo - repo slug (for example express/express)
    draft - only supported by Github. Causes PR to create in Draft mode.
    user - username
    token - token
    title - optional. defaults to last git message
    description - optional. defaults to last git message
  `);
    process.exit(0);
  }
  console.log('reviewers', input.reviewers);
  const createData = {
    destination: {
      branch: {
        name: input.base
      }
    },
    source: {
      branch: {
        name: input.target
      }
    },
    description: input.description,
    draft: input.draft,
    title: input.title,
    body: input.description,
    reviewers: [].concat(input.reviewers).map((r) => {
      if (r.startsWith('{')) {
        return {uuid: r};
      }
      return {username: r};
    })
  };
  if (input.dry) {
    console.log('create data is', JSON.stringify(createData));
    process.exit(0);
  }

  const client = new Client(input.credentials);
  try {
    const result = await client.pullRequests.create(createData);
    console.log('this is result');
    if (input.open) {
      open(result.links.html.href);
    } else {
      console.log(result.links.html.href);
    }

    if (input.approve) {
      client.pullRequests.approve(result.id).then(() => {
        console.log('aaaaand.... approved!');
      });
    }
  } catch (e) {
    console.log(e);
  }
}

exports.run = async (args) => {
  return openPr(args);
};
