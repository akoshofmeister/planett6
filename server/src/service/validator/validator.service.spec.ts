/* tslint:disable:no-unused-expression */
import { expect } from 'chai';
import { stub } from 'sinon';

import { ValidatorService } from './validator.service';

describe('Validator service', () => {
  let validatorService;
  let mockAjv;
  let validatorStub;
  const mockLoginRequest = {
    username: 'testUser',
    password: 'testPassword'
  }; // Login and register requests are basically the samer

  beforeEach(() => {
    validatorStub = stub().returns(true);
    mockAjv = {
      compile: stub().returns(validatorStub)
    };
    validatorService = new ValidatorService(mockAjv);
  });

  it('should create login and register validators using Ajv', () => {
    expect(mockAjv.compile).to.have.been.calledTwice;
  });

  describe('validateLoginRequest', () => {
    it('should validate login requests using login validator', async () => {
      validatorService.validateLoginRequest(mockLoginRequest);
    });
  });

  describe('validateRegisterRequest', () => {
    it('should validate register requests using register validator', async () => {
      validatorService.validateRegisterRequest(mockLoginRequest);
    });
  });
});
