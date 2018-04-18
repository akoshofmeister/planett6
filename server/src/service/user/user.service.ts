import { injectable } from 'inversify';

import { IUser } from '../../interfaces/user';
import { model as userModel } from '../../model/user';

@injectable()
export class UserService {
  public async authenticate(username: string, password: string): Promise<IUser> {
    return (await userModel.authenticate(username, password) ? this.findUser(username) : null);
  }

  public async findUser(username: string): Promise<IUser> {
    const user = await userModel.findOne({
      username
    });
    return {
      username: user.username
    };
  }
}
