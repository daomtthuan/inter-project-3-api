import { DeleteDateColumn, Entity } from 'typeorm';

import { Nullable } from '~/common/types/core';

import { EntityBaseWithTrackable } from './_base-trackable.entity';

/** Base Entity. */
@Entity()
export abstract class EntityBase extends EntityBaseWithTrackable {
  /** Deleted at. */
  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'datetime',
    nullable: true,
  })
  deletedAt?: Nullable<Date>;

  /** @returns Is deleted. */
  get isDeleted(): boolean {
    return !!this.deletedAt;
  }
}
