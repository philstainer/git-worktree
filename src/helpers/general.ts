import type {
  ILoggingOption,
  ILoggingOptionValue,
  IWorktree,
} from '#/@types/worktree';
import { basename } from 'path';
import * as util from 'util';
import { workspace } from 'vscode';
import { loggingOptionValue, loggingOptions } from '../config/constants';
import { globalState } from '../extension';
import { isExistingDirectory } from './file';

import { spawn, type ExecOptions, type SpawnOptions } from 'child_process';
import { showUserMessage } from './vscode';

const exec = util.promisify(require('child_process').exec);

export const getCurrentPath = () => workspace.rootPath;
export const getCurrentDirectory = () => {
  const currentPath = getCurrentPath();
  if (!currentPath) return null;

  return basename(currentPath);
};
export const getWorkspaceFilePath = () => workspace.workspaceFile;

export const executeCommand = async (
  command: string,
  options?: ExecOptions
) => {
  let execOptions = { ...options, cwd: options?.cwd ?? getCurrentPath() };

  try {
    const { stdout } = await exec(command, execOptions);
    return { stdout };
  } catch (e: any) {
    const errorMessage = `command: '${command}'. error: '${e.message}'`;
    throw Error(errorMessage);
  }
};

export const executeBackgroundCommand = async ({
  event,
  command,
  options,
}: {
  event: string;
  command: string;
  options?: SpawnOptions & { cwd: string };
}) => {
  return new Promise<void>((res, rej) => {
    if (!options?.cwd) return res();

    let execOptions: SpawnOptions = {
      ...options,
      detached: true,
      stdio: ['ignore', 'ignore', 'ignore'],
      shell: true,
    };

    try {
      const subprocess = spawn(command, execOptions);

      subprocess.unref();

      res();
    } catch (e: any) {
      showUserMessage('Error', `command: '${command}'. error: '${e.message}'`);
      rej(e);
    }
  });
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

  const checkedProjects = (
    await Promise.all(
      projects.map(async (wt) => ({
        ...wt,
        exists: await isExistingDirectory(wt.path),
      }))
    )
  )
    .filter((wt) => wt.exists)
    .map(({ exists, ...wt }) => wt);

  const cleanProjects = new Map(
    checkedProjects.map((p) => {
      return [p.worktree, p];
    })
  );

  return cleanProjects;
};

export const updateGlobalProjects = async (worktree: IWorktree) => {
  const projects = await getGlobalProjects();
  const newProject = { path: worktree.path, worktree: worktree.worktree };

  projects.set(newProject.worktree, newProject);

  globalState?.update('projects', [...projects.values()]);

  return projects;
};
