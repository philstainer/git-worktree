import { window } from 'vscode';
import { getWorkspaceFilePath } from '../general';
import { openVscodeInstance } from '../vscode';

export const moveIntoWorktree = async (worktreePath: string) => {
  const workspaceFilePath = getWorkspaceFilePath();

  if (!workspaceFilePath) {
    openVscodeInstance(worktreePath);
    return { type: 'folder', path: worktreePath };
  }

  window.showErrorMessage('Workspaces are not current supported 🥲');
};
