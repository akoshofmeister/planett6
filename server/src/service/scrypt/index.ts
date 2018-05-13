import TYPES from '../../constant/types';
import { serverContainer } from '../../container/container';
import { ScryptService } from './scrypt.service';

serverContainer.bind<ScryptService>(TYPES.ScryptService).to(ScryptService);
