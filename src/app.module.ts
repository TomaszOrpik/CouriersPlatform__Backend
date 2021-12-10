import { forwardRef, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { configuration } from './config/configuration';
import { validationSchema } from './config/validation';
import { CourierModule } from './courier/courier.module';
import { PackageModule } from './package/package.module';
import { RegistrationsModule } from './registration/registration.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    forwardRef(() => CourierModule),
    forwardRef(() => UserModule),
    forwardRef(() => PackageModule),
    forwardRef(() => RegistrationsModule),
    forwardRef(() => SharedModule),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
