# quick-pr

> Quickly create PRs. great for small quick changes.

# Limitations

Currently supports only BitBucket.

# Usage

```
Usage: quick-pr --open --title <title> --description <description> --user <username> --token <token> --repo <repo-slug> --source <source-branch> --target <target-branch> --reviewer name@of.user --reviewer second@reviewer.here

source - optional. by default will be current branch
target - target branch. by default it will be develop
reviewer - list of reviewers. none by default
repo - repo slug (for example express/express)
user - username
token - token
title - optional. defaults to last git message
description - optional. defaults to last git message
```


# Roadmap

 - [ ] add github support by demand
 - [ ] add support to quickly view your PRs, their status and the PRs you should review, open them etc..
