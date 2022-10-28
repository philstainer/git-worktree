export type FilteredWorktree = [string, string, string];

export interface Worktree {
  path: string;
  hash: string;
  worktree: string;
}
