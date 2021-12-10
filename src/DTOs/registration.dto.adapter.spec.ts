import { createMockString } from "../mocks/utilities";
import { RegistrationStatus } from "../models/registrationStatus.enum";
import { createMockRegistration } from "../schemas/registration.schema.mock";
import { EnumConverter } from "./enumConverter";
import { createMockPackageDto } from "./package.dto.mock";
import { RegistrationDtoAdapter } from "./registration.dto.adapter";
import { createMockRegistrationDto } from "./registration.dto.mock";
import { createMockUserDTO } from "./user.dto.mock";

describe('RegistrationDtoAdapter', () => {

    it('should return new model', () => {
        const someRegistrationDto = createMockRegistrationDto();

        const result = RegistrationDtoAdapter.toModel(someRegistrationDto);

        expect(result.packageId).toEqual(someRegistrationDto.package.id);
        expect(result.date).toEqual(someRegistrationDto.date.toString());
        expect(result.user).toEqual(someRegistrationDto.user.id);
        expect(result.subject).toEqual(someRegistrationDto.subject);
        expect(result.additionalInfo).toEqual(someRegistrationDto.additionalInfo);
        expect(result.contactPhone).toEqual(someRegistrationDto.contactPhone);
        expect(result.contactMail).toEqual(someRegistrationDto.contactMail);
        expect(result.status).toEqual(someRegistrationDto.status);
    });

    it('should return new dto', () => {
        const someId = createMockString();
        const model = createMockRegistration();
        const somePackage = createMockPackageDto();
        const someUser = createMockUserDTO();

        const result = RegistrationDtoAdapter.toDto(someId, model, somePackage, someUser);

        expect(result.id).toEqual(someId);
        expect(result.package.id).toEqual(somePackage.id);
        expect(result.date).toEqual(new Date(model.date));
        expect(result.user.id).toEqual(someUser.id);
        expect(result.subject).toEqual(model.subject);
        expect(result.additionalInfo).toEqual(model.additionalInfo);
        expect(result.contactPhone).toEqual(model.contactPhone);
        expect(result.contactMail).toEqual(model.contactMail);
        expect(result.status).toEqual(
            RegistrationStatus[EnumConverter.getByValue(RegistrationStatus, model.status)]
        );
    });
})