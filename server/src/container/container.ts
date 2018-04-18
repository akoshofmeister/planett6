import { Container } from 'inversify';
import * as scrypt from 'scrypt-async';
import { ScryptStatic } from 'scrypt-async';

import TYPES from '../constant/types';
const serverContainer = new Container();

serverContainer.bind<ScryptStatic>(TYPES.Scrypt).toConstantValue(scrypt);

const bindDependencies = (func: Function, dependencies: symbol[]) => {
  let injections = dependencies.map((dependency) => {
    return serverContainer.get(dependency);
  });
  return func.bind(func, ...injections);
};

export { serverContainer, bindDependencies };
