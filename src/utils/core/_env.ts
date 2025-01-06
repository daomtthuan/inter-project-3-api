import { EnvKey } from './_env.type';
import { ValueUtils } from './_value';

/** Utility class for environment operations. */
export class EnvUtils {
  /**
   * Check if the environment is production.
   *
   * @returns `true` if the environment is production, otherwise `false`.
   */
  static get isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  }

  /**
   * Get the environment variable as a string.
   *
   * @param key Environment variable key.
   *
   * @returns Environment variable value.
   */
  static getString(key: EnvKey): string {
    const value = process.env[key];
    if (ValueUtils.isEmpty(value)) {
      throw new Error(`Environment variable '${key}' is not defined.`);
    }

    if (!ValueUtils.isString(value)) {
      throw new Error(`Environment variable '${key}' is not a string.`);
    }

    return value;
  }

  /**
   * Get the environment variable as a number.
   *
   * @param key Environment variable key.
   *
   * @returns Environment variable value.
   */
  static getNumber(key: EnvKey): number {
    const value = process.env[key];
    if (ValueUtils.isEmpty(value)) {
      throw new Error(`Environment variable '${key}' is not defined.`);
    }

    const result = Number(value);
    if (!ValueUtils.isNumber(result)) {
      throw new Error(`Environment variable '${key}' is not a number.`);
    }

    return result;
  }
}
