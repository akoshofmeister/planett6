import { prop, Typegoose, staticMethod, pre, ModelType } from 'typegoose';

import { HttpError } from './http-error';
import { serverContainer } from '../container/container';
import { ScryptService } from '../service/scrypt.service';
import TYPES from '../constant/types';

const scryptService = serverContainer.get<ScryptService>(TYPES.ScryptService);

@pre<User>('save', function (next) {
  if (!this._password)
    return next();
  scryptService.hash(this._password).then(hash => {
    this.pwHash = hash;
    next();
  }).catch(err => next(err));
})
export class User extends Typegoose {
  @prop()
  username: string;
  @prop()
  pwHash: string;

  private _password: string;

  @prop()
  set password(password: string) {
    this._password = password;
  }

  @staticMethod
  static authenticate(this: ModelType<User> & typeof User, username: string, password: string) : Promise<User> {
    return new Promise((resolve, reject) => {
      this.findOne({ username })
        .exec((err, user) => {
          if (err) {
            reject(err);
          } else if (!user) {
            const err = new HttpError('User not found.', 400);
            reject(err);
          }

          scryptService.verifyHash(user.pwHash, password).then((result) => {
            if(result) {
              resolve(user);
            } else {
              reject(new HttpError('Wrong password', 401));
            }
          }).catch((err) => {
            reject(new HttpError(err.message, 401));
          })
        });
    });
  }
}

export const model = new User().getModelForClass(User);
