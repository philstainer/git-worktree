import * as vscode from 'vscode';
import { add } from './commands/add';
import { clone } from './commands/clone';
import { list } from './commands/list';
import { remove } from './commands/remove';
import { removeMany } from './commands/removeMany';
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
  let wtRemoveMany = vscode.commands.registerCommand(
    'git-worktree.removeMany',
    removeMany
  );

  context.subscriptions.push(wtClone);
  context.subscriptions.push(wtAdd);
  context.subscriptions.push(wtList);
  context.subscriptions.push(wtRename);
  context.subscriptions.push(wtRemove);
  context.subscriptions.push(wtRemoveMany);
}

export function deactivate() {}
