import { throwIfNotRepo } from '#/helpers/git';
import settings from '../config/settings';
import { raiseIssue } from '../helpers/vscode';
import { getWorktrees } from '../helpers/worktree/getWorktrees';
import { moveIntoWorktree } from '../helpers/worktree/moveIntoWorkspace';
import { selectWorktree } from '../helpers/worktree/selectWorktree';

export const list = async () => {
  try {
    await throwIfNotRepo();

    const worktrees = await getWorktrees();

    const worktree = await selectWorktree(worktrees, false);

    if (!worktree) return;

    await moveIntoWorktree(worktree, settings.shouldOpenNewWindowOnSwitch);
  } catch (e: any) {
    await raiseIssue(e?.message);
  }
};
