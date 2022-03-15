import { isEmpty } from 'lodash';

export type Supplier<E extends Error> = () => E;
export type ExecutionFunction<T> = () => T;

export function Optional<T>(input: T) {
  const value = input;
  /**
   * If a value is present in this Optional, returns the value, otherwise throws NoSuchElementException.
   */
  function get(): T {
    if (isEmpty(value)) {
      throw new Error('No such element found');
    }
    return value;
  }
  function orElse(another: T): T {
    return isEmpty(value) ? another : value;
  }
  function orElseGet(cb: ExecutionFunction<T>): T {
    return isEmpty(value) ? cb() : value;
  }
  function orElseThrow<E extends Error>(exceptionSupplier: Supplier<E>): T {
    if (isEmpty(this.value)) {
      throw exceptionSupplier();
    }
    return value;
  }

  return {
    get,
    orElse,
    orElseGet,
    orElseThrow,
  };
}
