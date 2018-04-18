import { prop, Typegoose, staticMethod, pre, ModelType } from 'typegoose';

import { bindDependencies } from '../container/container';
import { HttpError } from './http-error';
import { ScryptService } from '../service/scrypt/scrypt.service';
import TYPES from '../constant/types';
import { inject } from 'inversify';

const scryptHasherFactory = (scryptService: ScryptService) => {
  return (password) => scryptService.hash(password);
};

const scryptVerifierFactory = (scryptService: ScryptService) => {
  return (hash, password) => scryptService.verifyHash(hash, password);
};

const scryptHasher = bindDependencies(scryptHasherFactory, [TYPES.ScryptService])();
const scryptVerifier = bindDependencies(scryptVerifierFactory, [TYPES.ScryptService])();

@pre<User>('save', function (next) {
  if (!this._password)
    return next();
  scryptHasher(this._password).then(hash => {
    this.pwHash = hash;
    next();
  }).catch(err => next(err));
})
export class User extends Typegoose {
  @prop()
  username: string;
  @prop()
  pwHash?: string;

  private _password?: string;

  constructor(username?: string, password?: string) {
    super();
    this.username = username;
    this._password = password;
  }

  @inject(TYPES.ScryptService)
  private _scryptService?: ScryptService;

  @staticMethod
  static authenticate(this: ModelType<User> & typeof User, username: string, password: string) : Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.findOne({ username })
        .exec((err, user) => {
          if (err) {
            reject(err);
            return;
          } else if (!user) {
            reject(new HttpError('User not found.', 400));
            return;
          }

          scryptVerifier(user.pwHash, password).then((result) => {
            if(result) {
              resolve(true);
              return;
            } else {
              reject(new HttpError('Wrong password', 401));
              return;
            }
          }).catch((err) => {
            reject(new HttpError(err.message, 401));
          })
        });
    });
  }
}

export const model = new User().getModelForClass(User);
