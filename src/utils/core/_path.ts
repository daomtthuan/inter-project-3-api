import Path from 'path';

/** Utility class for path operations. */
export class PathUtils {
  /** Root dir. */
  static readonly ROOT_DIR = Path.resolve(process.cwd());

  /** Src dir. */
  static readonly SRC_DIR = Path.resolve(this.ROOT_DIR, 'src');

  /** Dist dir. */
  static readonly DIST_DIR = Path.resolve(this.ROOT_DIR, 'dist');

  /**
   * Resolve a path from the src dir.
   *
   * @param segments Path segments.
   *
   * @returns Resolved path.
   */
  static resolveSrc(...segments: string[]): string {
    return Path.resolve(PathUtils.SRC_DIR, ...segments);
  }

  /**
   * Resolve a path from the dist dir.
   *
   * @param segments Path segments.
   *
   * @returns Resolved path.
   */
  static resolveDist(...segments: string[]): string {
    return Path.resolve(PathUtils.DIST_DIR, ...segments);
  }

  /**
   * Normalize a path.
   *
   * @param path Path to normalize.
   *
   * @returns Normalized path.
   */
  static normalize(path: string): string {
    return Path.normalize(path).replaceAll(Path.sep, '/');
  }
}
