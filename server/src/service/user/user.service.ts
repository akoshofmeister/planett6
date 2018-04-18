import { injectable } from 'inversify';
import { model as userModel } from '../../model/user';
import { User } from '../../interfaces/user';

@injectable()
export class UserService {
  constructor() {
  }

  public async authenticate(username: string, password: string): Promise<User> {
    return (await userModel.authenticate(username, password) ? this.findUser(username) : null);
  }

  public async findUser(username: string): Promise<User> {
    const user = await userModel.findOne({
      username
    });
    return {
      username: user.username
    }
  }
}


