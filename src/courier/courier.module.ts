import { HttpModule } from '@nestjs/axios';
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Package, PackageSchema } from '../schemas/package.schema';
import { PackageService } from '../package/package.service';
import { Courier, CourierSchema } from '../schemas/courier.schema';
import { DatabaseService } from '../shared/database.service';
import { RouteService } from '../shared/route.service';
import { UserService } from '../user/user.service';
import { CourierController } from './courier.controller';
import { CourierService } from './courier.service';
import { User, UserSchema } from '../schemas/user.schema';
import { PackageModule } from '../package/package.module';
import { UserModule } from '../user/user.module';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: Courier.name, schema: CourierSchema }
    ]),
    forwardRef(() => PackageModule),
    forwardRef(() => UserModule),
    forwardRef(() => SharedModule),
  ],
  controllers: [CourierController],
  providers: [
    CourierService
  ],
  exports: [CourierService]
})
export class CourierModule { }
