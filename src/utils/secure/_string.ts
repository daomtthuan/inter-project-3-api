/** Utility class for secure string operations. */
export class SecureStringUtils {
  /**
   * Mask a string.
   *
   * @param text Text to mask.
   * @param substringLength Substring length.
   * @param visibleLength Visible length.
   *
   * @returns Masked text.
   */
  static mask(text: string, visibleLength: number = 0, length: number = 16) {
    return text.substring(0, visibleLength).padEnd(length, '*');
  }
}
