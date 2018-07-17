const request = require('request-promise-native');

class PullRequests {
  constructor (request) {
    this.request = request;
  }

  get () {
    return this.request('/pullrequests');
  }

  create (json) {
    return this.request({
      method: 'POST',
      url: '/pullrequests',
      json
    });
  }

  approve (pullrequest) {
    return this.request({
      method: 'POST',
      url: `/pullrequests/${pullrequest}/approve`
    });
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
    this.request = request.defaults({'baseUrl': `https://api.bitbucket.org/2.0/repositories/${repoSlug}/`, auth: {user, pass: token}});
  }

  get pullRequests () {
    return new PullRequests(this.request);
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
  // if (input.dry) {
  //   console.log('requestData is', JSON.stringify(requestData));
  //   process.exit(0);
  // }
  new Client(credentials).pullRequests.create(requestData).then((result) => {
    console.log(result);
  });
}
