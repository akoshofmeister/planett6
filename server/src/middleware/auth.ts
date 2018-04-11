import * as express from "express";
import { Container } from 'inversify';
import * as TYPES from '../constant/types';
import { serverContainer } from '../container/container'

function authMiddlewareFactory(container: Container) {
  return (config: { role: string }) => {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {

    };
  };
}

const authMiddleware = authMiddlewareFactory(serverContainer);

export { authMiddleware };
