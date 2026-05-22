import type { IWorktree } from '#/@types/worktree';
import { APP_NAME } from '#/src/config/constants';
import { executeCommand } from '../general';
import { showUserMessage } from '../vscode';

const untrackedOrModifiedFilesError =
  'contains modified or untracked files, use --force to delete it';
const submodulesInWorktreeError =
  'working trees containing submodules cannot be moved or removed';

export const removeWorktree = async ({ worktree, path }: IWorktree) => {
  const command = `git worktree remove "${path}"`;

  try {
    await executeCommand(command);
    showUserMessage(
      'Info',
      `Worktree named '${worktree}' was removed successfully`
    );
  } catch (e: any) {
    const errorMessage = e.message;

    const forceCommand = `git worktree remove -f "${worktree}"`;

    if (errorMessage.includes(untrackedOrModifiedFilesError)) {
      const buttonName = 'Force Delete';
      const answer = await showUserMessage(
        'Info',
        `${APP_NAME}: ${errorMessage}`,
        buttonName
      );

      if (answer !== buttonName) return;

      try {
        await executeCommand(forceCommand);
        showUserMessage(
          'Info',
          `Worktree named '${worktree}' was removed successfully`
        );
        return;
      } catch (err: any) {
        throw Error(err);
      }
    }

    if (errorMessage.includes(submodulesInWorktreeError)) {
      const deinitSubmodulesCommand = `git -C "${path}" submodule deinit -f --all`;

      try {
        await executeCommand(deinitSubmodulesCommand, { cwd: path });
        await executeCommand(forceCommand);
        showUserMessage(
          'Info',
          `Worktree named '${worktree}' was removed successfully`
        );
        return;
      } catch (err: any) {
        throw Error(err);
      }
    }

    throw new Error(e);
  }
};
