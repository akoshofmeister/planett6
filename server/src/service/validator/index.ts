import TYPES from '../../constant/types';
import { serverContainer } from '../../container/container';
import { ValidatorService } from './validator.service';

serverContainer.bind<ValidatorService>(TYPES.ValidatorService).to(ValidatorService);
