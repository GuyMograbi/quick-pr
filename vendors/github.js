const request = require('request-promise-native');
// https://docs.github.com/en/rest/reference/pulls#create-a-pull-request
class PullRequests {
  constructor (request, args) {
    this.request = request;
    this.args = args;
  }

  /**
  *  // do not support forks
  *  { head: branch name, title, base: branch name}
  **/
  async create (json) {
    console.log('github create pr');
    const head = json.source.branch.name;
    const base = json.destination.branch.name;
    const title = json.title;
    const pr = await this.request({
      method: 'POST',
      url: '/pulls',
      json: {
        head,
        title,
        base
      }
    });

    const id = pr.number;
    // try {
    await this.request({
      method: 'POST',
      url: `/pulls/${id}/requested_reviewers`,
      json: {
        reviewers: json.reviewers.map(u => u.username)
      }
    });

    return {links: pr._links};
  }

  approve () {
    return Promise.resolve();
  }
}

class Client {
  /**
   * @param {string} user - user to login
   * @param {string} token - token to login
   * @param {string} repoSlug - for example foo/bar
   **/
  constructor ({user, token, repoSlug}) {
    this.user = user;
    this.token = token;
    // /repos/{owner}/{repo}/pulls
    this.request = request.defaults({
      'baseUrl': `https://api.github.com/repos/${repoSlug}/`,
      auth: {user, pass: token},
      headers: {
        'User-Agent': 'hippo-guy'
      }
    });
  }

  get pullRequests () {
    return new PullRequests(this.request, this);
  }

  get members () {
    // https://bitbucket.org/!api/2.0/teams/hippo-inc/members
    throw new Error('not implemented');
  }
}

// new Client(credentials).pullRequests.get().then((result)=>{
//   console.log(result);
// })
//
module.exports = Client;

if (!module.parent) {
  console.log('running test for client');
  const credentials = require('./dev/credentials.json');
  const requestData = {
    destination: {
      branch: {
        name: 'test'
      }
    },
    source: {
      branch: {
        name: 'master'
      }
    },
    description: 'testing prs',
    title: 'testing prs',
    reviewers: [{username: 'test-user'}]
  };

  new Client(credentials).pullRequests.create(requestData).then((result) => {
    console.log(result);
  });
}
