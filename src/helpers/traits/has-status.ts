import { Column } from 'typeorm';
import { EntityStatus } from '../constants/entity-status';

export class HasStatus {
  @Column({ name: 'status', default: EntityStatus.ACTIVE })
  status: EntityStatus;
}
