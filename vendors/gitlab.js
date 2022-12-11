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
    const source_branch = json.source.branch.name;
    const target_branch = json.destination.branch.name;
    const title = json.title;
    const body = json.body;
    const draft = json.draft || false;
    const pr = await this.request({
      method: 'POST',
      url: '/merge_requests',
      json: {
        source_branch,
        target_branch,
        title: draft ? `[Draft] ${title}` : title,
        reviewer_ids: json.reviewers.map(u => u.username),
        body
      }
    });

    return { links: { html: { href: pr.web_url } } };
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
  constructor ({ user, token, repoSlug }) {
    this.user = user;
    this.token = token;
    // /repos/{owner}/{repo}/pulls
    this.request = request.defaults({
      baseUrl: `https://gitlab.com/api/v4/projects/${encodeURIComponent(repoSlug)}/`,
      headers: {
        Authorization: `Bearer ${token}`
      }
      // auth: {user, pass: token},
    });
  }

  get pullRequests () {
    return new PullRequests(this.request, this);
  }

  get members () {
    throw new Error('not implemented');
  }
}

module.exports = Client;
