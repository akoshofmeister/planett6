import TYPES from '../../constant/types';
import { serverContainer } from '../../container/container';
import { UserService } from './user.service';

serverContainer.bind<UserService>(TYPES.UserService).to(UserService);
