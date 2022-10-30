import { executeCommand } from '../general';

export const pruneWorktrees = async () => {
  const pruneWorktreesCommand = 'git worktree prune';

  try {
    await executeCommand(pruneWorktreesCommand);
  } catch (e: any) {
    throw Error(e);
  }
};
