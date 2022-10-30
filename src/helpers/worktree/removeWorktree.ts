import { SelectedWorktree } from '#/@types/worktree';
import { APP_NAME } from '#/src/config/constants';
import { window } from 'vscode';
import { executeCommand } from '../general';

const untrackedOrModifiedFilesError =
  'contains modified or untracked files, use --force to delete it';

export const removeWorktree = async ({ branch }: SelectedWorktree) => {
  const command = `git worktree remove ${branch}`;

  try {
    await executeCommand(command);
    await window.showInformationMessage(
      `Worktree named '${branch}' was removed successfully`
    );
  } catch (e: any) {
    const errorMessage = e.message;

    if (!errorMessage.includes(untrackedOrModifiedFilesError))
      throw new Error(e);

    const buttonName = 'Force Delete';
    const answer = await window.showInformationMessage(
      `${APP_NAME}: ${errorMessage}`,
      buttonName
    );

    if (answer !== buttonName) return;

    const forceCommand = `git worktree remove -f ${branch}`;
    try {
      await executeCommand(forceCommand);
      await window.showInformationMessage(
        `Worktree named '${branch}' was removed successfully`
      );
    } catch (err: any) {
      throw Error(err);
    }
  }
};
