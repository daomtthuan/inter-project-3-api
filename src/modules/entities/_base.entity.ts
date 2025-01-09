import { Transform } from 'class-transformer';
import { BaseEntity as Base, BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';

@Entity()
export abstract class BaseEntity extends Base {
  @Transform(({ value }) => value.toISOString())
  @Column({
    default: () => 'datetime()',
  })
  createdAt!: Date;

  @Transform(({ value }) => value.toISOString())
  @Column({
    default: () => 'datetime()',
  })
  updatedAt!: Date;

  @BeforeInsert()
  setCreatedAt() {
    this.createdAt = new Date();
  }

  @BeforeUpdate()
  setUpdatedAt() {
    this.updatedAt = new Date();
  }
}
