import { window } from 'vscode';

type Worktree = { path: string; hash: string; worktree: string };
type WorktreeList = Array<Worktree>;
type SelectedWorktree = { label: string; detail: string };

export const selectWorktree = async (worktrees: WorktreeList) =>
  window.showQuickPick(
    worktrees.map((wt) => ({ label: wt.worktree, detail: wt.path })),
    {
      matchOnDetail: true,
    }
  );
