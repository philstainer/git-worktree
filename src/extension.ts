import * as vscode from 'vscode';
import { list } from './commands/list';
import { remove } from './commands/remove';
import { removeMany } from './commands/removeMany';

export function activate(context: vscode.ExtensionContext) {
  let wtList = vscode.commands.registerCommand('git-worktree.list', list);
  let wtRemove = vscode.commands.registerCommand('git-worktree.remove', remove);
  let wtRemoveMany = vscode.commands.registerCommand(
    'git-worktree.removeMany',
    removeMany
  );

  context.subscriptions.push(wtList);
  context.subscriptions.push(wtRemove);
  context.subscriptions.push(wtRemoveMany);
}

export function deactivate() {}
