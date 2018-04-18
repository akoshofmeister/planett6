import { UserService } from './user.service';
import { serverContainer } from '../../container/container';
import TYPES from '../../constant/types';

serverContainer.bind<UserService>(TYPES.UserService).to(UserService);
