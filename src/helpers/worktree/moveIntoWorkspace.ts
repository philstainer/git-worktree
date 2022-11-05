import { SelectedWorktree } from '#/@types/worktree';
import { getWorkspaceFilePath } from '../general';
import { openVscodeInstance, showUserMessage } from '../vscode';

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

  showUserMessage('Error', 'Workspaces are not current supported 🥲');
};
