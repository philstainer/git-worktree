import { IWorktree } from '#/@types/worktree';
import { noYesAskOptions } from '../config/constants';
import settings from '../config/settings';
import {
  fetch,
  getRemoteOrigin,
  pushNewBranchToRemote,
  throwIfNotRepository,
} from '../helpers/git';
import {
  getUniqueWorktreeName,
  raiseIssue,
  showUserMessage,
} from '../helpers/vscode';
import { getWorktrees } from '../helpers/worktree/getWorktrees';
import { renameWorktree } from '../helpers/worktree/renameWorktree';
import { selectWorktree } from '../helpers/worktree/selectWorktree';
import { shouldMoveIntoWorktree } from '../helpers/worktree/shouldMoveIntoWorktree';

export const rename = async () => {
  try {
    await throwIfNotRepository();

    const worktrees = await getWorktrees();
    if (!worktrees.length)
      return showUserMessage('Info', "Couldn't find any worktrees");

    await fetch();

    const worktree = await selectWorktree(worktrees);
    if (!worktree)
      return showUserMessage('Warn', 'Aborted as no worktree was selected');

    const branch = worktree.worktree;
    const newBranchName = await getUniqueWorktreeName({
      placeHolder: 'Enter new name for worktree',
      prompt: `Renaming worktree ${branch}`,
      value: branch,
      worktrees: worktrees,
    });
    if (!newBranchName)
      return showUserMessage('Warn', "Aborted as branch wasn't given a name");

    const renamedWorktree = await renameWorktree(worktree, newBranchName);

    await pushWorktree(renamedWorktree);
    await shouldMoveIntoWorktree(renamedWorktree, settings.openOnRename);
  } catch (e: any) {
    await raiseIssue(e?.message);
  }
};

export const pushWorktree = async (worktree: IWorktree) => {
  const origin = await getRemoteOrigin();
  if (!origin) return;

  if (settings.shouldPushBranchAutomatically === noYesAskOptions.no) return;

  if (settings.shouldPushBranchAutomatically === noYesAskOptions.ask) {
    const answer = await showUserMessage(
      'Info',
      `Do you want to push to '${worktree.worktree}' to remote?`,
      noYesAskOptions.yes,
      'No'
    );

    if (answer !== noYesAskOptions.yes) return;
  }

  await pushNewBranchToRemote(worktree.path);
};
