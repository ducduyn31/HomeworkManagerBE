import { User } from '../../user/user.entity';
import { UserAuth } from '../../auth/auth.entity';

export interface IUserAuth {
  user: User;
  auth: UserAuth;
}
