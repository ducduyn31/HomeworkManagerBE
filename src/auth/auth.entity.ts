import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { DatabaseEntity } from '../helpers/miscellaneous/database-entity';

export const TableName = 'user_auth';

@Entity({ name: TableName })
export class UserAuth extends DatabaseEntity {
  constructor(data?: any) {
    super(data, [
      'username',
    ], [
      'hashPassword',
    ]);
  }

  @PrimaryColumn({ name: 'user_id' })
  id?: number;

  @Column({ unique: true })
  username: string;

  @Column({ name: 'hash_password' })
  hashPassword: string;

  @OneToOne(type => User)
  @JoinColumn({ name: 'user_id' })
  user?: User;
}
