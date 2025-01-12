import { ModelBaseWithId } from './_base-id.model';

/** Base Model with trackable. */
export class ModelBaseWithTrackable extends ModelBaseWithId {
  /** Created at. */
  createdAt!: Date;

  /** Updated at. */
  updatedAt!: Date;
}
