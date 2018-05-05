import 'reflect-metadata';

import { expect } from 'chai';
import { HealthController } from './health.controller';

describe('Health controller', () => {
  const healthResponse = {
    success: true
  };

  let controller: HealthController;

  beforeEach(() => {
    controller = new HealthController();
  });

  describe('GET /health', () => {
    it('should work', () => {
      expect(controller.health()).to.deep.equal(healthResponse);
    });
  });
});
