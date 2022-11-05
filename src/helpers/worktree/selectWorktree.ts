import type { IWorktree } from '#/@types/worktree';
import { window } from 'vscode';

export const selectWorktree = async <T extends boolean = false>(
  worktrees: IWorktree[],
  multiple?: T
): Promise<
  T extends true ? IWorktree[] | undefined : IWorktree | undefined
> => {
  if (worktrees.length === 0) return;

  const canPickMany = multiple ?? false;

  const items = worktrees.map(({ worktree, path }) => ({
    label: worktree,
    detail: path,
  }));

  if (!canPickMany) {
    const worktree = await window.showQuickPick(items, {
      matchOnDetail: true,
      canPickMany,
    });

    if (!worktree) return;

    return { worktree: worktree.label, path: worktree.detail } as any;
  }

  const worktree = await window.showQuickPick(items, {
    matchOnDetail: true,
    canPickMany,
  });

  if (!worktree) return;

  return worktree.map((worktree) => ({
    branch: worktree.label,
    path: worktree.detail,
  })) as any;
};
