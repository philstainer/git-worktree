import * as vscode from 'vscode';
import { list } from './commands/list';

export function activate(context: vscode.ExtensionContext) {
  let wtList = vscode.commands.registerCommand('git-worktree.list', list);

  context.subscriptions.push(wtList);
}

export function deactivate() {}
