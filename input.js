const inquirer = require('inquirer');
const gitBranches = require('git-branches');
const argv = require('minimist')(process.argv.slice(2));

exports.get = function(){
  const branches = gitBranches.list();
  console.log('branches is', branches);
}
