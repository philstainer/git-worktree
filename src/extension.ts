import * as vscode from 'vscode';
import { add } from './commands/add';
import { clone } from './commands/clone';
import { list } from './commands/list';
import { publish } from './commands/publish';
import { remove } from './commands/remove';
import { rename } from './commands/rename';

export function activate(context: vscode.ExtensionContext) {
  let wtClone = vscode.commands.registerCommand(
    'git-worktree.clone-bare',
    clone
  );
  let wtAdd = vscode.commands.registerCommand('git-worktree.add', add);
  let wtList = vscode.commands.registerCommand('git-worktree.list', list);
  let wtRename = vscode.commands.registerCommand('git-worktree.rename', rename);
  let wtRemove = vscode.commands.registerCommand('git-worktree.remove', remove);
  let wtPublish = vscode.commands.registerCommand(
    'git-worktree.publish',
    publish
  );

  context.subscriptions.push(wtClone);
  context.subscriptions.push(wtAdd);
  context.subscriptions.push(wtList);
  context.subscriptions.push(wtRename);
  context.subscriptions.push(wtRemove);
  context.subscriptions.push(wtPublish);
}

export function deactivate() {}
