import { Container } from 'inversify';
import * as scrypt from 'scrypt-async';
import { ScryptStatic } from 'scrypt-async';

import TYPES from '../constant/types';
const serverContainer = new Container();

serverContainer.bind<ScryptStatic>(TYPES.Scrypt).toConstantValue(scrypt);

/* tslint:disable:ban-types */
const bindDependencies = <T extends Function>(func: T, dependencies: symbol[]) => {
  const injections = dependencies.map((dependency) => {
    return serverContainer.get(dependency);
  });
  return func.bind(func, ...injections);
};
/* tslint:enable:ban-types */

export { serverContainer, bindDependencies };
