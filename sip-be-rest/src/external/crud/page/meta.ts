export class Meta {
  public page?: number;
  public size?: number;
  public pageCount?: number;
  public totalCount?: number;
  public links?: {
    self?: string;
    first?: string;
    previous?: string;
    next?: string;
    last?: string;
  };

  constructor(meta?: Omit<Meta, 'pageCount'>) {
    if (meta) {
      return {
        ...meta,
        pageCount:
          meta.totalCount && meta.size
            ? Math.ceil(meta.totalCount / meta.size)
            : undefined,
      };
    }

    return {};
  }
}
