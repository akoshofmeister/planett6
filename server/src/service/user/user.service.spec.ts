/* tslint:disable:no-unused-expression */
import { expect } from 'chai';
import { spy, stub } from 'sinon';

import { UserService } from './user.service';

describe('User service', () => {
  let userService: UserService;
  let jwtServiceMock;
  let userModelMock;
  let userSaveSpy;

  const testUsername = 'testUsername';
  const testPassword = 'testPassword';
  const testToken = 'testToken';

  beforeEach(() => {
    userSaveSpy = stub();
    jwtServiceMock = {
      createToken: stub()
    };
    userModelMock = {
      authenticate: stub(),
      create: stub().callsFake((obj) => ({
        username: obj.username,
        save: userSaveSpy
      })),
      findOne: stub().callsFake((obj) => ({
        username: obj.username
      }))
    };
    userService = new UserService(jwtServiceMock, userModelMock);
  });

  describe('addUser', () => {
    it('should create an user from UserModel', async () => {
      await userService.addUser(testUsername, testPassword);
      expect(userModelMock.create).to.have.been.calledWith({
        username: testUsername,
        password: testPassword
      });
    });

    it('should save the created user', async () => {
      await userService.addUser(testUsername, testPassword);
      expect(userSaveSpy).to.have.been.called;
    });

    it('should return the saved user details', async () => {
      const user = await userService.addUser(testUsername, testPassword);
      expect(user.username).to.equal(testUsername);
    });

    describe('when saving duplicate username', () => {
      beforeEach(() => {
        userSaveSpy.throws(new Error('E11000 duplicate'));
      });

      it('should throw an error', async () => {
        await expect(userService.addUser(testUsername, testPassword)).to.be.rejectedWith('Username already exists');
      });
    });
  });

  describe('findUser', () => {
    it('should find an user by username using UserModel', async () => {
      await userService.findUser(testUsername);
      expect(userModelMock.findOne).to.have.been.calledWith({
        username: testUsername
      });
    });

    it('should return found user', async () => {
      const user = await userService.findUser(testUsername);
      expect(user.username).to.equal(testUsername);
    });
  });

  describe('authenticate', () => {
    it('should authenticate using userModel', async () => {
      const user = await userService.authenticate(testUsername, testPassword);
      expect(userModelMock.authenticate).to.have.been.calledWith(testUsername, testPassword);
    });

    describe('when authentication is successful', () => {
      beforeEach(() => {
        userModelMock.authenticate.returns(true);
        jwtServiceMock.createToken.returns(testToken);
      });

      it('should find user using userModel', async () => {
        const user = await userService.authenticate(testUsername, testPassword);
        expect(userModelMock.findOne).to.have.been.calledWith({
          username: testUsername
        });
      });

      it('should return found user', async () => {
        const user = await userService.authenticate(testUsername, testPassword);
        expect(user.user.username).to.equal(testUsername);
      });

      it('should create JWT using JwtService', async () => {
        const userWithToken = await userService.authenticate(testUsername, testPassword);
        expect(userWithToken.authToken).to.equal(testToken);
      });
    });
  });
});
