import { createMockString } from "../mocks/utilities";
import { PackageStatus } from "../models/packageStatus.enum";
import { createMockPackage } from "../schemas/package.schema.mock";
import { EnumConverter } from "./enumConverter";
import { PackageDtoAdapter } from "./package.dto.adapter";
import { createMockPackageDto } from "./package.dto.mock";
import { createMockUserDTO } from "./user.dto.mock";

describe('PackageDTOAdapter', () => {

    it('should return new package dto', () => {
        const someId = createMockString();
        const someModel = createMockPackage();
        const someSender = createMockUserDTO();
        const someReceiver = createMockUserDTO();

        const dto = PackageDtoAdapter.toDto(someId, someModel, someSender, someReceiver);

        expect(dto.id).toEqual(someId);
        expect(dto.packageNumber).toEqual(someModel.packageNumber);
        expect(dto.comments).toEqual(someModel.comments);
        expect(dto.position).toEqual(someModel.position);
        expect(dto.receiver.id).toEqual(someReceiver.id);
        expect(dto.sender.id).toEqual(someSender.id);
        expect(dto.sendDate).toEqual(new Date(someModel.sendDate));
        expect(dto.status).toEqual(
            PackageStatus[EnumConverter.getByValue(PackageStatus, someModel.status)]
        );

    });

    it('should return new package model', () => {
        const somePackageDto = createMockPackageDto();

        const model = PackageDtoAdapter.toModel(somePackageDto);

        expect(model.comments).toEqual(somePackageDto.comments);
        expect(model.packageNumber).toEqual(somePackageDto.packageNumber);
        expect(model.position).toEqual(somePackageDto.position);
        expect(model.receiver).toEqual(somePackageDto.receiver.id);
        expect(model.sender).toEqual(somePackageDto.sender.id);
        expect(model.sendDate).toEqual(somePackageDto.sendDate.toString());
        expect(model.status).toEqual(somePackageDto.status);
    });

    it('should return new public package dto', () => {
        const somePackageDto = createMockPackageDto();

        const publicDto = PackageDtoAdapter.toPublicDto(somePackageDto);

        expect(publicDto.comments).toEqual(somePackageDto.comments);
        expect(publicDto.id).toEqual(somePackageDto.id);
        expect(publicDto.packageNumber).toEqual(somePackageDto.packageNumber);
        expect(publicDto.position).toEqual(somePackageDto.position);
        expect(publicDto.receiver.id).toEqual(somePackageDto.receiver.id);
        expect(publicDto.sender.id).toEqual(somePackageDto.sender.id);
        expect(publicDto.status).toEqual(somePackageDto.status);
    });
})