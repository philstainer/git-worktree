import { IWorktree } from '#/@types/worktree';
import { executeCommand } from '../general';

export const renameWorktree = async (
  { worktree, path }: IWorktree,
  newBranchName: string
) => {
  const newPath = path.slice().replace(`/${worktree}`, `/${newBranchName}`);

  const moveWorktree = `git worktree move ${path} ${newPath}`;
  await executeCommand(moveWorktree);

  const renameBranch = `git -C ${newPath} branch -m ${newBranchName}`;
  await executeCommand(renameBranch);

  return {
    worktree: newBranchName,
    path: newPath,
  };
};
