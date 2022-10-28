import { throwIfNotRepo } from '#/helpers/git';
import { getWorktrees } from '#/src/helpers/worktree/list';
import { moveIntoWorktree } from '../helpers/worktree/moveIntoWorktree';
import { selectWorktree } from '../helpers/worktree/utils';

const branches = ['Create new branch', 'explorer', 'explorer'];

export const list = async () => {
  await throwIfNotRepo();

  const worktrees = await getWorktrees();

  // const filtered = await getCurrentBranchName();

  const worktree = await selectWorktree(worktrees);

  if (!worktree) return;

  await moveIntoWorktree(worktree.detail);
};

// const branch = await vscode.window.showQuickPick(branches, {
//   placeHolder: 'Create new branch or select remote branch',
// });

// if (branch === branches[0]) {
//   // Create new branch
//   const branch = await vscode.window.showInputBox({
//     placeHolder: 'Enter the new branch name',
//   });

//   vscode.window
//     .showInformationMessage(
//       `Should push branch: ${branch} to remote?`,
//       'Yes',
//       'No'
//     )
//     .then((answer) => console.log({ answer }));

//   vscode.window.showInformationMessage(`Creating branch: ${branch}`);

//   return;
// }

// vscode.window.showInformationMessage(`branch: ${branch}`);
