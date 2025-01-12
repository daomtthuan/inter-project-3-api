import { BaseEntity, Entity, PrimaryGeneratedColumn } from 'typeorm';

/** Base Entity with Id. */
@Entity()
export abstract class EntityBaseWidthId extends BaseEntity {
  /** ID of the entity. */
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id!: string;
}
