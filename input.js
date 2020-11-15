const gitBranches = require('git-branch-away');
const argv = require('minimist')(process.argv.slice(2));
const shell = require('shelljs');
const logger = require('./logger');
const _ = require('lodash');
const findUp = require('find-up');
const yamlConfPath = findUp.sync('.quick-pr.yml');
const urlParser = require('./url-parser');
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
  let combined = Object.assign({
    target: branches.current,
    base: gitBranches.getDefaultPrBase(),
    title: loadData.lastMessage,
    description: loadData.lastMessage,
    credentials: {
      user: argv.user,
      token: argv.token
    }
  }, yamlConf, argv);

  let repoUrl = argv.repoUrl;

  if (!repoUrl && combined.repos && combined.repos.hasOwnProperty(root)) {
    if (argv.verbose) {
      console.log('mapping root directory to repoSlug');
    }
    repoUrl = combined.repos[root];
    console.log('✅found the repo-slug');
  }

  const {owner, repo, vendor} = urlParser.parse(repoUrl);
  combined.vendor = vendor;

  console.log('vendor is', vendor);
  // allow to specify vendor specific configuration.
  if (combined.hasOwnProperty(vendor)) {
    combined = Object.assign({}, combined, combined[vendor]);
  }
  combined.credentials.repoSlug = `${owner}/${repo}`;

  users = combined.users;

  console.log('combined.reviewer', combined.reviewer);
  console.log('combined.reviewers', combined.reviewers);
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

  if (argv.verbose) {
    console.log('combined configuration is', combined);
  }

  input = combined;
  return combined;
};
