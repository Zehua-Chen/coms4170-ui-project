import { Observable, OperatorFunction, map } from 'rxjs';

export interface Identifiable {
  id: any;
}

/**
 * Check if an element is the same as another element at a specific index in
 * an array
 * @param index given an array of elements, get the index used for comparison
 * @returns
 */
function isSameWithIndex<T extends Identifiable>(
  index: (elements: T[]) => number
): OperatorFunction<[T | null, T[]], [T | null, boolean]> {
  return (
    source: Observable<[T | null, T[]]>
  ): Observable<[T | null, boolean]> => {
    return source.pipe(
      map(([element, elements]) => {
        if (!element) {
          return [null, false];
        }

        const indexValue = index(elements);

        if (indexValue >= elements.length || indexValue < 0) {
          return [element, false];
        }

        if (element.id === elements[indexValue].id) {
          return [element, true];
        }

        return [element, false];
      })
    );
  };
}

/**
 * If the element is the first in array
 * @param source
 * @returns
 */
export function isLast<T extends Identifiable>(
  source: Observable<[T | null, T[]]>
): Observable<[T | null, boolean]> {
  return source.pipe(isSameWithIndex<T>((elements) => elements.length - 1));
}

/**
 * If the element is the last in array
 * @param source
 * @returns
 */
export function isFirst<T extends Identifiable>(
  source: Observable<[T | null, T[]]>
): Observable<[T | null, boolean]> {
  return source.pipe(isSameWithIndex<T>(() => 0));
}
