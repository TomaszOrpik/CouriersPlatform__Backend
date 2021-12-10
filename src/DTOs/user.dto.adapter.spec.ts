import { createMockString } from "../mocks/utilities";
import { createMockUser } from "../schemas/user.schema.mock";
import { UserDtoAdapter } from "./user.dto.adapter";
import { createMockUserDTO } from "./user.dto.mock";

describe('UserDTOAdapter', () => {

    it('should return new user dto', () => {
        const someId = createMockString();
        const someModel = createMockUser();

        const dto = UserDtoAdapter.toDto(someId, someModel);

        expect(dto.id).toEqual(someId);
        expect(dto.city).toEqual(someModel.city);
        expect(dto.firstName).toEqual(someModel.firstName);
        expect(dto.lastName).toEqual(someModel.lastName);
        expect(dto.password).toEqual(someModel.password);
        expect(dto.phoneNumber).toEqual(someModel.phoneNumber);
        expect(dto.postCode).toEqual(someModel.postCode);
        expect(dto.street).toEqual(someModel.street);
    });

    it('should return new user model', () => {
        const someDto = createMockUserDTO();

        const model = UserDtoAdapter.toModel(someDto);

        expect(model.city).toEqual(someDto.city);
        expect(model.firstName).toEqual(someDto.firstName);
        expect(model.lastName).toEqual(someDto.lastName);
        expect(model.password).toEqual(someDto.password);
        expect(model.phoneNumber).toEqual(someDto.phoneNumber);
        expect(model.postCode).toEqual(someDto.postCode);
        expect(model.street).toEqual(someDto.street);
    });

    it('should return new public user dto', () => {
        const someDto = createMockUserDTO();

        const dto = UserDtoAdapter.toPublicDto(someDto);

        expect(dto.id).toEqual(someDto.id);
        expect(dto.city).toEqual(someDto.city);
        expect(dto.firstName).toEqual(someDto.firstName);
        expect(dto.lastName).toEqual(someDto.lastName);
        expect(dto.phoneNumber).toEqual(someDto.phoneNumber);
        expect(dto.postCode).toEqual(someDto.postCode);
        expect(dto.street).toEqual(someDto.street);
    });
})