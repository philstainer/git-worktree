import { INoYesWindowOption, IWorktree } from '#/@types/worktree';
import { noYesWindowOptions } from '#/src/config/constants';
import { showUserMessage } from '../vscode';
import { moveIntoWorktree } from './moveIntoWorkspace';

export const shouldMoveIntoWorktree = async (
  worktree: IWorktree,
  option: INoYesWindowOption
) => {
  if (option === noYesWindowOptions.no) return;

  if (option === noYesWindowOptions.ask) {
    const answer = await showUserMessage(
      'Info',
      `Do you move into '${worktree.worktree}' worktree?`,
      noYesWindowOptions.yes,
      noYesWindowOptions.newWindow,
      noYesWindowOptions.no
    );

    if (!answer) return;
    if (answer === noYesWindowOptions.no) return;

    return moveIntoWorktree(
      worktree,
      answer === noYesWindowOptions.yes ? false : true
    );
  }

  return moveIntoWorktree(
    worktree,
    option === noYesWindowOptions.yes ? false : true
  );
};
