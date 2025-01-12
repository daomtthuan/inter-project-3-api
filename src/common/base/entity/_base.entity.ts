import { DeleteDateColumn, Entity } from 'typeorm';

import { EntityBaseWithTrackable } from './_base-trackable.entity';

/** Base Entity. */
@Entity()
export abstract class EntityBase extends EntityBaseWithTrackable {
  /** Deleted at. */
  @DeleteDateColumn()
  deletedAt?: Date;

  /** @returns Is deleted. */
  get isDeleted(): boolean {
    return !!this.deletedAt;
  }
}
