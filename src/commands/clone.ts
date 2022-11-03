import { window } from 'vscode';
import { raiseIssue } from '../helpers/vscode';

import parseUrl from 'parse-url';
import { resolve } from 'path';
import {
  createDirectory,
  createFile,
  isExistingDirectory,
} from '../helpers/file';
import { cloneBare, fetch } from '../helpers/git';

export const clone = async () => {
  try {
    const cloneUrl = await window.showInputBox({
      placeHolder: '',
      prompt: '',
    });
    if (!cloneUrl) return;

    const parsedUrl = parseUrl(cloneUrl);
    if (!parsedUrl) return;

    const selectFolder = await window.showOpenDialog({
      canSelectFolders: true,
      canSelectFiles: false,
      canSelectMany: false,
    });
    if (!selectFolder?.length) return;

    const path = selectFolder[0].path;

    const repoName = parsedUrl.pathname.split('/')[2].replace('.git', '');

    const newRepoName = await window.showInputBox({
      placeHolder: '',
      prompt: '',
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
    if (!newRepoName) return;

    const newPath = resolve(path, newRepoName);

    await createDirectory(newPath);

    await createFile(resolve(newPath, '.git'), `gitdir: ./.bare`);

    await cloneBare(newPath, parsedUrl.href);

    await fetch(newPath);
  } catch (e: any) {
    await raiseIssue(e?.message);
  }
};
