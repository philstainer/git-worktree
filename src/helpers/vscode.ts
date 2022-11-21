import type { ILoggingOptionValue, IWorktreeWithHash } from '#/@types/worktree';
import {
  APP_NAME,
  loggingOptionValue,
  OPEN_ISSUE_URL,
} from '#/config/constants';
import { commands, env, Uri, window, workspace } from 'vscode';
import settings from '../config/settings';
import { getRemoteBranches, validateBranchName } from './git';
import { getWorktrees } from './worktree/getWorktrees';

export const openVscodeInstance = async (
  path: string,
  forceNewWindow?: boolean
) => {
  commands.executeCommand('vscode.openFolder', Uri.file(path), {
    forceNewWindow: forceNewWindow ?? false,
  });
};

export const openBrowser = async (url = '') => {
  return env.openExternal(Uri.parse(url));
};

export const raiseIssue = async (errorMessage?: string) => {
  if (!errorMessage) return;

  const buttonName = 'Open new Issue';

  const answer = await window.showErrorMessage(
    `${APP_NAME}: ${errorMessage}`,
    buttonName
  );

  if (answer !== buttonName) return;

  const error = `\n\n---------------- Error Message ----------------\n\n${errorMessage}`;

  const url = `${OPEN_ISSUE_URL}/new?body=${error}`;

  await openBrowser(url);
};

const isEnableToLog = (level: ILoggingOptionValue, wantedLevel: number) => {
  let isAbleToLog = false;

  if (level <= wantedLevel) isAbleToLog = true;

  return isAbleToLog;
};

export const showUserMessage = async (
  type: 'Error' | 'Warn' | 'Info',
  message: string,
  ...other: any[]
) => {
  const formattedMessage = `${APP_NAME}: ${message}`;

  if (type === 'Error') {
    if (!isEnableToLog(settings.loggingLevel, loggingOptionValue.error)) return;
    return window.showErrorMessage(formattedMessage, ...other);
  }

  if (type === 'Warn') {
    if (!isEnableToLog(settings.loggingLevel, loggingOptionValue.warn)) return;
    return window.showWarningMessage(formattedMessage, ...other);
  }

  if (!isEnableToLog(settings.loggingLevel, loggingOptionValue.info)) return;
  return window.showInformationMessage(formattedMessage, ...other);
};

export const getUniqueWorktreeName = async ({
  placeHolder,
  prompt,
  value,
  worktrees,
  remoteWorktrees,
}: {
  placeHolder?: string;
  prompt?: string;
  value?: string;
  worktrees?: IWorktreeWithHash[];
  remoteWorktrees?: string[];
}) => {
  const lWorktrees = worktrees ? worktrees : await getWorktrees();
  const rWorktrees = remoteWorktrees
    ? remoteWorktrees
    : await getRemoteBranches();

  return window.showInputBox({
    placeHolder,
    prompt,
    ignoreFocusOut: settings.shouldCloseOnBlur,
    value,
    validateInput: async (value) => {
      const text = value?.trim();

      if (lWorktrees.find(({ worktree }) => worktree === text))
        return `Worktree ${text} already exists`;

      const validateBranch = await validateBranchName(text);
      if (!validateBranch) return `Invalid name for a branch '${text}'`;

      if (rWorktrees.find((worktree) => worktree === text))
        return `Worktree ${text} already exists on remote`;

      return null;
    },
  });
};

export const getVSCodeSetting = <A, T>(name: string, defaultValue: T): T =>
  workspace.getConfiguration().get(name) ?? defaultValue;
