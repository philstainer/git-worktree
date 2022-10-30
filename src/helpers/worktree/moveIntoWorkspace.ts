import { SelectedWorktree } from '#/@types/worktree';
import { window } from 'vscode';
import { getWorkspaceFilePath } from '../general';
import { openVscodeInstance } from '../vscode';

export const moveIntoWorktree = async (
  worktree: SelectedWorktree,
  forceNewWindow?: boolean
) => {
  const worktreePath = worktree.detail;
  const workspaceFilePath = getWorkspaceFilePath();

  if (!workspaceFilePath) {
    openVscodeInstance(worktreePath, forceNewWindow);
    return { type: 'folder', path: worktreePath };
  }

  window.showErrorMessage('Workspaces are not current supported 🥲');
};
