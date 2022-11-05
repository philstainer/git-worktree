import { INoYesOption, IWorktree } from '#/@types/worktree';
import { noYesWindowOptions } from '#/src/config/constants';
import { updateGlobalProjects } from '../general';
import { showUserMessage } from '../vscode';

export const shouldSaveProject = async (
  worktree: IWorktree,
  option: INoYesOption
) => {
  if (option === noYesWindowOptions.no) return;

  if (option === noYesWindowOptions.ask) {
    const answer = await showUserMessage(
      'Info',
      `Do you want to save project '${worktree.worktree}'?`,
      noYesWindowOptions.yes,
      noYesWindowOptions.no
    );

    if (!answer) return;
    if (answer === noYesWindowOptions.no) return;

    return updateGlobalProjects(worktree);
  }

  return updateGlobalProjects(worktree);
};
