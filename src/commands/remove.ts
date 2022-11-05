import { removeBranch, throwIfNotRepository } from '#/helpers/git';
import settings from '../config/settings';
import { raiseIssue, showUserMessage } from '../helpers/vscode';
import { getWorktrees } from '../helpers/worktree/getWorktrees';
import { pruneWorktrees } from '../helpers/worktree/pruneWorktrees';
import { removeWorktree } from '../helpers/worktree/removeWorktree';
import { selectWorktree } from '../helpers/worktree/selectWorktree';

export const remove = async () => {
  try {
    await throwIfNotRepository();

    const worktrees = await getWorktrees();
    if (!worktrees.length)
      return showUserMessage('Info', "Couldn't find any worktrees");

    const worktree = await selectWorktree(worktrees);
    if (!worktree)
      return showUserMessage('Warn', 'Aborted as no worktree was selected');

    await removeWorktree(worktree);

    if (settings.shouldRemoveBranch) await removeBranch(worktree.branch);

    await pruneWorktrees();
  } catch (e: any) {
    await raiseIssue(e?.message);
  }
};
