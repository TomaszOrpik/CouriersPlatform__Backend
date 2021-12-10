import { createMockCourier } from "../schemas/courier.schema.mock";
import { createMockString } from "../mocks/utilities";
import { CourierDtoAdapter } from "./courier.dto.adapter";
import { createMockPackageDto } from "./package.dto.mock";
import { createMockCourierDto } from "./courier.dto.mock";

describe('CourierDtoAdapter', () => {

    it('should return new courier dto', () => {
        const someId = createMockString();
        const someCourier = createMockCourier();
        const someDeliveredPackages = [createMockPackageDto()];
        const someUndeliveredPackages = [createMockPackageDto()];
        const someCurrentPackage = createMockPackageDto();

        const result = CourierDtoAdapter.toDto(
            someId,
            someCourier,
            someDeliveredPackages,
            someUndeliveredPackages,
            someCurrentPackage
        );

        expect(result.id).toEqual(someId);
        expect(result.employeeNumber).toEqual(someCourier.employeeNumber);
        expect(result.firstName).toEqual(someCourier.firstName);
        expect(result.lastName).toEqual(someCourier.lastName);
        expect(result.password).toEqual(someCourier.password);
        expect(result.phoneNumber).toEqual(someCourier.phoneNumber);
        expect(result.startPosition).toEqual(someCourier.startPosition);
        expect(result.vehicle).toEqual(someCourier.vehicle);
        expect(result.registration).toEqual(someCourier.registration);
        expect(result.startTime).toEqual(someCourier.startTime);
        expect(result.region).toEqual(someCourier.region);
        expect(result.deliveredPackages).toEqual(someDeliveredPackages);
        expect(result.undeliveredPackages).toEqual(someUndeliveredPackages);
        expect(result.currentPackages).toEqual(someCurrentPackage);
    });

    it('should return new courier model', () => {
        const someCourierDto = createMockCourierDto();

        const result = CourierDtoAdapter.toModel(someCourierDto);

        expect(result.employeeNumber).toEqual(someCourierDto.employeeNumber);
        expect(result.firstName).toEqual(someCourierDto.firstName);
        expect(result.lastName).toEqual(someCourierDto.lastName);
        expect(result.password).toEqual(someCourierDto.password);
        expect(result.phoneNumber).toEqual(someCourierDto.phoneNumber);
        expect(result.startPosition).toEqual(someCourierDto.startPosition);
        expect(result.region).toEqual(someCourierDto.region);
        expect(result.deliveredPackages).toEqual(someCourierDto.deliveredPackages.map((p) => p.id));
        expect(result.undeliveredPackages).toEqual(someCourierDto.undeliveredPackages.map((p) => p.id));
        expect(result.currentPackages).toEqual(someCourierDto.currentPackages.id);
    });

    it('should return new public courier dto', () => {
        const someCourierDto = createMockCourierDto();

        const result = CourierDtoAdapter.toPublicDto(someCourierDto);

        expect(result.employeeNumber).toEqual(someCourierDto.employeeNumber);
        expect(result.firstName).toEqual(someCourierDto.firstName);
        expect(result.lastName).toEqual(someCourierDto.lastName);
        expect(result.startPosition).toEqual(someCourierDto.startPosition);
        expect(result.vehicle).toEqual(someCourierDto.vehicle);
        expect(result.registration).toEqual(someCourierDto.registration);
        expect(result.startTime).toEqual(someCourierDto.startTime);
    });
})