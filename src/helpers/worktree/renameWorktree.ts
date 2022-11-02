import { SelectedWorktree } from '#/@types/worktree';
import { executeCommand } from '../general';

export const renameWorktree = async (
  { branch, path }: SelectedWorktree,
  newBranchName: string
) => {
  const newPath = path.slice().replace(`/${branch}`, `/${newBranchName}`);

  const moveWorktree = `git worktree move ${path} ${newPath}`;
  await executeCommand(moveWorktree);

  const renameBranch = `git -C ${newPath} branch -m ${newBranchName}`;
  await executeCommand(renameBranch);

  return {
    branch: newBranchName,
    path: newPath,
  };
};
