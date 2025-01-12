import { Nullish } from '~/common/types/core';

/** Utility class for value operations. */
export class ValueUtils {
  /**
   * Check if the value is nullish.
   *
   * @param value Value to check.
   *
   * @returns `true` if the value is nullish, otherwise `false`.
   */
  static isNullish(value: unknown): value is Nullish {
    return value == null;
  }

  /**
   * Check if the value is empty.
   *
   * @param value Value to check.
   *
   * @returns `true` if the value is empty, otherwise `false`.
   */
  static isEmpty(value: unknown): value is Nullish | '' {
    return this.isNullish(value) || value === '';
  }

  /**
   * Check if the value is a string.
   *
   * @param value Value to check.
   *
   * @returns `true` if the value is a string, otherwise `false`.
   */
  static isString(value: unknown): value is string {
    return typeof value === 'string';
  }

  /**
   * Check if the value is a number.
   *
   * @param value Value to check.
   *
   * @returns `true` if the value is a number, otherwise `false`.
   */
  static isNumber(value: unknown): value is number {
    return typeof value === 'number' && !Number.isNaN(value);
  }
}
