import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity({ name: 'user_auth' })
export class UserAuth {
  @PrimaryColumn({ name: 'user_id' })
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ name: 'hash_password' })
  hashPassword: string;

  @OneToOne(type => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
