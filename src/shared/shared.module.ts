import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { HttpModule } from '@nestjs/axios';
import { AuthService } from "./auth.service";
import { DatabaseService } from "./database.service";
import { RouteService } from "./route.service";
import { RolesGuard } from "./roles.guard";
import { Reflector } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [
        JwtModule.register({
            secret: `${process.env.JWT_SECRET}`,
            signOptions: { expiresIn: '2h' }
        }),
        HttpModule,
        Reflector,
        ConfigModule
    ],
    controllers: [],
    providers: [AuthService, DatabaseService, RouteService, RolesGuard],
    exports: [AuthService, DatabaseService, RouteService, RolesGuard]
})
export class SharedModule { }