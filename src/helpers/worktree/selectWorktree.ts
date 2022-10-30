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

  return window.showQuickPick(items, {
    matchOnDetail: true,
    canPickMany: canPickMany,
  });
};
