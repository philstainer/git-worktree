import { getCurrentLoggingLevel } from '../helpers/general';
import { getVSCodeSetting } from '../helpers/vscode';
import { noYesAskOptions, noYesWindowOptions } from './constants';

// General
const shouldPushBranchAutomatically = getVSCodeSetting(
  'gitWorktree.worktree.automatically',
  noYesAskOptions.no
);

const loggingLevel = getCurrentLoggingLevel();

// Clone
const cloneBaseDirectory = getVSCodeSetting(
  'gitWorktree.worktree.cloneBaseDirectory',
  './.bare'
);

const shouldOpenOnClone = getVSCodeSetting(
  'gitWorktree.worktree.shouldOpenOnClone',
  noYesWindowOptions.no
);

// List
const shouldOpenOnSwitch = getVSCodeSetting(
  'gitWorktree.worktree.openOnSwitch',
  noYesWindowOptions.yes
);

// Add
const baseDirectory = getVSCodeSetting(
  'gitWorktree.worktree.baseDirectory',
  './'
);

const shouldIncludeRemoteBranches = getVSCodeSetting(
  'gitWorktree.worktree.includeRemote',
  true
);

const shouldPruneBranches = getVSCodeSetting(
  'gitWorktree.worktree.pruneBranches',
  false
);

const shouldOpenOnAdd = getVSCodeSetting(
  'gitWorktree.worktree.openOnAdd',
  noYesWindowOptions.yes
);

// Rename
const shouldOpenOnRename = getVSCodeSetting(
  'gitWorktree.worktree.shouldOpenOnRename',
  noYesWindowOptions.no
);

// Remove
const shouldRemoveBranch = getVSCodeSetting(
  'gitWorktree.worktree.removeBranch',
  false
);

const shouldRemoveMultiple = getVSCodeSetting(
  'gitWorktree.worktree.removeMultiple',
  false
);

export default {
  shouldPushBranchAutomatically,
  loggingLevel,

  // Clone
  cloneBaseDirectory,
  shouldOpenOnClone,

  // List
  shouldOpenOnSwitch,

  // Add
  baseDirectory,
  shouldIncludeRemoteBranches,
  shouldPruneBranches,
  shouldOpenOnAdd,

  //Rename
  shouldOpenOnRename,

  // Remove
  shouldRemoveBranch,
  shouldRemoveMultiple,
};
