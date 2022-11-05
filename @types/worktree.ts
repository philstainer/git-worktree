import {
  loggingOptions,
  loggingOptionValue,
  noYesAskOptions,
  noYesWindowOptions,
} from '#/src/config/constants';

export type IWorktree = {
  path: string;
  worktree: string;
};
export type IWorktreeWithHash = IWorktree & { hash: string };

export type INoYesOption = typeof noYesAskOptions[keyof typeof noYesAskOptions];
export type INoYesWindowOption =
  typeof noYesWindowOptions[keyof typeof noYesWindowOptions];

export type ILoggingOption = typeof loggingOptions[keyof typeof loggingOptions];
export type ILoggingOptionValue =
  typeof loggingOptionValue[keyof typeof loggingOptionValue];
