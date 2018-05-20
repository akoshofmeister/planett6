import TYPES from '../constant/types';
import { serverContainer } from '../container/container';
import { authMiddleware, AuthMiddlewareType } from './auth';

serverContainer.bind<AuthMiddlewareType>(TYPES.AuthMiddleware).toConstantValue(authMiddleware);
