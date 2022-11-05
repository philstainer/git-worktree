import { executeCommand } from '#/helpers/general';
import { BARE_REPOSITORY } from '#/src/config/constants';
import { getCurrentBranchName } from '../git';
import { removeFirstAndLastCharacter } from '../string';

export const getWorktrees = async (
  withBareRepo = false,
  showCurrentWorktree = false
) => {
  const command = 'git worktree list';

  try {
    const { stdout } = await executeCommand(command);

    const worktrees = await getFilteredWorktrees(
      stdout,
      withBareRepo,
      showCurrentWorktree
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
    .split('\n')
    .filter((str) => str !== '')
    .map((str) => {
      const [path, hash, worktree] = str.split(' ').filter((str) => str !== '');

      return {
        path,
        hash: worktree ? hash : '',
        worktree: removeFirstAndLastCharacter(worktree ? worktree : hash),
      };
    });

  if (showCurrentWorktree)
    splitWorktrees.filter((worktree) => worktree.worktree !== currentWorktree);

  if (!includeBare)
    splitWorktrees = splitWorktrees.filter(
      ({ worktree }) => worktree !== BARE_REPOSITORY
    );

  return splitWorktrees;
};
