import { Container } from 'inversify';
import TYPES from '../constant/types';
import { HelloService } from '../service/hello.service';

export const serverContainer = new Container();

serverContainer.bind<HelloService>(TYPES.HelloService).to(HelloService);