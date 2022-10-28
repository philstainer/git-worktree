import { executeCommand } from "./general";

export const isGitRepository = async () => {
  try {
    const isGitRepositoryCommand = "git rev-parse --is-inside-work-tree";
    await executeCommand(isGitRepositoryCommand);

    return true;
  } catch (e: any) {
    return false;
  }
};
