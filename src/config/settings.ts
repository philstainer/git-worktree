import { getCurrentLoggingLevel } from '../helpers/general';
import { getVSCodeSetting } from '../helpers/vscode';
import { noYesAskOptions, noYesWindowOptions } from './constants';

// General
const shouldPushBranchAutomatically = getVSCodeSetting(
  'gitWorktree.worktree.automatically',
  noYesAskOptions.no
);

const loggingLevel = getCurrentLoggingLevel();

const shouldCloseOnBlur = getVSCodeSetting(
  'gitWorktree.worktree.closeInputOnBlur',
  true
);

const shouldSkipGitHooks = getVSCodeSetting(
  'gitWorktree.worktree.skipGitHooks',
  false
);

// Clone
const cloneBaseDirectory = getVSCodeSetting(
  'gitWorktree.worktree.cloneBaseDirectory',
  './.bare'
);

const openOnClone = getVSCodeSetting(
  'gitWorktree.worktree.openOnClone',
  noYesWindowOptions.yes
);

// Project
const shouldOpenOnProject = getVSCodeSetting(
  'gitWorktree.worktree.openOnProject',
  noYesWindowOptions.yes
);

const shouldSaveProjectsAutomatically = getVSCodeSetting(
  'gitWorktree.worktree.saveProjectsAutomatically',
  noYesAskOptions.no
);

// List
const shouldOpenOnSwitch = getVSCodeSetting(
  'gitWorktree.worktree.openOnSwitch',
  noYesWindowOptions.yes
);

// Add
const baseDirectory = getVSCodeSetting(
  'gitWorktree.worktree.baseDirectory',
  '../'
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
const openOnRename = getVSCodeSetting(
  'gitWorktree.worktree.openOnRename',
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
  shouldCloseOnBlur,
  shouldSkipGitHooks,

  // Clone
  cloneBaseDirectory,
  openOnClone,

  // Project
  shouldOpenOnProject,
  shouldSaveProjectsAutomatically,

  // List
  shouldOpenOnSwitch,

  // Add
  baseDirectory,
  shouldIncludeRemoteBranches,
  shouldPruneBranches,
  shouldOpenOnAdd,

  //Rename
  openOnRename,

  // Remove
  shouldRemoveBranch,
  shouldRemoveMultiple,
};
