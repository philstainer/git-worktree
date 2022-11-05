import type {
  ILoggingOption,
  ILoggingOptionValue,
  IWorktree,
} from '#/@types/worktree';
import { basename } from 'path';
import * as util from 'util';
import { workspace } from 'vscode';
import { loggingOptions, loggingOptionValue } from '../config/constants';
import { globalState } from '../extension';
import { isExistingDirectory } from './file';

const exec = util.promisify(require('child_process').exec);

export const getCurrentPath = () => workspace.rootPath;
export const getCurrentDirectory = () => {
  const currentPath = getCurrentPath();
  if (!currentPath) return null;

  return basename(currentPath);
};
export const getWorkspaceFilePath = () => workspace.workspaceFile;

export const executeCommand = async (command: string, options?: any) => {
  let execOptions = options;

  if (!options) {
    const currentPath = getCurrentPath();
    execOptions = {
      cwd: currentPath,
    };
  }

  try {
    const { stdout } = await exec(command, execOptions);
    return { stdout };
  } catch (e: any) {
    const errorMessage = `command: '${command}'. error: '${e.message}'`;
    throw Error(errorMessage);
  }
};

export const getCurrentLoggingLevel = () => {
  const currentLoggingLevel: ILoggingOption =
    workspace.getConfiguration().get('gitWorktree.worktree.loggingLevel') ??
    loggingOptions.info;

  let loggingLevel: ILoggingOptionValue = loggingOptionValue.info;

  if (currentLoggingLevel === loggingOptions.error)
    loggingLevel = loggingOptionValue.error;
  if (currentLoggingLevel === loggingOptions.warn)
    loggingLevel = loggingOptionValue.warn;

  return loggingLevel;
};

export const getGlobalProjects = async () => {
  const projects: IWorktree[] = globalState?.get('projects') ?? [];

  const checkedProjects = await Promise.all(
    projects.map(async (wt) => ({
      ...wt,
      exists: await isExistingDirectory(wt.path),
    }))
  );

  const cleanProjects = checkedProjects
    .filter((wt) => wt.exists)
    .map(({ exists, ...wt }) => wt);

  return cleanProjects;
};

export const updateGlobalProjects = async (worktree: IWorktree) => {
  const projects = await getGlobalProjects();

  const newWorktrees: IWorktree[] = [
    ...projects,
    { path: worktree.path, worktree: worktree.worktree },
  ];

  globalState?.update('projects', newWorktrees);

  return newWorktrees;
};
