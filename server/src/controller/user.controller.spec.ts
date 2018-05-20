import { expect } from 'chai';
import { Container } from 'inversify';
import { stub } from 'sinon';

import TYPES from '../constant/types';
import { userControllerFactory } from './user.controller';

describe('User controller', () => {
  const testUser = {
    username: 'testUsername'
  };
  const testPassword = 'testPassword';
  const mockRequest = {
    body: {
      username: testUser.username,
      password: testPassword
    }
  };

  const mockResponse = {
    status: stub().callsFake(() => mockResponse),
    json: stub().callsFake(() => mockResponse)
  };

  let container: Container;
  let controller;
  let userServiceMock;
  let validatorServiceMock;
  let authMiddlewareMock;

  beforeEach(() => {
    container = new Container();
    userServiceMock = {
      authenticate: stub().callsFake(async () => testUser),
      addUser: stub().callsFake(async () => testUser)
    };
    validatorServiceMock = {
      validateLoginRequest: stub().callsFake(async () => true),
      validateRegisterRequest: stub().callsFake(async () => true)
    };
    authMiddlewareMock = () => {
      // empty
    };
    container.bind(TYPES.AuthMiddleware).toConstantValue(authMiddlewareMock);
    controller = new (userControllerFactory(container))(userServiceMock, validatorServiceMock);
  });

  describe('POST /login', () => {
    it('should validate request using UalidatorService', async () => {
      await controller.login(mockRequest, mockResponse);
      expect(validatorServiceMock.validateLoginRequest).to.have.been.calledWith(mockRequest.body);
    });

    it('should authenticate with UserService', async () => {
      await controller.login(mockRequest, mockResponse);
      expect(userServiceMock.authenticate).to.have.been.calledWith(testUser.username, testPassword);
    });

    it('should return the logged in user', async () => {
      const user = await controller.login(mockRequest, mockResponse);
      expect(user).to.deep.equal(testUser);
    });
  });

  describe('POST /register', () => {
    it('should validate request using validatorService', async () => {
      const user = await controller.register(mockRequest, mockResponse);
      expect(validatorServiceMock.validateRegisterRequest).to.have.been.calledWith(mockRequest.body);
    });

    it('should add user with UserService', async () => {
      await controller.register(mockRequest, mockResponse);
      expect(userServiceMock.addUser).to.have.been.calledWith(testUser.username, testPassword);
    });

    it('should return the registered user', async () => {
      const user = await controller.register(mockRequest, mockResponse);
      expect(user).to.deep.equal(testUser);
    });
  });
});
