import { window } from 'vscode';
import settings from '../config/settings';
import {
  fetch,
  getRemoteBranches,
  removeLocalBranchesThatDoNotExistOnRemoteRepository,
  throwIfNotRepository,
} from '../helpers/git';
import {
  getUniqueWorktreeName,
  raiseIssue,
  showUserMessage,
} from '../helpers/vscode';
import { addNewWorktree } from '../helpers/worktree/addNewWorktree';
import { addRemoteWorktree } from '../helpers/worktree/addRemoteWorktree';
import { getWorktrees } from '../helpers/worktree/getWorktrees';

const createWorktreeOption = 'Create new worktree';

export const add = async () => {
  try {
    await throwIfNotRepository();

    await fetch();

    if (settings.shouldPruneBranches)
      await removeLocalBranchesThatDoNotExistOnRemoteRepository();

    const [localWorktrees, remoteBranches] = await Promise.all([
      getWorktrees(),
      getRemoteBranches(),
    ]);

    // Filter out remote branches that already exist locally
    const filteredBranches = remoteBranches.filter((worktree) => {
      return !localWorktrees.find(
        (lWorktree) => lWorktree.worktree === worktree
      );
    });

    // Create or select remote branch
    let branch = await window.showQuickPick(
      [createWorktreeOption, ...filteredBranches],
      {
        placeHolder: 'Create new worktree or select remote branch',
      }
    );
    if (!branch)
      return showUserMessage('Warn', 'Aborted as no worktree was selected');

    // Get name for new branch
    if (branch === createWorktreeOption) {
      const newBranch = await getUniqueWorktreeName({
        placeHolder: 'Enter the new worktree name',
        worktrees: localWorktrees,
        remoteWorktrees: remoteBranches,
      });

      if (!newBranch)
        return showUserMessage(
          'Warn',
          "Aborted as worktree wasn't given a name"
        );

      await addNewWorktree(newBranch);
    }

    await addRemoteWorktree(branch);
  } catch (e: any) {
    await raiseIssue(e?.message);
  }
};
