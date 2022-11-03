import { mkdir, stat, writeFile } from 'fs/promises';

export const isExistingDirectory = async (path: string) => {
  try {
    const newPath = await stat(path);
    return newPath?.isDirectory();
  } catch {
    return false;
  }
};

export const createDirectory = async (path: string) => {
  try {
    await mkdir(path);
  } catch (e: any) {
    throw Error(e);
  }
};

export const createFile = async (path: string, data: string) => {
  try {
    await writeFile(path, data);
  } catch (e: any) {
    throw Error(e);
  }
};
