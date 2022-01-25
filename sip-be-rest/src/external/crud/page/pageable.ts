import { Meta } from './meta';

export class Pageable<T> {
  constructor(public data: T[], public meta?: Meta) {
    if (meta) {
      this.meta = new Meta(meta);
    }
  }
}
