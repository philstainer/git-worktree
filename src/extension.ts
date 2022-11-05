import { commands, ExtensionContext } from 'vscode';
import { add } from './commands/add';
import { clone } from './commands/clone';
import { list } from './commands/list';
import { projects } from './commands/projects';
import { publish } from './commands/publish';
import { remove } from './commands/remove';
import { rename } from './commands/rename';

export let globalState: ExtensionContext['globalState'] | null = null;

export function activate(context: ExtensionContext) {
  globalState = context.globalState;

  let wtClone = commands.registerCommand('git-worktree.clone', clone);
  let wtAdd = commands.registerCommand('git-worktree.add', add);
  let wtList = commands.registerCommand('git-worktree.list', list);
  let wtRename = commands.registerCommand('git-worktree.rename', rename);
  let wtRemove = commands.registerCommand('git-worktree.remove', remove);
  let wtPublish = commands.registerCommand('git-worktree.publish', publish);
  let wtProjects = commands.registerCommand('git-worktree.projects', projects);

  context.subscriptions.push(wtClone);
  context.subscriptions.push(wtAdd);
  context.subscriptions.push(wtList);
  context.subscriptions.push(wtRename);
  context.subscriptions.push(wtRemove);
  context.subscriptions.push(wtPublish);
  context.subscriptions.push(wtProjects);
}

export function deactivate() {}
