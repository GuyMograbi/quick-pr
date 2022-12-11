const request = require('request-promise-native');

class PullRequests {
  constructor (request, args) {
    this.request = request;
    this.args = args;
  }

  get () {
    // if (id) {
    console.log(this.args.user);
    return this.request({
      baseUrl: null,
      uri: `https://api.bitbucket.org/2.0/pullrequests/${this.args.user}`
    });
    // } else {
    // return this.request('/pullrequests');
    // }
  }

  create (json) {
    return this.request({
      method: 'POST',
      url: '/pullrequests',
      json
    });
  }

  // unwatch () {
  //   https://bitbucket.org/!api/1.0/users/%7B7742d4ac-def7-43c1-8c24-9278065708b3%7D/unwatch/
  // }

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
  constructor ({ user, token, repoSlug }) {
    this.user = user;
    this.token = token;
    this.request = request.defaults({
      baseUrl: `https://api.bitbucket.org/2.0/repositories/${repoSlug}/`,
      auth: { user, pass: token }
    });
  }

  get pullRequests () {
    return new PullRequests(this.request, this);
  }

  get members () {
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
    reviewers: [{ username: 'test-user' }]
  };
  // if (input.dry) {
  //   console.log('requestData is', JSON.stringify(requestData));
  //   process.exit(0);
  // }
  new Client(credentials).pullRequests.create(requestData).then((result) => {
    console.log(result);
  });
}
