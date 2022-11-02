import { pushWorktree } from '#/src/commands/rename';
import { executeCommand } from '../general';
import { checkIfBranchExistsOnRemote } from '../git';
import { calculateNewWorktreePath } from './calculateNewWorktreePath';
import { moveIntoWorktree } from './moveIntoWorkspace';

export const addNewWorktree = async (newBranch: string) => {
  const isExistingBranch = await checkIfBranchExistsOnRemote(newBranch);
  if (isExistingBranch)
    throw new Error(`Branch '${newBranch}' already exists.`);

  const newWorktreePath = await calculateNewWorktreePath(newBranch);

  const newWorktree = { branch: newBranch, path: newWorktreePath };

  try {
    const worktreeAddCommand = `git worktree add -b ${newBranch} ${newWorktreePath}`;
    await executeCommand(worktreeAddCommand);

    const pullCommand = `git -C ${newWorktreePath} pull`;
    await executeCommand(pullCommand);

    await pushWorktree(newWorktree);
    await moveIntoWorktree(newWorktree);
  } catch (e: any) {
    throw Error(e);
  }
};
