import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Class } from 'type-fest';

import { ObjectUtils } from '~/utils/core';

import { MapperOptions } from './_base.factory.type';

/**
 * Model factory.
 *
 * @param cls Class.
 * @param options Mapper options.
 *
 * @returns Model class.
 */
export function ModelFactory<TType extends object>(cls: Class<TType>, options: MapperOptions<TType> = {}) {
  return class extends cls {
    /**
     * Create a model instance.
     *
     * @param data Plain object to transform.
     * @param mapperOptions Mapper options.
     *
     * @returns Model instance.
     */
    static create<TData extends object = Partial<TType>>(data: TData, mapperOptions: MapperOptions<TType> = {}): TType {
      const { map, pick, omit } = { ...options, ...mapperOptions };

      let mappedData = map ? map(data) : data;
      if (pick?.length) {
        mappedData = ObjectUtils.filterProperties(mappedData, (key) => {
          const result = !!pick.includes(key);

          return result;
        });
      } else {
        mappedData = ObjectUtils.filterProperties(mappedData, (key) => key !== 'deletedAt' && !omit?.includes(key));
      }

      return plainToInstance(cls, mappedData);
    }

    /**
     * Validate model instance.
     *
     * @param data Plain object to transform.
     * @param mapperOptions Mapper options.
     *
     * @returns Model instance if valid, otherwise `null`.
     */
    static async validate<TData = Partial<TType>>(data: TData, mapperOptions: MapperOptions<TType> = {}): Promise<TType | null> {
      if (typeof data !== 'object' || data === null) {
        return null;
      }

      const instance = this.create(data, mapperOptions);
      const errors = await validate(instance);
      if (errors.length) {
        return null;
      }

      return instance;
    }
  };
}
