import { resolve } from 'path';
import { isExistingFile, readJsonFile } from '../file';
import { executeBackgroundCommand } from '../general';

const events = {
  onWorktreeCreated: 'onWorktreeCreated',
  onWorktreeCloned: 'onWorktreeCloned',
  onWorktreeRenamed: 'onWorktreeRenamed',
};

type Event = keyof typeof events;

const configFiles = ['.worktree.json', 'package.json'];

export const processEvent = async ({
  event,
  path,
}: {
  event: Event;
  path: string;
}) => {
  const foundFiles = configFiles
    .map((file) => {
      const filePath = resolve(path, file);
      return { file, filePath, exists: isExistingFile(filePath) };
    })
    .filter((file) => file.exists);

  // No config files found
  if (!foundFiles.length) return;

  const filePath = foundFiles[0].filePath;
  const config = await readJsonFile(filePath);

  const workTreeEvents: Record<Event, string> = config.worktreeEvents;

  // No events configured
  if (!workTreeEvents) return;

  return executeBackgroundCommand({
    event,
    command: workTreeEvents[event],
    options: { cwd: path },
  });
};
