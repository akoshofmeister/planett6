import * as express from 'express';
import { inject } from 'inversify';
import { controller, httpPost, request, response } from 'inversify-express-utils';

import TYPES from '../constant/types';
import { IUser } from '../interfaces/user';
import { UserService } from '../service/user/user.service';

@controller('/user/')
export class UserController {
  constructor(@inject(TYPES.UserService) private userService: UserService) {
  }

  @httpPost('login')
  public async login(@request() req: express.Request,
                     @response() res: express.Response): Promise<IUser> {
    try {
      return await this.userService.authenticate(req.body.username, req.body.password);
    } catch (err) {
      res.status(err.statusCode).json({
        error: {
          message: err.message
        }
      });
    }
  }
}
