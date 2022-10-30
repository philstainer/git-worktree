import { workspace } from 'vscode';

export const shouldOpenNewVscodeWindow = workspace
  .getConfiguration()
  .get('gitWorktree.window.openNewWindow');

export const shouldPushBranchAutomatically = workspace
  .getConfiguration()
  .get('gitWorktree.push.openNewWindow');

export const shouldIncludeRemoteBranches = workspace
  .getConfiguration()
  .get('gitWorktree.add.includeRemote');
