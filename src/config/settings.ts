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

const shouldIncludeRemoteBranches: boolean =
  workspace.getConfiguration().get('gitWorktree.worktree.includeRemote') ??
  false;

const shouldPruneBranches: boolean =
  workspace.getConfiguration().get('gitWorktree.worktree.pruneBranches') ??
  false;

// Remove
const shouldRemoveBranch: boolean =
  workspace.getConfiguration().get('gitWorktree.worktree.removeBranch') ??
  false;

export default {
  shouldOpenNewWindowOnCloneBare,
  shouldOpenNewWindowOnSwitch,
  shouldOpenNewWindowOnCreate,
  shouldOpenOnRename,
  shouldPushBranchAutomatically,
  loggingLevel,

  // Add
  baseDirectory,
  shouldIncludeRemoteBranches,
  shouldPruneBranches,

  // Remove
  shouldRemoveBranch,
};
