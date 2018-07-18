const gitBranches = require('git-branch-away');
const argv = require('minimist')(process.argv.slice(2));
const shell = require('shelljs');
const _ = require('lodash');
const findUp = require('find-up');
const yamlConfPath = findUp.sync('.quick-pr.yml');
let yamlConf = {};
if (yamlConfPath) {
  console.log('using yaml configuration found at', yamlConfPath);
  const YAML = require('yamljs');
  yamlConf = YAML.load(yamlConfPath);
  if (argv.dry) {
    console.log('yamlConf is', yamlConf);
  }
} else {
  console.log('could not find yaml configuration file. using args and defaults');
}

const lastMessage = shell.exec(`git log -1 --pretty=%B`, {silent: true}).toString();
console.log('lastMessage is', lastMessage);

let users = {};
function toUser (name) {
  console.log('toUser name', name);
  name = name.trim();
  const result = users.hasOwnProperty(name) ? users[name] : name;
  if (result.indexOf(',') > 0) {
    return result.split(',').map(toUser);
  }
  return result;
}

exports.get = function () {
  const branches = gitBranches.list();
  const root = gitBranches.root().trim();
  console.log(argv);
  const combined = Object.assign({
    source: branches.current,
    target: 'develop',
    title: lastMessage,
    description: lastMessage,
    credentials: {
      user: argv.user,
      token: argv.token,
      repoSlug: argv.repoSlug
    }
  }, yamlConf, argv);

  users = combined.users;

  if (combined.reviewer && !combined.reviewers) {
    combined.reviewer = [].concat(combined.reviewer).join(',').split(',').map(toUser);
    combined.reviewer = _.flatten(combined.reviewer);
    console.log('mapping reviewers', combined.reviewer);
    combined.reviewers = _.uniq(combined.reviewer.map(toUser));
  }

  console.log('combined.credentials.repoSlug && combined.repos && combined.repos.hasOwnProperty(root)', [combined.credentials.repoSlug, combined.repos, combined.repos.hasOwnProperty(root), root])
  if (!combined.credentials.repoSlug && combined.repos && combined.repos.hasOwnProperty(root)) {
    console.log('mapping root directory to repoSlug');
    combined.credentials.repoSlug = combined.repos[root];
  }

  if (argv.dry) {
    console.log('combined configuration is', combined);
  }

  return combined;
};
