import { Container } from 'inversify';
import * as scrypt from 'scrypt-async';

import { HelloService } from '../service/hello.service';
import { ScryptService } from '../service/scrypt.service';
import { ScryptStatic } from 'scrypt-async';
import TYPES from '../constant/types';

export const serverContainer = new Container();

serverContainer.bind<HelloService>(TYPES.HelloService).to(HelloService);
serverContainer.bind<ScryptStatic>(TYPES.Scrypt).toConstantValue(scrypt);
serverContainer.bind<ScryptService>(TYPES.ScryptService).to(ScryptService);
