import {
  fetch,
  getRemoteBranches,
  getRemoteOrigin,
  pushNewBranchToRemote,
  throwIfNotRepository,
} from '../helpers/git';
import { raiseIssue, showUserMessage } from '../helpers/vscode';
import { getWorktrees } from '../helpers/worktree/getWorktrees';
import { selectWorktree } from '../helpers/worktree/selectWorktree';

export const publish = async () => {
  try {
    await throwIfNotRepository();

    const hasRemote = await getRemoteOrigin();
    if (!hasRemote)
      return showUserMessage('Warn', `This repository has no remote setup`);

    await fetch();

    const [localWorktrees, remoteBranches] = await Promise.all([
      getWorktrees(),
      getRemoteBranches(),
    ]);

    const filteredBranches = localWorktrees.filter(
      (lwt) => !remoteBranches.find((rwt) => rwt === lwt.worktree)
    );
    if (!filteredBranches.length)
      return showUserMessage('Info', `All worktrees already exist on remote`);

    const worktree = await selectWorktree(filteredBranches);
    if (!worktree)
      return showUserMessage('Warn', `Aborted as no worktree was selected`);

    await pushNewBranchToRemote(worktree.path);

    showUserMessage(
      'Info',
      `Successfully pushed '${worktree.branch}' to origin`
    );
  } catch (e: any) {
    await raiseIssue(e?.message);
  }
};
