import { workspace } from 'vscode';

const shouldOpenNewWindowOnCloneBare: boolean =
  workspace
    .getConfiguration()
    .get('gitWorktree.worktree.openNewWindowOnCloneBare') ?? false;

const shouldOpenNewWindowOnSwitch: boolean =
  workspace
    .getConfiguration()
    .get('gitWorktree.worktree.openNewWindowOnSwitch') ?? false;

const shouldOpenNewWindowOnCreate: boolean =
  workspace
    .getConfiguration()
    .get('gitWorktree.worktree.openNewWindowOnCreate') ?? false;

const shouldPushBranchAutomatically: boolean =
  workspace.getConfiguration().get('gitWorktree.worktree.automatically') ??
  false;

const shouldIncludeRemoteBranches: string =
  workspace.getConfiguration().get('gitWorktree.worktree.includeRemote') ??
  'No';

export default {
  shouldOpenNewWindowOnCloneBare,
  shouldOpenNewWindowOnSwitch,
  shouldOpenNewWindowOnCreate,
  shouldPushBranchAutomatically,
  shouldIncludeRemoteBranches,
};
