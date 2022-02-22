import { isEmpty } from 'lodash';

export type Supplier<E extends Error> = () => E;
export type ExecutionFunction<T> = () => T;
export class Optional<T> {
  private readonly value: T;

  constructor(value: T) {
    this.value = value;
  }

  /**
   * If a value is present in this Optional, returns the value, otherwise throws NoSuchElementException.
   */
  public get(): T {
    if (isEmpty(this.value)) {
      throw new Error('No such element found');
    }
    return this.value;
  }
  public orElse(another: T): T {
    return isEmpty(this.value) ? another : this.value;
  }
  public orElseGet(cb: ExecutionFunction<T>): T {
    return isEmpty(this.value) ? cb() : this.value;
  }
  public orElseThrow<E extends Error>(exceptionSupplier: Supplier<E>): T {
    if (isEmpty(this.value)) {
      throw exceptionSupplier();
    }
    return this.value;
  }
}
