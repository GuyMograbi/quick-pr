const gitBranches = require('git-branch-away');
const argv = require('minimist')(process.argv.slice(2));
const shell = require('shelljs');

const lastMessage = shell.exec(`git log -1 --pretty=%B`, {silent: true}).toString();
console.log('lastMessage is', lastMessage);
exports.get = function () {
  const branches = gitBranches.list();
  console.log(argv);
  return {...argv,
    source: argv.source || branches.current,
    target: argv.target || 'develop',
    reviewers: [].concat(argv.reviewer || []),
    credentials: {
      user: argv.user,
      token: argv.token,
      repoSlug: argv.repo
    },
    title: argv.title || lastMessage,
    description: argv.description || lastMessage};
};
