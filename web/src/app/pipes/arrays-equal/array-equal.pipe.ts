import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arraysEqual',
  pure: false,
})
export class ArrayEqual implements PipeTransform {
  transform<T>([arrayA, arrayB]: [
    T[] | undefined | null,
    T[] | undefined | null
  ]): boolean {
    // both null or both undefined
    if (arrayA === arrayB) {
      return true;
    }

    // either not array
    if (!Array.isArray(arrayA) || !Array.isArray(arrayB)) {
      return false;
    }

    if (arrayA.length !== arrayB.length) {
      return false;
    }

    for (let i = 0; i < arrayA.length; i++) {
      if (arrayA[i] !== arrayB[i]) {
        return false;
      }
    }

    return true;
  }
}
