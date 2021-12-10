import { createMockNumber, createMockPosition, createMockString } from "../mocks/utilities";
import { AdminResponse } from "./admin.response.model";
import { CourierPackagesResponseModel } from "./courierPackages.response.model";
import { createMockCourierPackagesResponse } from "./courierPackages.response.model.mock";
import { createMockDirection } from "./direction.model.mock";
import { createMockPackageDistance } from "./packageDistance.model.mock";
import { Direction } from './direction.model';
import { GetDirectionsResponseModel } from "./getDirectionsResponse.model";
import { PackageDistance } from "./packageDistance.model";
import { PackageRouteResponseModel } from "./packageRoute.response.model";
import { PackageValidateRequestModel } from "./packageValidate.request.model";
import { Region } from "./region.model";
import { TokenData } from "./tokenData.model";
import { UpdatePackageRequestModel } from "./updatePackage.request.model";
import { AddRegistrationRequestModel } from "./addRegistration.request.model";

describe('Models Constructors', () => {

    it('should create Add registration request model', () => {
        const id = createMockString();
        const packageId = createMockString();
        const date = createMockString();
        const user = createMockString();
        const subject = createMockString();
        const additionaInfo = createMockString();
        const contactPhone = createMockNumber();
        const contactMail = createMockString();
        const status = createMockString();
        const result = new AddRegistrationRequestModel({
            id,
            packageId,
            date,
            user,
            subject,
            additionaInfo,
            contactPhone,
            contactMail,
            status
        });

        expect(result).toEqual({
            id,
            packageId,
            date,
            user,
            subject,
            additionaInfo,
            contactPhone,
            contactMail,
            status
        })
    });

    it('should create admin response model', () => {
        const result = new AdminResponse({
            read: true,
            write: true
        });

        expect(result).toEqual({
            read: true,
            write: true
        });
    });

    it('should create courierPackagesResponse mock', () => {
        const packagesDistance = [createMockPackageDistance()];
        const directions = [createMockDirection()];

        const result = createMockCourierPackagesResponse({
            packagesDistance,
            directions
        });

        expect(result).toEqual({
            packagesDistance,
            directions
        });
    });

    it('should create courierPackagesResponse model', () => {
        const packagesDistance = [createMockPackageDistance()];
        const directions = [createMockDirection()];

        const result = new CourierPackagesResponseModel({
            packagesDistance,
            directions
        });

        expect(result).toEqual({
            packagesDistance,
            directions
        });
    });

    it('should create direction model', () => {
        const distance = createMockNumber();
        const duration = createMockNumber();
        const modifier = createMockString();
        const type = createMockString();
        const name = createMockString();

        const result = new Direction({
            distance,
            duration,
            modifier,
            type,
            name
        });

        expect(result).toEqual({
            distance,
            duration,
            modifier,
            type,
            name
        });
    });

    it('should create getDirectionsResponse model', () => {
        const directions = [createMockDirection()];
        const positionsWithDistance = [{
            position: createMockPosition(),
            distance: createMockNumber(),
            time: createMockNumber()
        }];

        const result = new GetDirectionsResponseModel({
            directions,
            positionsWithDistance
        });

        expect(result).toEqual({
            directions,
            positionsWithDistance
        });
    });

    it('should create packageDistance mock', () => {
        const packageId = createMockString();
        const distance = createMockNumber();
        const time = createMockNumber();

        const result = createMockPackageDistance({
            packageId,
            distance,
            time
        });

        expect(result).toEqual({
            packageId,
            distance,
            time
        });
    });

    it('should create packageDistance model', () => {
        const packageId = createMockString();
        const distance = createMockNumber();
        const time = createMockNumber();

        const result = new PackageDistance({
            packageId,
            distance,
            time
        });

        expect(result).toEqual({
            packageId,
            distance,
            time
        });
    });

    it('should create packageRouteResponse model', () => {
        const courierId = createMockString();
        const positions = [createMockPosition()];

        const result = new PackageRouteResponseModel({
            courierId,
            positions
        });

        expect(result).toEqual({
            courierId,
            positions
        });
    });

    it('should create packageValidateRequest model', () => {
        const id = createMockString();
        const packageNumber = createMockString();
        const sendDate = createMockString();
        const receiver = createMockString();
        const sender = createMockString();
        const position = createMockPosition();
        const comments = createMockString();
        const status = createMockString();

        const result = new PackageValidateRequestModel({
            id,
            packageNumber,
            sendDate,
            receiver,
            sender,
            position,
            comments,
            status
        });

        expect(result).toEqual({
            id,
            packageNumber,
            sendDate,
            receiver,
            sender,
            position,
            comments,
            status
        });
    });

    it('should create region model', () => {
        const name = createMockString();
        const leftTop = createMockPosition();
        const leftBottom = createMockPosition();
        const rightTop = createMockPosition();
        const rightBottom = createMockPosition();

        const result = new Region({
            name,
            leftTop,
            leftBottom,
            rightTop,
            rightBottom
        });

        expect(result).toEqual({
            name,
            leftTop,
            leftBottom,
            rightTop,
            rightBottom
        });
    });

    it('should create tokenData model', () => {
        const login = createMockString();
        const role = createMockString();

        const result = new TokenData({
            login,
            role
        });

        expect(result).toEqual({
            login,
            role
        });
    });

    it('should create updatePackageRequest model', () => {
        const packageId = createMockString();
        const isDelivered = createMockString();

        const result = new UpdatePackageRequestModel({
            packageId,
            isDelivered
        });

        expect(result).toEqual({
            packageId,
            isDelivered
        });
    });
});