import { executeCommand } from '../general';
import { checkIfBranchExistsOnRemote } from '../git';
import { calculateNewWorktreePath } from './calculateNewWorktreePath';

export const addNewWorktree = async (
  newBranch: string,
  trackingBranch: string
) => {
  const isExistingBranch = await checkIfBranchExistsOnRemote(newBranch);
  if (isExistingBranch)
    throw new Error(`Branch '${newBranch}' already exists.`);

  const newWorktreePath = await calculateNewWorktreePath(newBranch);

  const newWorktree = { worktree: newBranch, path: newWorktreePath };

  try {
    const addCommand = `git worktree add --track -B ${newBranch} ${newWorktreePath} origin/${trackingBranch}`;

    await executeCommand(addCommand);

    return newWorktree;
  } catch (e: any) {
    throw Error(e);
  }
};
