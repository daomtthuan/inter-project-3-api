/** Utility class for object operations. */
export class ObjectUtils {
  /**
   * Filter object properties.
   *
   * @param obj Object.
   * @param predicate Predicate.
   *
   * @returns Filtered object.
   */
  static filterProperties<TType extends object, TTransform extends object>(
    obj: TType,
    predicate: (key: keyof TType, value: TType[keyof TType]) => boolean,
  ): TTransform {
    return Object.fromEntries(Object.entries(obj).filter(([key, value]) => predicate(key as keyof TType, value))) as TTransform;
  }

  /**
   * Pick object properties.
   *
   * @param obj Object.
   * @param keys Keys to pick.
   *
   * @returns Picked object.
   */
  static pickProperties<TType extends object, TTransform extends object>(obj: TType, keys: (keyof TType)[]): TTransform {
    return ObjectUtils.filterProperties(obj, (key) => keys.includes(key)) as TTransform;
  }

  /**
   * Omit object properties.
   *
   * @param obj Object.
   * @param keys Keys to exclude.
   *
   * @returns Omitted object.
   */
  static omitProperties<TType extends object, TTransform extends object>(obj: TType, keys: (keyof TType)[]): TTransform {
    return ObjectUtils.filterProperties(obj, (key) => !keys.includes(key)) as TTransform;
  }
}
