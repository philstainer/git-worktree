export const APP_NAME = 'Git Worktree';

export const BARE_REPOSITORY = 'bare';

export const OPEN_ISSUE_URL =
  'https://github.com/philstainer/git-worktree/issues';

export const noYesAskOptions = {
  no: 'No',
  yes: 'Yes',
  ask: 'Ask',
} as const;

export const noYesWindowOptions = {
  ...noYesAskOptions,
  newWindow: 'New Window',
} as const;
