import { JwtPayload } from 'jsonwebtoken';

export interface JwtPayloadDto extends JwtPayload {
  // Issuer: verify whitelist of issuer
  // iss: string;
  // The target audience which was issued the token
  // aud: string;
  // issued at - to reject if the token is too old
  // iat: number;
  // Not before time - token should be rejected before the time
  //nbf: number;
  /**
   * To avoid that in the same time, same user, same scope, same content will generate the same token
   * This would be a random id to generate such a different token
   */
  // jti: string;
  sub: string;
  fullName: string;
  permissions: Record<string, number>;
  hashTag: string;
}
