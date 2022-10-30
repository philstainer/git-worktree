import { throwIfNotRepo } from '#/helpers/git';
import { raiseIssue } from '../helpers/vscode';
import { getWorktrees } from '../helpers/worktree/getWorktrees';
import { moveIntoWorktree } from '../helpers/worktree/moveIntoWorkspace';
import { selectWorktree } from '../helpers/worktree/selectWorktree';

export const list = async () => {
  try {
    await throwIfNotRepo();

    const worktrees = await getWorktrees();

    const worktree = await selectWorktree(worktrees);

    if (!worktree) return;

    await moveIntoWorktree(worktree.detail);
  } catch (e: any) {
    await raiseIssue(e?.message);
  }
};

// const branches = ['Create new branch', 'explorer', 'explorer'];

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
