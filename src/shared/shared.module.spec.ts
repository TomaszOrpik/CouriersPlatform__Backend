import { ContextType, ExecutionContext, Type } from "@nestjs/common";
import { RpcArgumentsHost, HttpArgumentsHost, WsArgumentsHost } from "@nestjs/common/interfaces";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { createMockPosition, createMockString } from "../mocks/utilities";
import { createMockTokenData } from "../models/tokenData.model.mock";
import { AuthService } from "./auth.service";
import { DatabaseService } from "./database.service";
import { RolesGuard } from "./roles.guard";
import { RouteService } from "./route.service";
import { SharedModule } from "./shared.module";

describe('SharedModule', () => {
    let routeService: RouteService;
    let rolesGuard: RolesGuard;
    let databaseService: DatabaseService;
    let authService: AuthService;
    let jwtService: JwtService;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            imports: [SharedModule]
        }).compile();

        routeService = app.get<RouteService>(RouteService);
        rolesGuard = app.get<RolesGuard>(RolesGuard);
        databaseService = app.get<DatabaseService>(DatabaseService);
        authService = app.get<AuthService>(AuthService);
        jwtService = app.get<JwtService>(JwtService);
    });

    describe('route service', () => {
        const someInitPosition = createMockPosition();
        const someRoute = [createMockPosition()];

        it('should define route service', () => {
            expect(routeService).toBeDefined();
        });

        it('should get directions with distance', async () => {

            const result = await routeService.getDirections(someInitPosition, someRoute);

            expect(result).toEqual({
                directions: [],
                positionsWithDistance: []
            });
        });

        it('should get order of positions', async () => {
            const closestPosition = [someRoute[0]];

            const result = await routeService.getOrder(someInitPosition, someRoute);

            routeService.getDistance = jest.fn(() => new Promise(() => 10));

            expect(result).toEqual(closestPosition);
        });

        it('should get closest position to initial one', async () => {
            const closestPosition = someRoute[0];

            const result = await routeService.getClosesPosition(someInitPosition, someRoute);

            routeService.getDistance = jest.fn(() => new Promise(() => 10));

            expect(result).toEqual(closestPosition);
        });
    });

    describe('roles guard', () => {

        it('should define roles guard', () => {
            expect(rolesGuard).toBeDefined();
        });

        it('should validate user', () => {
            const mockContext: ExecutionContext = {
                getClass: function <T = any>(): Type<T> {
                    throw new Error("Function not implemented.");
                },
                getHandler: function (): Function {
                    throw new Error("Function not implemented.");
                },
                getArgs: function <T extends any[] = any[]>(): T {
                    throw new Error("Function not implemented.");
                },
                getArgByIndex: function <T = any>(index: number): T {
                    throw new Error("Function not implemented.");
                },
                switchToRpc: function (): RpcArgumentsHost {
                    throw new Error("Function not implemented.");
                },
                switchToHttp: function (): HttpArgumentsHost {
                    throw new Error("Function not implemented.");
                },
                switchToWs: function (): WsArgumentsHost {
                    throw new Error("Function not implemented.");
                },
                getType: function <TContext extends string = ContextType>(): TContext {
                    throw new Error("Function not implemented.");
                }
            }
            const result = rolesGuard.canActivate(mockContext);
            expect(result).toEqual(false);
        });
    });

    describe('database service', () => {

        it('should define database service', () => {
            expect(databaseService).toBeDefined();
        });
    });

    describe('Auth Service', () => {

        it('should define auth service', () => {
            expect(authService).toBeDefined();
        });
    });

    describe(' JWT Service', () => {

        it('should decode jwt token', () => {
            const someMockToken = createMockTokenData();
            jwtService.sign = jest.fn();

            authService.generateJwt(someMockToken);

            expect(jwtService.sign).toBeCalledWith({ data: someMockToken });
            expect(jwtService.sign).toBeCalledTimes(1);
        });

        it('should encode jwt token', () => {
            const someMockString = createMockString();
            jwtService.decode = jest.fn();

            authService.decodeJwt(someMockString);

            expect(jwtService.decode).toBeCalledWith(someMockString);
            expect(jwtService.decode).toBeCalledTimes(1);
        });
    });
});
