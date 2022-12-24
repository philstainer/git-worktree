import type { IWorktree } from '#/@types/worktree';
import { removeBranch, throwIfNotInWorktreeRepository } from '#/helpers/git';
import { ProgressLocation, window } from 'vscode';
import settings from '../config/settings';
import { raiseIssue, showUserMessage } from '../helpers/vscode';
import { getWorktrees } from '../helpers/worktree/getWorktrees';
import { pruneWorktrees } from '../helpers/worktree/pruneWorktrees';
import { removeWorktree } from '../helpers/worktree/removeWorktree';
import { selectWorktree } from '../helpers/worktree/selectWorktree';

export const remove = async () => {
  try {
    await throwIfNotInWorktreeRepository();

    const worktrees = await getWorktrees();
    if (!worktrees.length)
      return showUserMessage('Info', "Couldn't find any worktrees");

    let selectedWorktrees = await selectWorktree(
      worktrees,
      settings.shouldRemoveMultiple
    );
    if (!selectedWorktrees)
      return showUserMessage('Warn', 'Aborted as no worktree was selected');

    if (!Array.isArray(selectedWorktrees))
      selectedWorktrees = [selectedWorktrees];

    await window.withProgress(
      {
        location: ProgressLocation.Window,
        title: 'Removing Worktrees',
        cancellable: false,
      },
      async (progress) => {
        const worktrees = selectedWorktrees as IWorktree[];

        let percentProgress = 0;
        let incrementBy = 100 / worktrees.length;

        progress.report({ increment: percentProgress });

        return Promise.all(
          worktrees.map(async (worktree) => {
            await removeWorktree(worktree);

            percentProgress += incrementBy;

            const currentlyRemoved = (
              worktrees.length -
              (100 - percentProgress) / incrementBy
            ).toFixed();

            progress.report({
              increment: percentProgress,
              message: `${currentlyRemoved}/${worktrees.length}`,
            });
          })
        );
      }
    );

    if (settings.shouldRemoveBranch)
      await removeBranch(selectedWorktrees.map((wt) => wt.worktree));

    await pruneWorktrees();
  } catch (e: any) {
    await raiseIssue(e?.message);
  }
};
