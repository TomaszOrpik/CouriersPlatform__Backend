import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthService } from "./auth.service";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector, private authService: AuthService) { }
    canActivate(
        context: ExecutionContext
    ) {
        try {
            const roles = this.reflector.get<string[]>('roles', context.getHandler());
            if (roles.length === 0) return true;

            const request = context.switchToHttp().getRequest();
            const token = request.headers.authorization;

            const decodedToken: any = this.authService.decodeJwt(token);
            if (roles.includes(decodedToken?.data?.role)) return true;
        } catch (e) {
            return false;
        }
        return false;
    }
}