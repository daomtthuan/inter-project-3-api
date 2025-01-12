/**
 * Mapper options.
 *
 * @template TType Model type.
 */
export type MapperOptions<TType extends object> = {
  /**
   * Map data to model.
   *
   * @param data Data.
   *
   * @returns Partial model.
   */
  map?: <TData>(data: TData) => TType;

  /** Pick keys. */
  pick?: (keyof TType)[];

  /** Omit keys. */
  omit?: (keyof TType)[];
};
