import { SelectedWorktree } from '#/@types/worktree';
import { noYesAskOptions, noYesWindowOptions } from '../config/constants';
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
import { moveIntoWorktree } from '../helpers/worktree/moveIntoWorkspace';
import { renameWorktree } from '../helpers/worktree/renameWorktree';
import { selectWorktree } from '../helpers/worktree/selectWorktree';

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

    const branch = worktree.branch;
    const newBranchName = await getUniqueWorktreeName({
      placeHolder: `Rename branch: ${branch}`,
      prompt: `Rename worktree ${branch}`,
      value: branch,
      worktrees: worktrees,
    });
    if (!newBranchName)
      return showUserMessage('Warn', "Aborted as branch wasn't given a name");

    const renamedWorktree = await renameWorktree(worktree, newBranchName);

    await pushWorktree(renamedWorktree);
    await openWorktree(renamedWorktree);
  } catch (e: any) {
    await raiseIssue(e?.message);
  }
};

export const pushWorktree = async (worktree: SelectedWorktree) => {
  const origin = await getRemoteOrigin();
  if (!origin) return;

  if (settings.shouldPushBranchAutomatically === noYesAskOptions.no) return;

  if (settings.shouldPushBranchAutomatically === noYesAskOptions.ask) {
    const answer = await showUserMessage(
      'Info',
      `Do you want to push to '${worktree.branch}' to remote?`,
      noYesAskOptions.yes,
      'No'
    );

    if (answer !== noYesAskOptions.yes) return;
  }

  await pushNewBranchToRemote(worktree.path);
};

const openWorktree = async (worktree: SelectedWorktree) => {
  if (settings.shouldOpenOnRename === noYesWindowOptions.no) return;

  if (settings.shouldOpenOnRename === noYesWindowOptions.ask) {
    const answer = await showUserMessage(
      'Info',
      `Do you move into '${worktree.branch}' worktree?`,
      noYesWindowOptions.yes,
      noYesWindowOptions.newWindow,
      noYesWindowOptions.no
    );

    if (!answer) return;
    if (answer === noYesWindowOptions.no) return;

    return await moveIntoWorktree(
      worktree,
      answer === noYesWindowOptions.yes ? false : true
    );
  }

  await moveIntoWorktree(
    worktree,
    settings.shouldOpenOnRename === noYesWindowOptions.yes ? false : true
  );
};
