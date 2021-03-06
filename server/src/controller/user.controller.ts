import { Request, Response } from 'express';
import { Container, inject } from 'inversify';
import { controller, httpGet, httpPost, request, response } from 'inversify-express-utils';

import TYPES from '../constant/types';
import { IUser, IUserWithToken } from '../interfaces/user';
import { AuthMiddlewareType } from '../middleware/auth';
import { ICustomRequest } from '../model/request';
import { UserService } from '../service/user/user.service';
import { ValidatorService } from '../service/validator/validator.service';

export const userControllerFactory = (container: Container) => {
  @controller('/user/')
  class UserController {
    constructor(@inject(TYPES.UserService) private userService: UserService,
                @inject(TYPES.ValidatorService) private validatorService: ValidatorService) {
    }

    @httpPost('login')
    public async login(@request() req: Request,
                       @response() res: Response): Promise<IUserWithToken> {
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
    public async register(@request() req: Request,
                          @response() res: Response): Promise<IUser> {
      try {
        if (await this.validatorService.validateRegisterRequest(req.body)) {
          return await this.userService.addUser(req.body.username, req.body.password);
        }
      } catch (err) {
        res.status(err.statusCode || 400).json({
          error: {
            message: err.message
          }
        });
      }
    }

    @httpGet('', container.get<AuthMiddlewareType>(TYPES.AuthMiddleware))
    public async getUser(@request() req: Request & ICustomRequest,
                         @response() res: Response): Promise<IUser> {
      return req.user;
    }
  }

  return UserController;
};
