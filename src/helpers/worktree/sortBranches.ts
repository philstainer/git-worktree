import { QuickPickItemKind, type QuickPickItem } from 'vscode';

export const sortBranches = (incomingArr: QuickPickItem[]) => {
  const arr: QuickPickItem[] = [...incomingArr];

  const customSort = (a: QuickPickItem, b: QuickPickItem) => {
    // Check if a or b is "main" or "master"
    const aIsMainOrMaster = /^(main|master)$/i.test(a.label);
    const bIsMainOrMaster = /^(main|master)$/i.test(b.label);

    if (aIsMainOrMaster && bIsMainOrMaster) {
      // If both a and b are "main" or "master", sort them lexicographically
      return a.label.localeCompare(b.label);
    } else if (aIsMainOrMaster) {
      // If only a is "main" or "master", prioritize it to be at the top
      return -1;
    } else if (bIsMainOrMaster) {
      // If only b is "main" or "master", prioritize it to be at the top
      return 1;
    } else {
      // Otherwise, sort them lexicographically
      return a.label.localeCompare(b.label);
    }
  };

  // Sort the array using the custom sorting function
  arr.sort(customSort);

  // Reverse the array
  arr.reverse();

  // Find the last index of "main" or "master" in the reversed array
  const lastIndex = arr.findIndex((item) =>
    /^(main|master)$/i.test(item.label)
  );

  // If "main" or "master" is found, insert a separator after it
  if (lastIndex !== -1)
    arr.splice(lastIndex, 0, {
      label: '',
      kind: QuickPickItemKind.Separator,
    });

  arr.reverse();

  return arr;
};
