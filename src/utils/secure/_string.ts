import crypto from 'crypto';

import { EnvUtils } from '../core';

/** Utility class for secure string operations. */
export class SecureStringUtils {
  private static readonly ENCRYPTION_ALGORITHM = 'aes-256-cbc';
  private static readonly KEY_LENGTH = 32;
  private static readonly IV_LENGTH = 16;
  private static readonly IV_BASE64_LENGTH = 24;
  private static readonly DELIMITER = ':';

  private static _key?: Buffer;

  /**
   * Encrypt a string.
   *
   * @param text Text to encrypt.
   *
   * @returns Encrypted text.
   */
  static encrypt(text: string) {
    const key = this.key;
    const iv = this.createIv();

    const cipher = crypto.createCipheriv(this.ENCRYPTION_ALGORITHM, key, iv);
    const encrypted = cipher.update(text, 'utf8', 'base64');

    return `${iv.toString('base64')}${this.DELIMITER}${encrypted}${cipher.final('base64')}`;
  }

  /**
   * Decrypt a string.
   *
   * @param encryptedText Encrypted text.
   *
   * @returns Decrypted text.
   */
  static decrypt(encryptedText: string) {
    const key = this.key;

    const [iv, encrypted] = encryptedText.split(':');
    if (!iv || iv.length !== this.IV_BASE64_LENGTH || !encrypted) {
      throw new Error('Invalid encrypted text.');
    }

    const decipher = crypto.createDecipheriv(this.ENCRYPTION_ALGORITHM, Buffer.from(key), Buffer.from(iv));
    const decrypted = decipher.update(encrypted, 'base64', 'utf8');

    return `${decrypted}${decipher.final('utf8')}`;
  }

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

  /** @returns Secret key. */
  private static get key(): Buffer {
    if (!this._key) {
      const secretKey = EnvUtils.getString('SECRET_KEY');
      this._key = crypto.createHash('sha256').update(secretKey).digest().subarray(0, this.KEY_LENGTH);
    }

    return this._key;
  }

  /**
   * Create a random initialization vector.
   *
   * @returns Random initialization vector.
   */
  private static createIv(): Buffer {
    return crypto.randomBytes(this.IV_LENGTH);
  }
}
