import { INoYesOption, INoYesWindowOption } from '#/@types/worktree';
import { workspace } from 'vscode';
import { getCurrentLoggingLevel } from '../helpers/general';
import { noYesAskOptions, noYesWindowOptions } from './constants';

// General
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

const shouldOpenOnRename: INoYesWindowOption =
  workspace.getConfiguration().get('gitWorktree.worktree.shouldOpenOnRename') ??
  noYesWindowOptions.no;

const shouldPushBranchAutomatically: INoYesOption =
  workspace.getConfiguration().get('gitWorktree.worktree.automatically') ??
  noYesAskOptions.no;

const loggingLevel = getCurrentLoggingLevel();

// Add
const baseDirectory: string =
  workspace.getConfiguration().get('gitWorktree.worktree.baseDirectory') ??
  './';

// Remove
const shouldIncludeRemoteBranches: boolean =
  workspace.getConfiguration().get('gitWorktree.worktree.includeRemote') ??
  false;

export default {
  shouldOpenNewWindowOnCloneBare,
  shouldOpenNewWindowOnSwitch,
  shouldOpenNewWindowOnCreate,
  shouldOpenOnRename,
  shouldPushBranchAutomatically,
  loggingLevel,
  baseDirectory,
  shouldIncludeRemoteBranches,
};
