import * as util from 'util';
import * as vscode from 'vscode';

const exec = util.promisify(require('child_process').exec);

export const getCurrentPath = () => vscode.workspace.rootPath;

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
