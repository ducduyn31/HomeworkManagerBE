export function convertToList<T>(maybeList: T | T[]): T[] {
  return Array.isArray(maybeList) ? maybeList : [maybeList];
}

export function breakListIfPossible<T>(maybeList: T | T[]): T | T[] {
  if (Array.isArray(maybeList)) {
    return maybeList.length > 1 ? maybeList : maybeList[0];
  }
  return maybeList;
}
