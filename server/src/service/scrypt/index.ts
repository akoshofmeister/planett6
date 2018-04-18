import { ScryptService } from './scrypt.service';
import { serverContainer } from '../../container/container';
import TYPES from '../../constant/types';

serverContainer.bind<ScryptService>(TYPES.ScryptService).to(ScryptService);
