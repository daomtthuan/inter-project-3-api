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
}
