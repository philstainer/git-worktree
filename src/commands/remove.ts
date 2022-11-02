import { throwIfNotRepository } from '#/helpers/git';
import { raiseIssue } from '../helpers/vscode';
import { getWorktrees } from '../helpers/worktree/getWorktrees';
import { pruneWorktrees } from '../helpers/worktree/pruneWorktrees';
import { removeWorktree } from '../helpers/worktree/removeWorktree';
import { selectWorktree } from '../helpers/worktree/selectWorktree';

export const remove = async () => {
  try {
    await throwIfNotRepository();

    const worktrees = await getWorktrees();

    const worktree = await selectWorktree(worktrees);
    if (!worktree) return;

    await removeWorktree(worktree);

    await pruneWorktrees();

    // await removeBranch(worktree.branch);
  } catch (e: any) {
    await raiseIssue(e?.message);
  }
};
