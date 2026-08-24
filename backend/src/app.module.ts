import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { CourseModule } from './modules/course/course.module';
import { WebPayModule } from './modules/webpay/webpay.module';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './modules/auth/auth';
import { configuration } from './config/configuration';
import { LoggerModule } from 'nestjs-pino';
import { env } from './config/env';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          env.NODE_ENV === 'production'
            ? undefined
            : {
                target: 'pino-pretty',
                options: { singleLine: true },
              },
      },
    }),
    DbModule,
    CourseModule,
    WebPayModule,
    AuthModule.forRoot({ auth }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
