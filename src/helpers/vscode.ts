import { Worktree } from '#/@types/worktree';
import { APP_NAME, OPEN_ISSUE_URL } from '#/config/constants';
import { commands, env, Uri, window } from 'vscode';
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

export const showUserMessage = async (
  type: 'Error' | 'Info',
  message: string,
  ...other: any[]
) => {
  if (type === 'Error')
    return window.showErrorMessage(`${APP_NAME}: ${message}`, ...other);

  return window.showInformationMessage(`${APP_NAME}: ${message}`, ...other);
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
  worktrees?: Worktree[];
  remoteWorktrees?: string[];
}) => {
  const lWorktrees = worktrees ? worktrees : await getWorktrees();
  const rWorktrees = remoteWorktrees
    ? remoteWorktrees
    : await getRemoteBranches();

  return window.showInputBox({
    placeHolder,
    prompt,
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
