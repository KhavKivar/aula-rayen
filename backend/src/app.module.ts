import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { ProductModule } from './modules/product/product.module';
import { WebPayModule } from './modules/webpay/webpay.module';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './modules/auth/auth';
@Module({
  imports: [
    ConfigModule.forRoot(),
    DbModule,
    ProductModule,
    WebPayModule,
    AuthModule.forRoot({ auth }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
