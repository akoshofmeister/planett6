import { injectable } from 'inversify';

import { IUser, IUserWithToken } from '../../interfaces/user';
import { HttpError } from '../../model/http-error';
import { model as userModel } from '../../model/user';

@injectable()
export class UserService {
  public async authenticate(username: string, password: string): Promise<IUserWithToken> {
    return (await userModel.authenticate(username, password) ? {
      user: await this.findUser(username),
      authToken: 'VALID_AUTH_TOKEN' // TODO: make this work
    } : null);
  }

  public async findUser(username: string): Promise<IUser> {
    const user = await userModel.findOne({
      username
    });
    return {
      username: user.username
    };
  }

  public async addUser(username: string, password: string): Promise<IUser> {
    try {
      const user = await userModel.create({
        username,
        password
      });
      await user.save();
      return {
        username: user.username
      };
    } catch (err) {
      if (err.message.includes('E11000 duplicate')) {
        throw new HttpError('Username already exists', 400);
      }
    }
  }
}
