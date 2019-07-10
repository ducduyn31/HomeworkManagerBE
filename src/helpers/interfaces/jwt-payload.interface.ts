export interface JwtPayload {
  username: string;
  id: number;
  iat?: number;
  exp?: number;
}
