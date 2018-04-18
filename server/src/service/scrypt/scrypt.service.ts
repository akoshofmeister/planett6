import { inject, injectable } from 'inversify';
import TYPES from '../../constant/types';
import { ScryptStatic } from 'scrypt-async';
import { PASSWORD_SALT, SCRYPT_OPTIONS } from '../../constant/scrypt';

@injectable()
export class ScryptService {
  constructor(@inject(TYPES.Scrypt) private _scrypt: ScryptStatic) {
  }

  public hash(input: string): Promise<string> {
    return new Promise<string>((resolve) => {
      this._scrypt(input, PASSWORD_SALT, SCRYPT_OPTIONS, (hash) => {
        resolve(hash);
      });
    });
  }

  public async verifyHash(hash: string, input: string): Promise<boolean> {
    return await this.hash(input) === hash;
  }
}

