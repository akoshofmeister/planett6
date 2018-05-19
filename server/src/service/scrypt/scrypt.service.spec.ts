/* tslint:disable:no-unused-expression */
import { expect } from 'chai';
import { stub } from 'sinon';

import { ScryptService } from './scrypt.service';

describe('Scrypt service', () => {
  let scryptService: ScryptService;

  const testHash = 'testHash';
  const invalidTestHash = 'invalidTestHash';
  const testInput = 'testInput';

  const mockScrypt = stub().callsFake((input, salt, options, callback) => {
    callback(testHash);
  });

  beforeEach(() => {
    scryptService = new ScryptService(mockScrypt);
  });

  describe('hash', () => {
    it('should create hash using Scrypt', async () => {
      const result = await scryptService.hash(testInput);
      expect(mockScrypt).to.have.been.calledWith(testInput);
      expect(result).to.equal(testHash);
    });
  });

  describe('verifyHash', () => {
    it('should verify by hashing and comparing', async () => {
      const result = await scryptService.verifyHash(testHash, testInput);
      expect(mockScrypt).to.have.been.calledWith(testInput);
    });

    it('should return true for valid hash', async () => {
      const result = await scryptService.verifyHash(testHash, testInput);
      expect(result).to.be.true;
    });

    it('should return false for invalid hash', async () => {
      const result = await scryptService.verifyHash(invalidTestHash, testInput);
      expect(result).to.be.false;
    });
  });
});
