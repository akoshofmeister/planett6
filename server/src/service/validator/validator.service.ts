import { Ajv, ValidateFunction } from "ajv";
import { inject, injectable } from 'inversify';

import TYPES from '../../constant/types';
import { loginSchema } from "../../model/schemas";
import { HttpError } from "../../model/http-error";

@injectable()
export class ValidatorService {
  private _loginValidator: ValidateFunction;

  constructor(@inject(TYPES.Ajv) private _ajv: Ajv) {
    this._loginValidator = _ajv.compile(loginSchema);
  }

  public validateLoginRequest(body: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const valid = this._loginValidator(body);

      if (!valid) {
        const error = this._loginValidator.errors[0];
        reject(new HttpError(error.dataPath + ' ' + error.message, 400));
      } else {
        resolve(true);
      }
    });
  }
}
