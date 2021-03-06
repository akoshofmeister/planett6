import { Ajv, ValidateFunction } from 'ajv';
import { inject, injectable } from 'inversify';

import TYPES from '../../constant/types';
import { HttpError } from '../../model/http-error';
import { loginSchema, registerSchema } from '../../model/schemas';

@injectable()
export class ValidatorService {
  private _loginValidator: ValidateFunction;
  private _registerValidator: ValidateFunction;

  constructor(@inject(TYPES.Ajv) private _ajv: Ajv) {
    this._loginValidator = _ajv.compile(loginSchema);
    this._registerValidator = _ajv.compile(registerSchema);
  }

  public validateLoginRequest(body: any): Promise<boolean> {
    return this._validateRequest(body, this._loginValidator);
  }

  public validateRegisterRequest(body: any): Promise<boolean> {
    return this._validateRequest(body, this._registerValidator);
  }

  private _validateRequest(body: any, validator: ValidateFunction): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const valid = validator(body);

      if (!valid) {
        const error = validator.errors[0];
        reject(new HttpError(error.dataPath + ' ' + error.message, 400));
      } else {
        resolve(true);
      }
    });
  }
}
