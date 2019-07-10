import { AuthController } from '../../auth/auth.controller';

export const AuthWhitelist: Array<{ handlerName: string; class: any }> = [
  {
    handlerName: 'signIn',
    class: AuthController,
  },
  {
    handlerName: 'createAuth',
    class: AuthController,
  },
  {
    handlerName: 'refresh',
    class: AuthController,
  },
];
