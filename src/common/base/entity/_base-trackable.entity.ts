import { CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

import { EntityBaseWidthId } from './_base-id.entity';

/** Base Entity with trackable. */
@Entity()
export abstract class EntityBaseWithTrackable extends EntityBaseWidthId {
  /** Created at. */
  @CreateDateColumn()
  createdAt!: Date;

  /** Updated at. */
  @UpdateDateColumn()
  updatedAt!: Date;
}
