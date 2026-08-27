import path from 'node:path';

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import type { StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { apiErrorSchema } from '@aula-rayen/contracts/api-error';
import {
  courseCatalogSchema,
  courseDetailSchema,
  courseMutationResponseSchema,
} from '@aula-rayen/contracts/course';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import request from 'supertest';
import type { App } from 'supertest/types';

jest.mock('@thallesp/nestjs-better-auth', () => {
  const { createParamDecorator } =
    jest.requireActual<typeof import('@nestjs/common')>('@nestjs/common');

  return {
    Session: createParamDecorator(
      (_data: unknown, context: import('@nestjs/common').ExecutionContext) =>
        context.switchToHttp().getRequest<{ session: unknown }>().session,
    ),
  };
});

import { CourseController } from '@/modules/course/course.controller';
import { DRIZZLE } from '@/db';
import * as schema from '@/db/schema';
import { CourseRepository } from '@/modules/course/course.repository';
import { CourseService } from '@/modules/course/course.service';

describe('CourseController (integration)', () => {
  let app: INestApplication<App>;
  let container: StartedPostgreSqlContainer;
  let pool: Pool;

  const course = {
    title: 'Curso de prueba',
    description: 'Descripción del curso',
    videoLink: 'https://example.com/video',
    fileLink: 'https://example.com/file',
    duration: '2 horas',
    price: 25000,
  };

  beforeAll(async () => {
    container = await new PostgreSqlContainer('postgres:17-alpine').start();
    pool = new Pool({
      connectionString: container.getConnectionUri(),
    });
    const db = drizzle(pool, { schema });

    await migrate(db, {
      migrationsFolder: path.resolve(__dirname, '../drizzle'),
    });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [CourseController],
      providers: [
        CourseService,
        CourseRepository,
        {
          provide: DRIZZLE,
          useValue: db,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.use((req: { session?: unknown }, _res: unknown, next: () => void) => {
      req.session = {
        user: {
          id: 'user-id',
        },
      };

      next();
    });
    await app.init();
  }, 60_000);

  beforeEach(async () => {
    await pool.query(
      'TRUNCATE TABLE course_purchases, courses, "user" RESTART IDENTITY CASCADE',
    );
  });

  afterAll(async () => {
    await app.close();
    await pool.end();
    await container.stop();
  });

  it('returns contract-safe catalog and mutation responses', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/courses')
      .send(course)
      .expect(201);
    const created = courseMutationResponseSchema.parse(createResponse.body);

    const catalogResponse = await request(app.getHttpServer())
      .get('/courses')
      .expect(200);
    const catalog = courseCatalogSchema.parse(catalogResponse.body);

    expect(catalog).toEqual([
      expect.objectContaining({ id: created.id, hasAccess: false }),
    ]);
    expect(catalog[0]).not.toHaveProperty('videoLink');
    expect(catalog[0]).not.toHaveProperty('fileLink');
  });

  it('returns purchased details matching the shared contract', async () => {
    await pool.query(
      `INSERT INTO "user" (id, name, email) VALUES ($1, $2, $3)`,
      ['user-id', 'Test User', 'test@example.com'],
    );
    const createResponse = await request(app.getHttpServer())
      .post('/courses')
      .send(course)
      .expect(201);
    const created = courseMutationResponseSchema.parse(createResponse.body);
    await pool.query(
      `INSERT INTO course_purchases (user_id, course_id) VALUES ($1, $2)`,
      ['user-id', created.id],
    );

    const detailResponse = await request(app.getHttpServer())
      .get(`/courses/${created.id}`)
      .expect(200);

    expect(courseDetailSchema.parse(detailResponse.body)).toEqual(created);
  });

  it('returns shared API errors for invalid mutations and missing courses', async () => {
    const invalidResponse = await request(app.getHttpServer())
      .post('/courses')
      .send({ ...course, price: -1 })
      .expect(400);
    const missingResponse = await request(app.getHttpServer())
      .patch('/courses/999999')
      .send({ title: 'Curso actualizado' })
      .expect(404);

    expect(apiErrorSchema.parse(invalidResponse.body).statusCode).toBe(400);
    expect(apiErrorSchema.parse(missingResponse.body).statusCode).toBe(404);
  });

  describe('DELETE /courses/:id', () => {
    it.todo('deletes a course without purchases');

    describe('when the course has purchases', () => {
      let courseId: number;

      beforeEach(async () => {
        await pool.query(
          `INSERT INTO "user" (id, name, email)
           VALUES ($1, $2, $3)`,
          ['user-id', 'Test User', 'test@example.com'],
        );
        const createResponse = await request(app.getHttpServer())
          .post('/courses')
          .send(course)
          .expect(201);
        ({ id: courseId } = createResponse.body as { id: number });

        await pool.query(
          `INSERT INTO course_purchases (user_id, course_id)
           VALUES ($1, $2)`,
          ['user-id', courseId],
        );
      });

      it('does not delete the course', async () => {
        const conflictResponse = await request(app.getHttpServer())
          .delete(`/courses/${courseId}`)
          .expect(409);

        expect(apiErrorSchema.parse(conflictResponse.body)).toEqual({
          message: 'No se puede eliminar un curso que ya tiene compras',
          error: 'Conflict',
          statusCode: 409,
        });

        const catalogResponse = await request(app.getHttpServer())
          .get('/courses')
          .expect(200);

        expect(catalogResponse.body).toEqual([
          expect.objectContaining({
            id: courseId,
            title: course.title,
            hasAccess: true,
          }),
        ]);
      });
    });
  });
});
