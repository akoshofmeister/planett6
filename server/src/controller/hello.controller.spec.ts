import 'reflect-metadata';
import { HelloController } from './hello.controller';
import { expect } from 'chai';
import { SinonStub, stub } from 'sinon';
import * as MockResponse from 'mock-express-response';

describe('Hello controller', () => {
  const mockWelcomeMessage = 'test welcome message';
  const mockWelcome = () => mockWelcomeMessage;
  let controller: HelloController;
  let helloServiceMock;
  beforeEach(() => {
    helloServiceMock = {
      welcome: mockWelcome
    };
    controller = new HelloController(helloServiceMock);
  });

  describe('GET /hello',() => {
    let mockWelcomeStub: SinonStub;

    beforeEach(() => {
      mockWelcomeStub = stub(helloServiceMock, "welcome").callThrough()
    });

    it('should welcome with message from service', () => {
      expect(controller.hello(new MockResponse())).to.equal(mockWelcomeMessage);
      expect(mockWelcomeStub.called).to.be.true;
    });
  });

  describe('GET /', () => {
    it('should work', () => {
      expect(controller.get()).to.equal('Works');
    });
  });
});
