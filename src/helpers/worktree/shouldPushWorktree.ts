import { INoYesWindowOption, SelectedWorktree } from '#/@types/worktree';
import { noYesWindowOptions } from '#/src/config/constants';
import { getRemoteOrigin, pushNewBranchToRemote } from '../git';
import { showUserMessage } from '../vscode';

export const shouldPushWorktree = async (
  worktree: SelectedWorktree,
  option: INoYesWindowOption
) => {
  const hasRemote = await getRemoteOrigin();
  if (!hasRemote)
    return showUserMessage('Warn', 'This repository has no remote setup');

  if (option === noYesWindowOptions.no) return;

  if (option === noYesWindowOptions.ask) {
    const answer = await showUserMessage(
      'Info',
      `Do you move into '${worktree.branch}' worktree?`,
      noYesWindowOptions.yes,
      noYesWindowOptions.newWindow,
      noYesWindowOptions.no
    );

    if (!answer) return;
    if (answer === noYesWindowOptions.no) return;

    return pushNewBranchToRemote(worktree.path);
  }

  pushNewBranchToRemote(worktree.path);
};
