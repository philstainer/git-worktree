# Git Worktree

I made this extension because I started using git worktrees and I wanted to
make it easier to manage and setup.

There are some sensible defaults but everything is customizable 🥳

Hopefully it helps and enjoy 👋

## Features

These are a list of features that I have currently implemented

#### Clone Command

By default if you use the clone command it create a directory structure like
this:

```bash
├── .bare
├── .git
├── worktree-1 <--
```

Then when adding worktrees, they will live along side. This in my opinion is
much cleaner and cleaner to manage

![clone](https://user-images.githubusercontent.com/39385802/200139171-c8cc3c00-18d9-43ff-a098-4ab3db605ee2.gif)

#### Add Command

You can choose to create a new worktree or create one from a remote branch that exists in your repository

##### Create new worktree

- Command Palette -> 'Git Worktree: Add'
- Select 'Create new worktree'
- Set a name for the worktree
- Set your tracking branch (think of this as your base branch, normally this is `main` or `master`)

![add-local](https://user-images.githubusercontent.com/39385802/200139178-a6246556-6d6a-4997-a4b8-d593871e7207.gif)

##### Add remote worktree

- Command Palette -> 'Git Worktree: Add'
- Select remote worktree

![add-remote](https://user-images.githubusercontent.com/39385802/200139183-c34598c5-62d0-4ed5-8c52-ba44c8faf01d.gif)

#### List Command

![list](https://user-images.githubusercontent.com/39385802/200139175-5c23eb22-4885-4e9a-b6fe-aec8ab3a7ee8.gif)

#### Rename Command

![rename](https://user-images.githubusercontent.com/39385802/200139188-375a317f-5d11-4ff5-99b8-0f4aff2c22a9.gif)

#### Remove Command

![remove](https://user-images.githubusercontent.com/39385802/200139190-bee3ae32-89a2-45d6-9131-954449f3cb27.gif)

#### Publish Command

![publish](https://user-images.githubusercontent.com/39385802/200139192-4c0381d1-3ae0-4eb9-b378-723a02f6291f.gif)

#### Projects Command

![projects](https://user-images.githubusercontent.com/39385802/200139197-610a97c9-aa2f-46db-8a96-6e1fd0a82abc.gif)

## Requirements

- git

## Extension Settings

This extension has the following settings:

#### General Settings:

Automatically push worktrees to remote

> :warning: **If you turn this off **: Then the tracking branch will not get updated to your new branch and you will have to run the publish command to fix

- `gitWorktree.worktree.shouldPushBranchAutomatically`: Yes

Set logging level for extension

- `gitWorktree.worktree.loggingLevel`: Info

Should we close prompts when user loses focus

- `gitWorktree.worktree.closeInputOnBlur`: True

### Clone Settings

Set the name of the folder the bare repository contents will be push into

- `gitWorktree.worktree.cloneBaseDirectory`: './.bare'

Should vscode open when clone command has finished

- `gitWorktree.worktree.openOnClone`: Yes

### Project Settings

Should vscode open when project has been selected

- `gitWorktree.worktree.openOnProject`: Yes

Should vscode save your cloned repositories

- `gitWorktree.worktree.saveProjectsAutomatically`: No

### List Settings

Should vscode open when worktree has been selected

- `gitWorktree.worktree.openOnSwitch`: Yes

### Add Settings

Set a base directory for worktrees

- `gitWorktree.worktree.baseDirectory`: ../

Should include remote branches when creating worktrees

- `gitWorktree.worktree.includeRemote`: True

Should prune branches when adding new worktrees

- `gitWorktree.worktree.pruneBranches`: False

Should vscode open when worktree has been added

- `gitWorktree.worktree.openOnAdd`: Yes

### Rename Settings

Should vscode open when worktree has been renamed

- `gitWorktree.worktree.openOnRename`: No

### Remove Settings

Should rename branch when removing a worktree

- `gitWorktree.worktree.removeBranch`: False

Remove worktree command should allow multiple select

- `gitWorktree.worktree.removeMultiple`: False

## Release Notes

### 1.0.0

Initial release
