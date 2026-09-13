import { Test, TestingModule } from '@nestjs/testing';

jest.mock('@thallesp/nestjs-better-auth', () => ({
  AllowAnonymous: () => () => undefined,
}));

import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('health', () => {
    afterEach(() => {
      delete process.env.APP_VERSION;
    });

    it('should report that the API is available', () => {
      expect(appController.health()).toEqual({
        status: 'ok',
        version: 'development',
      });
    });

    it('should report the deployed version when configured', () => {
      process.env.APP_VERSION = 'sha-abc1234';

      expect(appController.health()).toEqual({
        status: 'ok',
        version: 'sha-abc1234',
      });
    });
  });

  describe('ping', () => {
    it('should respond without side effects', () => {
      expect(appController.ping()).toEqual({ pong: true });
    });
  });
});
