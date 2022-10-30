import { SelectedWorktree } from '#/@types/worktree';
import { window } from 'vscode';
import { getWorkspaceFilePath } from '../general';
import { openVscodeInstance } from '../vscode';

export const moveIntoWorktree = async (
  worktree: SelectedWorktree,
  forceNewWindow?: boolean
) => {
  const path = worktree.path;
  const workspaceFilePath = getWorkspaceFilePath();

  if (!workspaceFilePath) {
    openVscodeInstance(path, forceNewWindow);
    return { type: 'folder', path: path };
  }

  window.showErrorMessage('Workspaces are not current supported 🥲');
};
