import { type IWorktree } from '#/@types/worktree';
import {
  BARE_REPOSITORY,
  BARE_REPOSITORY_REMOTE_ORIGIN_FETCH,
} from '../config/constants';
import { executeCommand } from './general';
import { removeNewLine } from './string';
import { getWorktrees } from './worktree/getWorktrees';

export const getRemoteOrigin = async () => {
  const command = 'git remote';

  try {
    const { stdout } = await executeCommand(command);
    const origin = removeNewLine(stdout);

    return origin === '' ? null : origin;
  } catch (e: any) {
    return null;
  }
};

export const isInsideWorkTree = async () => {
  try {
    const command = 'git rev-parse --is-inside-work-tree';
    await executeCommand(command);

    return true;
  } catch (e: any) {
    return false;
  }
};

export const isInsideBareRepository = async (path?: string) => {
  try {
    const command = `git rev-parse --is-bare-repository`;
    const { stdout } = await executeCommand(command, { cwd: path });

    const result = removeNewLine(stdout);

    return result === 'true';
  } catch (e: any) {
    return false;
  }
};

export const throwIfNotInWorktreeRepository = async () => {
  const isWorktree = await isInsideWorkTree();
  const isBareRepo = await isInsideBareRepository();

  if (isWorktree || isBareRepo) return;

  throw new Error('You are not in a worktree or bare repo');
};

const hasBareRepository = async () => {
  const worktrees = await getWorktrees(true);
  const hasBareRepo = worktrees.find((wt) => wt.worktree === BARE_REPOSITORY);
  return hasBareRepo;
};

export const setUpBareRepositoryFetch = async (path?: string) => {
  const pathCommand = path ? `-C ${path}` : '';
  const fetchOriginCommand = `git ${pathCommand} config remote.origin.fetch "${BARE_REPOSITORY_REMOTE_ORIGIN_FETCH}"`;

  try {
    const command = `git ${pathCommand} config remote.origin.fetch`;
    const { stdout } = await executeCommand(command);

    const remoteOriginFetch = removeNewLine(stdout);

    if (remoteOriginFetch === BARE_REPOSITORY_REMOTE_ORIGIN_FETCH) return;

    await executeCommand(fetchOriginCommand);
    return;
  } catch (e: any) {
    try {
      await executeCommand(fetchOriginCommand);
    } catch (e: any) {
      throw Error(e);
    }
  }
};

export const fetch = async (path?: string) => {
  const pathCommand = path ? `-C ${path}` : '';
  const hasBareRepo = await hasBareRepository();
  if (hasBareRepo) await setUpBareRepositoryFetch(path);

  try {
    const command = `git ${pathCommand} fetch --all --prune`;
    await executeCommand(command);
  } catch (e: any) {
    throw Error(e);
  }
};

export const validateBranchName = async (name: string) => {
  try {
    const command = `git check-ref-format --branch '${name}'`;
    const { stdout } = await executeCommand(command);

    return true;
  } catch (e: any) {
    return false;
  }
};

export const getCurrentBranchName = async () => {
  try {
    const command = 'git rev-parse --abbrev-ref HEAD';
    const { stdout } = await executeCommand(command);

    return stdout.split('\n')[0];
  } catch (e: any) {
    return null;
  }
};

export const checkIfBranchExistsOnRemote = async (branch: string) => {
  try {
    const command = `git ls-remote origin ${branch}`;
    const { stdout } = await executeCommand(command);

    if (!stdout) return false;

    return true;
  } catch (e: any) {
    throw Error(e);
  }
};

export const getRemoteBranches = async (): Promise<string[]> => {
  try {
    const command = `git branch -r`;
    const { stdout } = await executeCommand(command);

    if (!stdout) return [];

    return stdout
      .split('\n')
      .filter((line: string) => line !== '')
      .filter((line: string) => !line.includes('->'))
      .filter((line: string) => line.startsWith('  origin/'))
      .map((line: string) => line.substring('  origin/'.length))
      .map((branch: string) => branch.trim());
  } catch (e: any) {
    throw Error(e);
  }
};

export const pushNewBranchToRemote = async ({ path, worktree }: IWorktree) => {
  try {
    const command = `git -C ${path} push --set-upstream origin ${worktree}`;
    await executeCommand(command);
  } catch (e: any) {
    throw Error(e);
  }
};

export const removeBranch = async (branchOrBranches: string | string[]) => {
  const joinedBranches = Array.isArray(branchOrBranches)
    ? branchOrBranches.join(' ')
    : branchOrBranches;

  try {
    const command = `git branch -D ${joinedBranches}`;
    await executeCommand(command);
  } catch (e: any) {
    throw Error(e);
  }
};

export const cloneBare = async (
  path: string,
  url: string,
  baseDirectory: string = './.bare'
) => {
  try {
    const command = `git -C ${path} clone --bare "${url}" ${baseDirectory}`;
    await executeCommand(command);
  } catch (e: any) {
    throw Error(e);
  }
};

export const removeLocalBranchesThatDoNotExistOnRemoteRepository = async () => {
  try {
    const command = `git branch -vv`;
    const { stdout } = await executeCommand(command);

    if (!stdout) return;

    const localBranchesThatDoNotExistOnRemoteRepository = stdout
      .split('\n')
      .filter((line: string) => line.includes(': gone]'))
      .filter((line: string) => !line.match(/^[\*\+]/))
      .map((line: string) => line.trim())
      .map((line: string) => line.split(' ')[0]);

    if (localBranchesThatDoNotExistOnRemoteRepository.length === 0) return;

    await removeBranch(localBranchesThatDoNotExistOnRemoteRepository);
  } catch (e: any) {
    throw Error(e);
  }
};
