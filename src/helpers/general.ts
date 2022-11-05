import { ILoggingOption, ILoggingOptionValue } from '#/@types/worktree';
import * as util from 'util';
import * as vscode from 'vscode';
import { loggingOptions, loggingOptionValue } from '../config/constants';

const exec = util.promisify(require('child_process').exec);

export const getCurrentPath = () => vscode.workspace.rootPath;
export const getWorkspaceFilePath = () => vscode.workspace.workspaceFile;

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
    vscode.workspace
      .getConfiguration()
      .get('gitWorktree.worktree.loggingLevel') ?? loggingOptions.info;

  let loggingLevel: ILoggingOptionValue = loggingOptionValue.info;

  if (currentLoggingLevel === loggingOptions.error)
    loggingLevel = loggingOptionValue.error;
  if (currentLoggingLevel === loggingOptions.warn)
    loggingLevel = loggingOptionValue.warn;

  return loggingLevel;
};
