import { expect } from 'chai';

import { ScryptService } from './scrypt.service';

describe('Scrypt service', () => {
  let scryptService: ScryptService;

  const mockHash = 'testHash';
  const mockScrypt = (input, salt, options, callback) => {callback(mockHash)};

  beforeEach(() => {
    scryptService = new ScryptService(mockScrypt);
  });

  describe('hash', () => {
    it('should create hash using Scrypt', async () => {
      expect(await scryptService.hash('test input')).to.equal(mockHash);
    });
  });
});
