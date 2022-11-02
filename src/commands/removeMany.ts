import { removeBranch, throwIfNotRepository } from '#/helpers/git';
import { raiseIssue } from '../helpers/vscode';
import { getWorktrees } from '../helpers/worktree/getWorktrees';
import { pruneWorktrees } from '../helpers/worktree/pruneWorktrees';
import { removeWorktree } from '../helpers/worktree/removeWorktree';
import { selectWorktree } from '../helpers/worktree/selectWorktree';

export const removeMany = async () => {
  try {
    await throwIfNotRepository();

    const worktrees = await getWorktrees();

    const selectedWorktrees = await selectWorktree(worktrees, true);

    if (!selectedWorktrees?.length) return;

    await Promise.all(
      selectedWorktrees.map((worktree) => removeWorktree(worktree))
    );
    await Promise.all(selectedWorktrees.map((wt) => removeBranch(wt.branch)));
    await pruneWorktrees();
  } catch (e: any) {
    await raiseIssue(e?.message);
  }
};
