import { BaseEntity as Base, Column, Entity } from 'typeorm';

@Entity()
export abstract class BaseEntity extends Base {
  @Column({ default: Date.now() })
  createdAt!: Date;

  @Column({ default: Date.now() })
  updatedAt!: Date;
}
