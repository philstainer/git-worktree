import { executeCommand } from '../general';
import { checkIfBranchExistsOnRemote } from '../git';
import { calculateNewWorktreePath } from './calculateNewWorktreePath';

export const addRemoteWorktree = async (remoteBranch: string) => {
  const isExistingBranch = await checkIfBranchExistsOnRemote(remoteBranch);
  if (!isExistingBranch)
    throw new Error(`Branch '${remoteBranch}' doesn't exists.`);

  const newWorktreePath = await calculateNewWorktreePath(remoteBranch);

  const newWorktree = { worktree: remoteBranch, path: newWorktreePath };

  try {
    const worktreeAddCommand = `git worktree add --track -B ${remoteBranch} ${newWorktreePath} origin/${remoteBranch}`;
    await executeCommand(worktreeAddCommand);

    const pullCommand = `git -C ${newWorktreePath} pull`;
    await executeCommand(pullCommand);

    return newWorktree;
  } catch (e: any) {
    throw Error(e);
  }
};
