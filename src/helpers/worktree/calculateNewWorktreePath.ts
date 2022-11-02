import settings from '#/src/config/settings';
import { isAbsolute, resolve } from 'path';
import { executeCommand } from '../general';
import { isBareRepository } from '../git';
import { removeNewLine } from '../string';

const baseDirectory = settings.baseDirectory;

export const calculateNewWorktreePath = async (branch: string) => {
  try {
    const command = 'git rev-parse --path-format=absolute --git-common-dir';
    const { stdout } = await executeCommand(command);

    const path = removeNewLine(stdout);

    const isBare = await isBareRepository(path);
    if (!isBare) throw new Error('Bare repository not found');

    const resolvedPath = isAbsolute(baseDirectory)
      ? baseDirectory
      : resolve(path, baseDirectory);

    return `${resolvedPath}/${branch}`;
  } catch (e: any) {
    throw Error(e);
  }
};
