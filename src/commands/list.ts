import { throwIfNotInWorktreeRepository } from '#/helpers/git';
import settings from '../config/settings';
import { raiseIssue, showUserMessage } from '../helpers/vscode';
import { getWorktrees } from '../helpers/worktree/getWorktrees';
import { selectWorktree } from '../helpers/worktree/selectWorktree';
import { shouldMoveIntoWorktree } from '../helpers/worktree/shouldMoveIntoWorktree';

export const list = async () => {
  try {
    await throwIfNotInWorktreeRepository();

    const worktrees = await getWorktrees();
    if (!worktrees.length)
      return showUserMessage('Info', "Couldn't find any worktrees");

    const worktree = await selectWorktree(worktrees);
    if (!worktree)
      return showUserMessage('Warn', 'Aborted as no worktree was selected');

    await shouldMoveIntoWorktree(worktree, settings.shouldOpenOnSwitch);
  } catch (e: any) {
    await raiseIssue(e?.message);
  }
};
