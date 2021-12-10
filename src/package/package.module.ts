import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Package, PackageSchema } from '../schemas/package.schema';
import { PackageController } from './package.controller';
import { PackageService } from './package.service';
import { UserModule } from '../user/user.module';
import { SharedModule } from '../shared/shared.module';
import { CourierModule } from '../courier/courier.module';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: Package.name, schema: PackageSchema },
    ]),
    forwardRef(() => UserModule),
    forwardRef(() => CourierModule),
    forwardRef(() => SharedModule)
  ],
  controllers: [PackageController],
  providers: [PackageService],
  exports: [PackageService]
})
export class PackageModule { }
