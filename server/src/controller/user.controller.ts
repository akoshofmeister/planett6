import { inject } from 'inversify';
import * as express from 'express';
import { controller, httpPost, request, response } from 'inversify-express-utils';

import TYPES from '../constant/types';
import { User } from '../interfaces/user';
import { UserService } from '../service/user/user.service';
import { authMiddleware } from '../middleware/auth';

@controller('/user/')
export class UserController {
  constructor(@inject(TYPES.UserService) private userService: UserService) {
  }


  @httpPost('')
  public async getUser() {

  }

  @httpPost('login')
  public async login(@request() req: express.Request,
                     @response() res: express.Response): Promise<User> {
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
