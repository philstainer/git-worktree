import { dirname } from 'path';

export const removeFirstAndLastCharacter = (string: string) =>
  string.slice(1, -1);

export const removeNewLine = (string: string) => string.replace(/\n/g, '');

export const traverseUpDirectory = (path: string) => dirname(path);
