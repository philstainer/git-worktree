import { executeCommand } from './general';
import { removeNewLine } from './string';

export const isGitRepo = async () => {
  try {
    const command = 'git rev-parse --is-inside-work-tree';
    await executeCommand(command);

    return true;
  } catch (e: any) {
    return false;
  }
};

export const isBareRepo = async (path: string) => {
  try {
    const command = `git -C ${path} rev-parse --is-bare-repository`;
    const { stdout } = await executeCommand(command);

    const result = removeNewLine(stdout);

    return result === 'true';
  } catch (e: any) {
    throw Error(e);
  }
};

export const throwIfNotRepo = async () => {
  const isRepo = await isGitRepo();

  if (isRepo) return;

  throw new Error('This is not a git repository.');
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

export const branchExistsOnRemote = async (branch: string) => {
  try {
    const command = `git ls-remote origin ${branch}`;
    const { stdout } = await executeCommand(command);

    if (!stdout) return false;

    return true;
  } catch (e: any) {
    throw Error(e);
  }
};

export const getRemoteBranches = async () => {
  try {
    const command = `git branch -r`;
    const { stdout } = await executeCommand(command);

    if (!stdout) return [];

    return stdout
      .split('\n')
      .filter((line: string) => line !== '')
      .filter((line: string) => !line.includes('->')) // exclude "  origin/HEAD -> origin/master"
      .filter((line: string) => line.startsWith('  origin/'))
      .map((line: string) => line.substring('  origin/'.length))
      .map((branch: string) => branch.trim());
  } catch (e: any) {
    throw Error(e);
  }
};

export const pushBranchToRemote = async (path: string) => {
  try {
    const command = 'git push origin';
    await executeCommand(command, { cwd: path });
  } catch (e: any) {
    throw Error(e);
  }
};

export const setBranchUpStream = async (branch: string, path: string) => {
  try {
    const command = `git branch --set-upstream-to origin/${branch}`;
    await executeCommand(command, { cwd: path });
  } catch (e: any) {
    throw Error(e);
  }
};
