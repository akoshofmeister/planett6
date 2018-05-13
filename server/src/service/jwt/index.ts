import TYPES from '../../constant/types';
import { serverContainer } from '../../container/container';
import { JwtService } from './jwt.service';

serverContainer.bind<JwtService>(TYPES.JwtService).to(JwtService);
