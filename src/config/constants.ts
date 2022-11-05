export const APP_NAME = 'Git Worktree';

export const BARE_REPOSITORY = 'bare';

export const OPEN_ISSUE_URL =
  'https://github.com/philstainer/git-worktree/issues';

export const BARE_REPOSITORY_REMOTE_ORIGIN_FETCH =
  '+refs/heads/*:refs/remotes/origin/*';

export const noYesAskOptions = {
  no: 'No',
  yes: 'Yes',
  ask: 'Ask',
} as const;

export const noYesWindowOptions = {
  ...noYesAskOptions,
  newWindow: 'New Window',
} as const;

export const loggingOptions = {
  error: 'Error',
  warn: 'Warn',
  info: 'Info',
} as const;

export const loggingOptionValue = {
  error: 10,
  warn: 5,
  info: 0,
} as const;
