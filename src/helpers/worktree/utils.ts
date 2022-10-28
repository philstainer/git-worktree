import { Worktree } from '#/@types/worktree';
import { window } from 'vscode';

export const selectWorktree = async (worktrees: Worktree[]) => {
  if (worktrees.length === 0) return false;

  return window.showQuickPick(
    worktrees.map(({ worktree, path }) => ({ label: worktree, detail: path })),
    {
      matchOnDetail: true,
    }
  );
};
