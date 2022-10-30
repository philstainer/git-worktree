import { throwIfNotRepo } from '#/helpers/git';
import { raiseIssue } from '../helpers/vscode';
import { getWorktrees } from '../helpers/worktree/getWorktrees';
import { pruneWorktrees } from '../helpers/worktree/pruneWorktrees';
import { removeWorktree } from '../helpers/worktree/removeWorktree';
import { selectWorktree } from '../helpers/worktree/selectWorktree';

export const removeMany = async () => {
  try {
    await throwIfNotRepo();

    const worktrees = await getWorktrees();

    const worktree = await selectWorktree(worktrees, true);

    if (!Array.isArray(worktree)) return;
    if (!worktree?.length) return;

    await Promise.all(worktree.map((worktree) => removeWorktree(worktree)));
    await pruneWorktrees();
  } catch (e: any) {
    await raiseIssue(e?.message);
  }
};