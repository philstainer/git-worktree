import {
  BARE_REPOSITORY,
  BARE_REPOSITORY_REMOTE_ORIGIN_FETCH,
} from '../config/constants';
import { executeCommand } from './general';
import { removeNewLine } from './string';
import { getWorktrees } from './worktree/getWorktrees';

export const isGitRepository = async () => {
  try {
    const command = 'git rev-parse --is-inside-work-tree';
    await executeCommand(command);

    return true;
  } catch (e: any) {
    return false;
  }
};

export const getRemoteOrigin = async () => {
  const command = 'git remote';

  try {
    const { stdout } = await executeCommand(command);
    const origin = removeNewLine(stdout);

    return origin === '' ? null : origin;
  } catch (e: any) {
    throw Error(e);
  }
};

export const throwIfNotRepository = async () => {
  const isRepo = await isGitRepository();

  if (isRepo) return;

  throw new Error('This is not a git repository.');
};

export const isBareRepository = async (path: string) => {
  try {
    const command = `git -C ${path} rev-parse --is-bare-repository`;
    const { stdout } = await executeCommand(command);

    const result = removeNewLine(stdout);

    return result === 'true';
  } catch (e: any) {
    throw Error(e);
  }
};

const hasBareRepository = async () => {
  const worktrees = await getWorktrees(true);
  const hasBareRepo = worktrees.find((wt) => wt.worktree === BARE_REPOSITORY);
  return hasBareRepo;
};

export const setUpBareRepositoryFetch = async (path?: string) => {
  const pathCommand = path ? `-C ${path}` : '';
  const command = `git ${pathCommand} config remote.origin.fetch`;
  const fetchOriginCommand = `git ${pathCommand} config remote.origin.fetch "${BARE_REPOSITORY_REMOTE_ORIGIN_FETCH}"`;

  try {
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
    throw Error(e);
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

export const pushNewBranchToRemote = async (path: string) => {
  try {
    const command = `git -C ${path} push -u origin`;
    await executeCommand(command);
  } catch (e: any) {
    throw Error(e);
  }
};

export const removeBranch = async (branch: string) => {
  try {
    const command = `git branch -D ${branch}`;
    await executeCommand(command);
  } catch (e: any) {
    throw Error(e);
  }
};

export const cloneBare = async (path: string, url: string) => {
  try {
    const command = `git -C ${path} clone --bare "${url}" .bare`;
    await executeCommand(command);
  } catch (e: any) {
    throw Error(e);
  }
};
