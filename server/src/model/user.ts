import { inject } from 'inversify';
import { HookNextFunction } from 'mongoose';
import { ModelType, pre, prop, staticMethod, Typegoose } from 'typegoose';

import TYPES from '../constant/types';
import { bindDependencies } from '../container/container';
import { ScryptService } from '../service/scrypt/scrypt.service';
import { HttpError } from './http-error';

const scryptHasherFactory = (scryptService: ScryptService) => {
  return (password) => scryptService.hash(password);
};

const scryptVerifierFactory = (scryptService: ScryptService) => {
  return (hash, password) => scryptService.verifyHash(hash, password);
};

const scryptHasher = bindDependencies(scryptHasherFactory, [TYPES.ScryptService])();
const scryptVerifier = bindDependencies(scryptVerifierFactory, [TYPES.ScryptService])();

@pre<User>('save', function(next: HookNextFunction) {
  if (!this._password) {
    return next();
  }
  scryptHasher(this._password).then((hash) => {
    this.pwHash = hash;
    next();
  }).catch((err) => next(err));
})
export class User extends Typegoose {
  @staticMethod
  public static authenticate(this: ModelType<User> & typeof User,
                             username: string, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.findOne({ username })
        .exec((error, user) => {
          if (error) {
            reject(error);
            return;
          } else if (!user) {
            reject(new HttpError('User not found.', 400));
            return;
          }

          scryptVerifier(user.pwHash, password).then((result) => {
            if (result) {
              resolve(true);
              return;
            } else {
              reject(new HttpError('Wrong password', 401));
              return;
            }
          }).catch((err) => {
            reject(new HttpError(err.message, 401));
          });
        });
    });
  }

  @prop({unique: true})
  public username: string;
  @prop()
  public pwHash?: string;

  @prop()
  public set password(pw) {
    this._password = pw;
  }

  private _password?: string;

  constructor(username?: string, password?: string) {
    super();
    this.username = username;
    this._password = password;
  }
}

export const model = new User().getModelForClass(User);
