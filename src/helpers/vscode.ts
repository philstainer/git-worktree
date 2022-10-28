import { shouldOpenNewVscodeWindow } from '#/helpers/settings';
import { commands, Uri } from 'vscode';

export const openVscodeInstance = async (path: string): Promise<void> =>
  commands.executeCommand('vscode.openFolder', Uri.file(path), {
    forceNewWindow: shouldOpenNewVscodeWindow,
  });
