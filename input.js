const gitBranches = require('git-branch-away');
const argv = require('minimist')(process.argv.slice(2));
const shell = require('shelljs');
const logger = require('./logger');
const _ = require('lodash');
const findUp = require('find-up');
const yamlConfPath = findUp.sync('.quick-pr.yml');
let yamlConf = {};

const loadData = {};
let loaded = false;
function load () {
  if (loaded) {
    return;
  }
  if (yamlConfPath) {
    if (argv.verbose) {
      console.log('using yaml configuration found at', yamlConfPath);
    }
    const YAML = require('yamljs');
    yamlConf = YAML.load(yamlConfPath);
    if (argv.dry) {
      console.log('yamlConf is', yamlConf);
    }
  } else {
    console.log('could not find yaml configuration file. using args and defaults');
  }

  loadData.lastMessage = shell.exec(`git log -1 --pretty=%B`, {silent: true}).toString().trim();

  if (argv.reviewer) {
    console.log(`✅using pr title [${loadData.lastMessage}]`);
  }
  loaded = true;
}

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

let input = null;
exports.get = function () {
  load();
  if (input !== null) {
    return input;
  }
  const branches = gitBranches.list();
  const root = gitBranches.root().trim();
  if (argv.verbose) {
    console.log('input is', argv);
  }
  const combined = Object.assign({
    source: branches.current,
    target: 'develop',
    title: loadData.lastMessage,
    description: loadData.lastMessage,
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

    if (argv.verbose) {
      console.log('mapping reviewers', combined.reviewer);
    }
    combined.reviewers = _.uniq(combined.reviewer.map(toUser));
    if (combined.reviewers.length) {
      logger.good('✅ mapped reviewers');
    }
  }

  if (argv.verbose) {
    console.log('combined.credentials.repoSlug && combined.repos && combined.repos.hasOwnProperty(root)', [combined.credentials.repoSlug, combined.repos, combined.repos.hasOwnProperty(root), root]);
  }
  if (!combined.credentials.repoSlug && combined.repos && combined.repos.hasOwnProperty(root)) {
    if (argv.verbose) {
      console.log('mapping root directory to repoSlug');
    }
    combined.credentials.repoSlug = combined.repos[root];
    console.log('✅found the repo-slug');
  }

  if (argv.verbose) {
    console.log('combined configuration is', combined);
  }

  input = combined;
  return combined;
};
