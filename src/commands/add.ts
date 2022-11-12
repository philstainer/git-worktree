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
import { shouldMoveIntoWorktree } from '../helpers/worktree/shouldMoveIntoWorktree';
import { pushWorktree } from './rename';

const createWorktreeOption = 'Create new worktree';

export const add = async () => {
  try {
    await throwIfNotRepository();

    await fetch();

    if (settings.shouldPruneBranches)
      await removeLocalBranchesThatDoNotExistOnRemoteRepository();

    const [localWorktrees, remoteBranches] = await Promise.all([
      getWorktrees(false, true),
      settings.shouldIncludeRemoteBranches ? getRemoteBranches() : [],
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

    let worktree = null;

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

      worktree = await addNewWorktree(newBranch);

      await pushWorktree(worktree);
    } else {
      worktree = await addRemoteWorktree(branch);
    }

    await shouldMoveIntoWorktree(worktree, settings.shouldOpenOnAdd);
  } catch (e: any) {
    await raiseIssue(e?.message);
  }
};
