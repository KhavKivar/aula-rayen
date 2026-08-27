import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';

jest.mock('@thallesp/nestjs-better-auth', () => {
  const { createParamDecorator, Module } =
    jest.requireActual<typeof import('@nestjs/common')>('@nestjs/common');
  class MockAuthModule {}
  Module({})(MockAuthModule);

  return {
    AllowAnonymous: () => () => undefined,
    AuthModule: { forRoot: () => ({ module: MockAuthModule }) },
    Session: createParamDecorator(() => undefined),
  };
});

import { AppController } from './../src/app.controller';
import { AppService } from './../src/app.service';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  afterEach(async () => {
    await app.close();
  });
});
