import { window } from 'vscode';
import { raiseIssue, showUserMessage } from '../helpers/vscode';

import parseUrl from 'parse-url';
import { resolve } from 'path';
import settings from '../config/settings';
import {
  createDirectory,
  createFile,
  isExistingDirectory,
} from '../helpers/file';
import { updateGlobalProjects } from '../helpers/general';
import { cloneBare, setUpBareRepositoryFetch } from '../helpers/git';
import { shouldMoveIntoWorktree } from '../helpers/worktree/shouldMoveIntoWorktree';

export const clone = async () => {
  try {
    const cloneUrl = await window.showInputBox({
      placeHolder: 'Git repository url',
      prompt: 'Please enter a valid url to clone',
    });
    if (!cloneUrl)
      return showUserMessage('Warn', 'Aborted as no url was given');

    const parsedUrl = parseUrl(cloneUrl);
    if (!parsedUrl)
      return showUserMessage('Error', 'Failed to clone as url is malformed');

    const selectFolder = await window.showOpenDialog({
      canSelectFolders: true,
      canSelectFiles: false,
      canSelectMany: false,
    });
    if (!selectFolder?.length)
      return showUserMessage('Warn', 'Aborted as no folder was selected');

    const path = selectFolder[0].path;
    const repoName = parsedUrl.pathname.split('/')[2].replace('.git', '');

    const newRepoName = await window.showInputBox({
      placeHolder: 'Repository name',
      prompt: 'Enter new name for repository',
      value: repoName,
      validateInput: async (value) => {
        const text = value?.trim();

        const existingDirectory = await isExistingDirectory(
          resolve(path, text)
        );

        if (existingDirectory)
          return `Directory already exists: '${path}/${text}'`;

        return null;
      },
    });
    if (!newRepoName)
      return showUserMessage('Warn', "Aborted as repo wasn't given a name");

    const newPath = resolve(path, newRepoName);

    await createDirectory(newPath);

    await cloneBare(newPath, parsedUrl.href, settings.cloneBaseDirectory);

    if (!['', '.', './'].includes(settings.cloneBaseDirectory))
      await createFile(
        resolve(newPath, '.git'),
        `gitdir: ${settings.cloneBaseDirectory}`
      );

    await setUpBareRepositoryFetch(newPath);

    const worktree = { worktree: newRepoName, path: newPath };

    await updateGlobalProjects(worktree);

    await shouldMoveIntoWorktree(worktree, settings.openOnClone);
  } catch (e: any) {
    await raiseIssue(e?.message);
  }
};
