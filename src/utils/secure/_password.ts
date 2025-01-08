import bcrypt from 'bcrypt';

/** Utility class for password operations. */
export class PasswordUtils {
  private static readonly SALT_ROUNDS = 10;

  /**
   * Hash a password.
   *
   * @param password Password to hash.
   *
   * @returns Hashed password.
   */
  static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Verify a password.
   *
   * @param password Password to verify.
   * @param hashedPassword Hashed password.
   *
   * @returns `true` if the password is valid, otherwise `false`.
   */
  static async verify(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  /**
   * Generate a salt.
   *
   * @returns Salt.
   */
  static async generateSalt(): Promise<string> {
    return bcrypt.genSalt(this.SALT_ROUNDS);
  }
}
