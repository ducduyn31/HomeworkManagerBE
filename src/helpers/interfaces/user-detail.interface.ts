import { User } from '../../user/user.entity';
import { UserAuth } from '../../auth/auth.entity';

export interface UserDetail {
  user: User;
  auth: UserAuth;
}
