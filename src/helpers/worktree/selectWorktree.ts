import { Worktree } from '#/@types/worktree';
import { window } from 'vscode';

export const selectWorktree = async (
  worktrees: Worktree[],
  canPickMany = false
) => {
  if (worktrees.length === 0) return;

  const items = worktrees.map(({ worktree, path }) => ({
    label: worktree,
    detail: path,
  }));

  const worktree = await window.showQuickPick(items, {
    matchOnDetail: true,
    canPickMany: canPickMany,
  });

  if (!worktree) return null;

  return { branch: worktree.label, path: worktree.detail };
};
