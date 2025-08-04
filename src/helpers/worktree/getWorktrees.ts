import { executeCommand } from '#/helpers/general';
import { getCurrentBranchName, isInsideBareRepository } from '../git';

export const getWorktrees = async (
  withBareRepo = false,
  showCurrentWorktree = false
) => {
  const command = 'git worktree list --porcelain';

  try {
    const { stdout } = await executeCommand(command);

    const isRootDirectory = await isInsideBareRepository();

    const worktrees = await getFilteredWorktrees(
      stdout,
      withBareRepo,
      isRootDirectory || showCurrentWorktree
    );

    return worktrees;
  } catch (e: any) {
    throw Error(e);
  }
};

const getFilteredWorktrees = async (
  stdout: string,
  includeBare = false,
  showCurrentWorktree = false
) => {
  const currentWorktree = await getCurrentBranchName();

  let splitWorktrees = stdout
    .trim()
    .split('\n\n')
    .map((path): { path: string; hash: string; worktree: string } => {
      let worktree: string | null = null;
      let commit: string | null = null;
      let branch: string | null = null;

      path.split('\n').forEach((line) => {
        if (line.startsWith('worktree ')) {
          worktree = line.slice(9);
        } else if (line.startsWith('HEAD ')) {
          commit = line.slice(5, 12); // Short commit hash
        } else if (line.startsWith('branch refs/heads/')) {
          branch = line.slice(18);
        }
      });

      if (!worktree) throw new Error('Missing worktree!');

      return {
        path: worktree ?? '',
        hash: commit ?? '',
        worktree: branch ?? commit ?? '',
      };
    });

  if (!showCurrentWorktree)
    splitWorktrees = splitWorktrees.filter(
      (worktree) => worktree.worktree !== currentWorktree
    );

  if (!includeBare)
    // Filter out bare worktree and worktrees that are not in the bare directory e.g have been manually moved
    splitWorktrees = splitWorktrees.filter(
      ({ path }) => !path.endsWith('.bare')
    );

  return splitWorktrees;
};
