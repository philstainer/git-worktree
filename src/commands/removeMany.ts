import { removeBranch, throwIfNotRepository } from '#/helpers/git';
import settings from '../config/settings';
import { raiseIssue, showUserMessage } from '../helpers/vscode';
import { getWorktrees } from '../helpers/worktree/getWorktrees';
import { pruneWorktrees } from '../helpers/worktree/pruneWorktrees';
import { removeWorktree } from '../helpers/worktree/removeWorktree';
import { selectWorktree } from '../helpers/worktree/selectWorktree';

export const removeMany = async () => {
  try {
    await throwIfNotRepository();

    const worktrees = await getWorktrees();
    if (!worktrees.length)
      return showUserMessage('Info', "Couldn't find any worktrees");

    const selectedWorktrees = await selectWorktree(worktrees, true);
    if (!selectedWorktrees?.length)
      return showUserMessage('Warn', 'Aborted as no worktree was selected');

    await Promise.all(
      selectedWorktrees.map((worktree) => removeWorktree(worktree))
    );

    if (settings.shouldRemoveBranch)
      await removeBranch(selectedWorktrees.map((wt) => wt.branch));

    await pruneWorktrees();
  } catch (e: any) {
    await raiseIssue(e?.message);
  }
};
