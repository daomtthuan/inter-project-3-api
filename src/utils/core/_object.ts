import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Class } from 'type-fest';

export class ObjectUtils {
  /**
   * Create an instance of a class.
   *
   * @param cls Class.
   * @param data Plain object.
   *
   * @returns Instance.
   */
  static async createInstance<TData, TType extends object>(cls: Class<TType>, data: TData): Promise<TType | null> {
    const instance = plainToInstance(cls, data);
    const errors = await validate(instance);
    if (errors.length) {
      return null;
    }

    return instance;
  }
}
