# quick-pr

> Quickly create PRs. great for small quick changes.

# Limitations

Currently supports only BitBucket.

# Usage

```
Usage: quick-pr --open --approve --title <title> --description <description> --user <username> --token <token> --repoSlug <repo-slug> --source <source-branch> --target <target-branch> --reviewer username1,username2 --reviewer alias3

source - optional. by default will be current branch
target - target branch. by default it will be develop
reviewer - list of reviewers. none by default. csv supported. aliases supported only if yaml config defined. see below.
repo - repo slug (for example express/express)
user - username
token - token
title - optional. defaults to last git message
description - optional. defaults to last git message
```

# NEW! - YAML CONFIGURATION

```
repos:
  path/to/root/git: repo/slug1
  path/to/other/git: repo/slug2
users:
  alias1:  username1
  alias2: username2
  group1: alias1, username2
  # group to groups won't work currently.
approve: true
credentials:
  token: my_token
  user: my_user
  repoSlug: my_slug
```

# Roadmap

 - [X] auto approve your own pr
 - [X] improve reviewers mechanism
 - [ ] add github support by demand
 - [ ] add support to quickly view your PRs, their status and the PRs you should review, open them etc..
