import { SelectedWorktree } from '#/@types/worktree';
import { executeCommand } from '../general';
import { setBranchUpStream } from '../git';

export const renameWorktree = async (
  { branch, path }: SelectedWorktree,
  newBranchName: string
) => {
  const newPath = path.slice().replace(`/${branch}`, `/${newBranchName}`);

  const moveWorktree = `git worktree move ${path} ${newPath}`;
  await executeCommand(moveWorktree);

  const renameBranch = `git branch -m ${newBranchName}`;
  await executeCommand(renameBranch, { cwd: newPath });

  await setBranchUpStream(newBranchName, newPath);

  return {
    branch: newBranchName,
    path: newPath,
  };
};
