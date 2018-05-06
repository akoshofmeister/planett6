import * as express from 'express';

import TYPES from '../constant/types';
import { serverContainer } from '../container/container';
import { IRequest } from '../model/request';
import { UserService } from '../service/user/user.service';

const userService = serverContainer.get<UserService>(TYPES.UserService);

// TODO: make this work
async function getUsernameFromToken(token: string) {
  return new Promise<string|null>((resolve) => {
    if (token === 'VALID_AUTH_TOKEN') {
      resolve('asdf');
    } else {
      resolve(null);
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
    const username = await getUsernameFromToken(token);
    if (username !== null) {
      const user = await userService.findUser(username);
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(403).json({
          error: {
            message: 'Wrong token'
          }
        });
        res.end();
      }
    } else {
      res.status(401).json({
        error: {
          message: 'Not logged in'
        }
      });
      res.end();
    }
  };
};

export { authMiddleware };
