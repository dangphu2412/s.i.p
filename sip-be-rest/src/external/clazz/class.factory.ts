import { Constructor } from 'global';

export class ClazzFactory {
  public static create<T>(
    targetClass: Constructor<T>,
    partial: Partial<Constructor<T>>,
  ): T {
    return Object.assign(new targetClass(), partial);
  }
}
