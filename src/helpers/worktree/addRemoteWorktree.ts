import { executeCommand } from '../general';
import { checkIfBranchExistsOnRemote } from '../git';
import { calculateNewWorktreePath } from './calculateNewWorktreePath';
import { moveIntoWorktree } from './moveIntoWorkspace';

export const addRemoteWorktree = async (remoteBranch: string) => {
  const isExistingBranch = await checkIfBranchExistsOnRemote(remoteBranch);
  if (!isExistingBranch)
    throw new Error(`Branch '${remoteBranch}' doesn't exists.`);

  const newWorktreePath = await calculateNewWorktreePath(remoteBranch);

  const newWorktree = { branch: remoteBranch, path: newWorktreePath };

  try {
    const worktreeAddCommand = `git worktree add --track -b ${remoteBranch} ${newWorktreePath} origin/${remoteBranch}`;
    await executeCommand(worktreeAddCommand);

    const pullCommand = `git -C ${newWorktreePath} pull`;
    await executeCommand(pullCommand);

    await moveIntoWorktree(newWorktree);
  } catch (e: any) {
    throw Error(e);
  }
};
