import { statSync } from 'fs';
import { mkdir, readFile, stat, writeFile } from 'fs/promises';

export const isExistingDirectory = async (path: string) => {
  try {
    const newPath = await stat(path);
    return newPath.isDirectory();
  } catch {
    return false;
  }
};

export const isExistingFile = (path: string) => {
  try {
    const newPath = statSync(path);
    return newPath.isFile();
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

export const readJsonFile = async (path: string) => {
  try {
    const data = await readFile(path, 'utf8');

    return parseJson(data);
  } catch (err) {
    throw err;
  }
};

export const parseJson = (data: string) => {
  try {
    const jsonData: Record<string, any> = JSON.parse(data);
    return jsonData;
  } catch (error) {
    throw new Error('Failed to parse JSON file');
  }
};
