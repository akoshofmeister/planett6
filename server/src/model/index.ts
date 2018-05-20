import TYPES from '../constant/types';
import { serverContainer } from '../container/container';
import { UserModel, userModel } from './user';

serverContainer.bind<UserModel>(TYPES.UserModel).toConstantValue(userModel);
