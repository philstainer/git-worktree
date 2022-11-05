import { IWorktree } from '#/@types/worktree';
import { APP_NAME } from '#/src/config/constants';
import { executeCommand } from '../general';
import { showUserMessage } from '../vscode';

const untrackedOrModifiedFilesError =
  'contains modified or untracked files, use --force to delete it';

export const removeWorktree = async ({ worktree, path }: IWorktree) => {
  const command = `git worktree remove ${path}`;

  try {
    await executeCommand(command);
    showUserMessage(
      'Info',
      `Worktree named '${worktree}' was removed successfully`
    );
  } catch (e: any) {
    const errorMessage = e.message;

    if (!errorMessage.includes(untrackedOrModifiedFilesError))
      throw new Error(e);

    const buttonName = 'Force Delete';
    const answer = await showUserMessage(
      'Info',
      `${APP_NAME}: ${errorMessage}`,
      buttonName
    );

    if (answer !== buttonName) return;

    const forceCommand = `git worktree remove -f ${worktree}`;
    try {
      await executeCommand(forceCommand);
      await showUserMessage(
        'Info',
        `Worktree named '${worktree}' was removed successfully`
      );
    } catch (err: any) {
      throw Error(err);
    }
  }
};
