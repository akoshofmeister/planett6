import * as express from "express";
import { Container } from 'inversify';
import { serverContainer } from '../container/container'
import { UserService } from '../service/user/user.service';
import TYPES from '../constant/types';
import { HttpError } from '../model/http-error';

const userService = serverContainer.get<UserService>(TYPES.UserService);

async function getUsernameFromToken(token: string) {
  return new Promise<string|null>((resolve) => {
    if (token === 'VALID_TOKEN') {
      resolve('asd');
    } else {
      resolve(null);
    }
  });
}

function authMiddlewareFactory(container: Container) {
  return (config: { role: string }) => {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const token = req.header('x-auth-token');
      const username = await getUsernameFromToken(token);
      if (username !== null) {
        const user = userService.findUser(username);
        if (user) {
          next();
        } else {
          res.status(403).end(new Error('Wrong password'));
        }
      } else {
        res.status(401).end(new Error('Invalid username'));
      }
    };
  };
}

const authMiddleware = authMiddlewareFactory(serverContainer);

export { authMiddleware };
