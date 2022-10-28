import { FilteredWorktree } from '#/@types/worktree';
import { executeCommand } from '#/helpers/general';
import { removeFirstAndLastCharacter } from '#/helpers/string';
import { getCurrentBranchName } from '../git';

export const getWorktrees = async (withBareRepo = false) => {
  const listWorktreesCommand = 'git worktree list';

  try {
    const { stdout } = await executeCommand(listWorktreesCommand);

    const worktrees = await getFilteredWorktrees(stdout, withBareRepo);

    return worktrees;
  } catch (e: any) {
    throw Error(e);
  }
};

export const getFilteredWorktrees = async (
  stdout: string,
  includeBare = false
) => {
  const currentWorktree = await getCurrentBranchName();

  const splitWorktrees: FilteredWorktree[] = stdout
    .split('\n')
    .filter((str) => str !== '')
    .map((str) => {
      const splitString = str.split(' ').filter((str) => str !== '');
      if (splitString.length === 3) return splitString as FilteredWorktree;
      return [splitString[0], '', splitString[1]];
    });

  return formatWorktrees(splitWorktrees)
    .filter((worktree) => {
      if (includeBare) return true;

      return worktree.worktree !== 'bare';
    })
    .filter((worktree) => worktree.worktree !== currentWorktree);
};

const formatWorktrees = (splitWorktrees: FilteredWorktree[]) => {
  return splitWorktrees.map((worktree) => ({
    path: worktree[0],
    hash: worktree[1],
    worktree: removeFirstAndLastCharacter(worktree[2]),
  }));
};
