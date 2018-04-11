import TYPES from '../constant/types';
import { inject } from 'inversify';
import * as express from 'express';
import { controller, httpGet, response } from 'inversify-express-utils';
import { HelloService } from '../service/hello.service';
import { model as User, User as UserType } from '../model/user';
import { HttpError } from '../model/http-error';

@controller('/')
export class HelloController {
  constructor(@inject(TYPES.HelloService) private helloService: HelloService) {
  }

  @httpGet('')
  public get(): string {
    return 'Works';
  }

  @httpGet('hello')
  public async hello(@response() res: express.Response): Promise<UserType> {
    try {
      return await User.authenticate('asd', 'asd');
    } catch (err) {
      res.status(err.statusCode).json({
        error: {
          message: err.message
        }
      });
    }
  }
}
