import { getCurrentLoggingLevel } from '../helpers/general';
import { getVSCodeSetting } from '../helpers/vscode';
import { noYesAskOptions, noYesWindowOptions } from './constants';

// General
const shouldOpenNewWindowOnSwitch = getVSCodeSetting(
  'gitWorktree.worktree.openNewWindowOnSwitch',
  false
);

const shouldOpenNewWindowOnCreate = getVSCodeSetting(
  'gitWorktree.worktree.openNewWindowOnCreate',
  false
);

const shouldOpenOnRename = getVSCodeSetting(
  'gitWorktree.worktree.shouldOpenOnRename',
  noYesWindowOptions.no
);

const shouldPushBranchAutomatically = getVSCodeSetting(
  'gitWorktree.worktree.automatically',
  noYesAskOptions.no
);

const loggingLevel = getCurrentLoggingLevel();

const cloneBaseDirectory = getVSCodeSetting(
  'gitWorktree.worktree.cloneBaseDirectory',
  './.bare'
);

const shouldOpenOnClone = getVSCodeSetting(
  'gitWorktree.worktree.shouldOpenOnClone',
  noYesWindowOptions.no
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
  shouldOpenNewWindowOnSwitch,
  shouldOpenNewWindowOnCreate,
  shouldOpenOnRename,
  shouldPushBranchAutomatically,
  loggingLevel,
  cloneBaseDirectory,
  shouldOpenOnClone,

  // Add
  baseDirectory,
  shouldIncludeRemoteBranches,
  shouldPruneBranches,
  shouldOpenOnAdd,

  // Remove
  shouldRemoveBranch,
  shouldRemoveMultiple,
};
