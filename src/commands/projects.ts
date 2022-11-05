import settings from '../config/settings';
import { getCurrentDirectory, getGlobalProjects } from '../helpers/general';
import { raiseIssue, showUserMessage } from '../helpers/vscode';
import { selectWorktree } from '../helpers/worktree/selectWorktree';
import { shouldMoveIntoWorktree } from '../helpers/worktree/shouldMoveIntoWorktree';

export const projects = async () => {
  try {
    const currentDirectoryName = getCurrentDirectory();

    const worktrees = await getGlobalProjects();

    // Filter out current .bare repo
    const filteredProjects = worktrees.filter(
      (wt) => wt.worktree !== currentDirectoryName
    );
    if (!filteredProjects.length)
      return showUserMessage('Info', "Couldn't find any projects");

    const selectedProjects = await selectWorktree(filteredProjects);
    if (!selectedProjects)
      return showUserMessage('Warn', 'Aborted as no project was selected');

    await shouldMoveIntoWorktree(
      selectedProjects,
      settings.shouldOpenOnProject
    );
  } catch (e: any) {
    await raiseIssue(e?.message);
  }
};
