import { Equals, identityEquals } from './equals';

export function arraysEqual<T>(
  a: T[],
  b: T[],
  equals: Equals<T> = identityEquals
): boolean {
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    if (!equals(a[i], b[i])) {
      return false;
    }
  }

  return true;
}
