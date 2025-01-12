import { CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

import { EntityBaseWidthId } from './_base-id.entity';

/** Base Entity with trackable. */
@Entity()
export abstract class EntityBaseWithTrackable extends EntityBaseWidthId {
  /** Created at. */
  @CreateDateColumn({
    name: 'created_at',
    type: 'datetime',
    nullable: false,
  })
  createdAt!: Date;

  /** Updated at. */
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'datetime',
    nullable: false,
  })
  updatedAt!: Date;
}
