import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { DatabaseEntity } from '../helpers/miscellaneous/database-entity';

export const TableName = 'blacklist_tokens';

@Entity({ name: TableName, orderBy: { expiredAt: 'DESC' } })
export class BlacklistToken extends DatabaseEntity {
  constructor(data?: { [P in keyof BlacklistToken]?: BlacklistToken[P]}) {
    super(data, ['token', 'issuer', 'target', 'createdAt', 'expiredAt']);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ name: 'token', type: 'varchar', length: 255 })
  token: string;

  @ManyToOne(type => User, { onDelete: 'CASCADE' })
  issuer: User;

  @ManyToOne(type => User, { onDelete: 'CASCADE' })
  target: User;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Column({ name: 'expired_at', type: 'timestamp' })
  expiredAt: Date;

  @CreateDateColumn({ name: 'blacklisted_at' })
  blacklistedAt: Date;
}
