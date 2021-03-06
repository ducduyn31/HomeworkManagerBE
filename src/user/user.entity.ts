import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DatabaseEntity } from '../helpers/miscellaneous/database-entity';
import { SoftDelete } from '../helpers/traits/soft-delete';

export const TableName = 'user';

@Entity({ name: TableName })
@SoftDelete()
export class User extends DatabaseEntity {
  constructor(data?: { [P in keyof User]?: User[P] }) {
    super(data, [
      'displayName',
      'email',
      'dateOfBirth',
      'phone',
      'gender',
      'avatar',
    ]);
  }

  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'display_name', length: 50, nullable: false })
  displayName: string;

  @Column({ name: 'email', length: 50, nullable: false })
  email: string;

  @Column({ name: 'dob', type: 'timestamp' })
  dateOfBirth: Date;

  @Column({ name: 'phone', length: 20, nullable: true })
  phone: string;

  @Column({ name: 'gender', default: 'unknown' })
  gender: string;

  @Column({ name: 'avatar', nullable: true })
  avatar: string;
}
