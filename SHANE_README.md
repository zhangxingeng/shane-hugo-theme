### Rebase to upstream
- add remote (run once when setup new local branch): `git remote add upstream https://github.com/CaiJimmy/hugo-theme-stack.git`
- **Make sure all changes are either pushed or stashed!**
- fetch upstream latest info `git fetch upstream`
- just rebase: `git rebase upstream/master`
- after rebase, force push to origin `git push origin master --force`
### Other Stuff
- list all remote origin urls `git remote -v`
