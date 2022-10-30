import { Worktree } from '#/@types/worktree';
import { getWorktrees } from './getWorktrees';

export const existsWorktree = async (
  worktree: string,
  incomingWorktrees?: Worktree[]
) => {
  try {
    const worktrees = incomingWorktrees
      ? incomingWorktrees
      : await getWorktrees();
    const foundWorktree = worktrees.find((wt) => wt.worktree === worktree);

    return !!foundWorktree;
  } catch (e: any) {
    throw Error(e);
  }
};
