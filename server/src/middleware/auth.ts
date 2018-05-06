import * as express from 'express';

import TYPES from '../constant/types';
import { serverContainer } from '../container/container';
import { HttpError } from '../model/http-error';
import { IJwtPayload } from '../model/jwt-payload';
import { IRequest } from '../model/request';
import { JwtService } from '../service/jwt/jwt.service';
import { UserService } from '../service/user/user.service';

const userService = serverContainer.get<UserService>(TYPES.UserService);
const jwtService = serverContainer.get<JwtService>(TYPES.JwtService);

async function getUsernameFromToken(token: string): Promise<string> {
  return new Promise<string|null>(async (resolve, reject) => {
    try {
      const decoded = (await jwtService.validateToken(token)) as IJwtPayload;
      if (decoded.username) {
        resolve(decoded.username);
      } else {
        reject(new HttpError('Invalid token', 400));
      }
    } catch (err) {
      reject(new HttpError(err.message, 400));
    }
  });
}

const authMiddleware = () => {
  return async (req: express.Request & IRequest, res: express.Response, next: express.NextFunction) => {
    const token = req.header('x-auth-token');
    if (!token) {
      res.status(401).json({
        error: {
          message: 'No x-auth-token specified'
        }
      });
      res.end();
      return;
    }
    try {
      const username = await getUsernameFromToken(token);
      const user = await userService.findUser(username);
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(400).json({
          error: {
            message: 'User does not exist'
          }
        });
        res.end();
      }
    } catch (err) {
      res.status(err.statusCode || 400).json({
        error: {
          message: err.message
        }
      });
      res.end();
    }
  };
};

export { authMiddleware };
