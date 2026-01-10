// external imports
import { computed, Signal } from '@angular/core';
import { isEmpty } from 'lodash-es';

// internal imports
import { ObjectUtil } from './core.utils';

/**
 * Creates a computed signal that only emits when the deep/shallow value changes.
 *
 * @param computeFn - The reactive computation function
 * @param options - Options to control equality strategy (default: deep equality)
 * @returns A computed signal that avoids emitting unchanged objects
 */
export function memoizeComputed<T extends object>(
  computeFn: () => T,
): Signal<T> {
  let currentValue: T;

  return computed(() => {
    const nextValue = computeFn();
    const diff = ObjectUtil.diff(currentValue, nextValue);
    if (!isEmpty(diff)) {
      currentValue = nextValue;
    }

    return currentValue;
  });
}
