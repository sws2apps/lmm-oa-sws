# How to Contribute
LMM-OA is one of the applications developped by the [Scheduling Workbox System (SWS)](https://github.com/sws2apps) team. But we are also more than happy to receive support from those who are very intersted to assist us. Hopefully this document makes the process for contributing clear and answers some questions that you may have.

Please make sure that you have read the [code of conduct](https://github.com/sws2apps/lmm-oa-sws/blob/main/CODE_OF_CONDUCT.md) before continuing.

## Semantic Versioning
LMM-OA follows semantic versioning. We release patch versions for bugfixes, minor versions for new features or non-essential changes, and major versions for any breaking changes. Every significant change is documented in the [changelog](https://github.com/sws2apps/lmm-oa-sws/blob/main/CHANGELOG.md) file.

## Branch Organization
We used three different branches to make production, beta and alpha releases of LMM-OA:

| branch | whats for |
| :----- | :-------- |
| main   | production release: bug fix for the current version will be queued in this branch |
| beta   | beta release, available on staging environment: new feature will be queued in this branch |
| alpha  | alpha release, available on development environment: breaking change will be queued in this branch |

## Bugs

### Known Issues and Report
We are using [GitHub Issues](https://github.com/sws2apps/lmm-oa-sws/issues) to keep track of bugs fix, and changes to be made to the application. We keep a close eye on this and try to make it clear when we have an internal fix in progress. Before filing a new task, try to make sure your problem doesn’t already exist.

### Security Bugs
Please do not report security bugs in the public issues; go through the process outlined on the [Security Policy](https://github.com/sws2apps/lmm-oa-sws/blob/main/SECURITY.md).

## Proposing a Change
If you intend to add new features or suggest major changes to LMM-OA, check first that your idea is not yet in our tracking issues list. If not, we recommend creating a new [discussion first](https://github.com/sws2apps/lmm-oa-sws/discussions/categories/ideas). This lets us reach an agreement on your proposal before you put significant effort into it. After it has been approved, please create [new issue](https://github.com/sws2apps/lmm-oa-sws/issues), and choose the correct template.

If you’re only fixing a bug, it’s fine to submit a pull request right away but we still recommend to file an issue detailing what you’re fixing. This is helpful in case we don’t accept that specific fix but want to keep track of the issue.

## Contribution Prerequisites
- You have the latest version of [Node](https://nodejs.org) and [Git](https://git-scm.com) installed
- You are only working on one item at a time.
- You do not edit the code directly on GitHub UI.

## Sending a Pull Request (PR)
We are monitoring for pull requests. We will review your pull request and either merge it, request changes to it, or close it with an explanation. We’ll do our best to provide updates and feedback throughout the process.

**Before submitting a PR**, please make sure the following is done:
1. If you do not have it yet, fork the repository and clone it locally.
2. If you already have the repository locally, run `git fetch --all`.
3. Make sure that you are on the correct branch depending on what you are suggesting. Then do a git rebase to get latest changes from upstream, example `git rebase upstream/main`.
4. Setup the environment variable .env with the following content:
   ```bash
   GENERATE_SOURCEMAP=false
   REACT_APP_VERSION=$npm_package_version
   ```
5. Run `npm i`.
6. Then work. 😆

**When commiting your changes**, we recommend the following command to be run:
1. Run `npm run ghcommit` to start the [commitizen cli](https://github.com/commitizen/cz-cli#using-the-command-line-tool). Make sure that you’ve set your changes accordingly. Failure to comply with this will cause your pull request to be discarded.

**When you are ready to push your changes**, we recommend the following commands to be run:
1. Do the rebase process again as described above. This will make sure that you get the latest changes made on upstream before you will create your PR.
2. Run `git push -f`.

**When your proposed changes are in the forked repository on GitHub**:
1. Create your PR.
2. Make sure the title follows the [conventional-changelog](https://github.com/semantic-release/semantic-release#commit-message-format) format. Failure to set this accordingly will cause your pull request to be discarded.

You will receive a notification and be informed when your PR is published on development, staging, or in production.
