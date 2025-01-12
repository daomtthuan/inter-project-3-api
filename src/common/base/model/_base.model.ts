import { Nullable } from '~/common/types/core';

import { ModelBaseWithTrackable } from './_base-trackable.model';

/** Base Model. */
export class ModelBase extends ModelBaseWithTrackable {
  /** Deleted at. */
  deletedAt?: Nullable<Date>;
}
