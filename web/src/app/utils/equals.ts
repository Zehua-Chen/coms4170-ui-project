export type Equals<T> = (a: T, b: T) => boolean;

export function identityEquals<T>(a: T, b: T): boolean {
  return a === b;
}
