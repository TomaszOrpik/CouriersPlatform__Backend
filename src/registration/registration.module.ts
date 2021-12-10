import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Registration, RegistrationSchema } from '../schemas/registration.schema';
import { RegistrationsController } from './registration.controller';
import { RegistrationService } from './registration.service';
import { PackageModule } from '../package/package.module';
import { UserModule } from '../user/user.module';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: Registration.name, schema: RegistrationSchema },
    ]),
    PackageModule,
    UserModule,
    SharedModule
  ],
  controllers: [RegistrationsController],
  providers: [
    RegistrationService
  ],
  exports: [RegistrationService]
})
export class RegistrationsModule { }
