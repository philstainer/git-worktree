import { APP_NAME, OPEN_ISSUE_URL } from '#/config/constants';
import { shouldOpenNewVscodeWindow } from '#/config/settings';
import { commands, env, Uri, window } from 'vscode';

export const openVscodeInstance = async (path: string) => {
  commands.executeCommand('vscode.openFolder', Uri.file(path), {
    forceNewWindow: shouldOpenNewVscodeWindow,
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
