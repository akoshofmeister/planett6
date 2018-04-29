import * as express from 'express';
import { inject } from 'inversify';
import { controller, httpPost, request, response } from 'inversify-express-utils';

import TYPES from '../constant/types';
import { IUser } from '../interfaces/user';
import { UserService } from '../service/user/user.service';
import { ValidatorService } from "../service/validator/validator.service";

@controller('/user/')
export class UserController {
  constructor(@inject(TYPES.UserService) private userService: UserService,
              @inject(TYPES.ValidatorService) private validatorService: ValidatorService) {
  }

  @httpPost('login')
  public async login(@request() req: express.Request,
                     @response() res: express.Response): Promise<IUser> {
    try {
      if (await this.validatorService.validateLoginRequest(req.body)) {
        return await this.userService.authenticate(req.body.username, req.body.password);
      }
    } catch (err) {
      res.status(err.statusCode).json({
        error: {
          message: err.message
        }
      });
    }
  }

  @httpPost('register')
  public async register(@request() req: express.Request,
                        @response() res: express.Response): Promise<IUser> {
    try {
      if (await this.validatorService.validateRegisterRequest(req.body)) {
        return await this.userService.addUser(req.body.username, req.body.password);
      }
    } catch (err) {
      res.status(err.statusCode  || 400).json({
        error: {
          message: err.message
        }
      });
    }
  }
}
