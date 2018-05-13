import { injectable } from 'inversify';
import { sign, verify } from 'jsonwebtoken';

import { JWT_OPTIONS, JWT_SECRET } from '../../constant/jwt';
import { IJwtPayload } from '../../model/jwt-payload';

@injectable()
export class JwtService {
  public createToken(payload: IJwtPayload): string {
    return sign(payload, JWT_SECRET, JWT_OPTIONS);
  }

  public validateToken(token: string): Promise<object | string> {
    return new Promise((resolve, reject) => {
      verify(token, JWT_SECRET, JWT_OPTIONS, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });
  }
}
