import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegistrationStatus } from '../models/registrationStatus.enum';
import { RegistrationDto } from '../DTOs/registration.dto';
import { RegistrationDtoAdapter } from '../DTOs/registration.dto.adapter';
import { RegistrationForUserRequestModel } from '../models/registrationForUser.request.model';
import { PackageService } from '../package/package.service';
import { Registration, RegistrationDocument } from '../schemas/registration.schema';
import { UserService } from '../user/user.service';
import { createMockString } from '../mocks/utilities';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectModel(Registration.name) private registrationModel: Model<RegistrationDocument>,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    @Inject(forwardRef(() => PackageService))
    private packageService: PackageService,
  ) { }

  async addUpdateRegistration(
    registration: Registration, id?: string
  ): Promise<void> {
    const existingRegistration = await this.registrationModel.findOne({
      "_id": id,
    });
    const newId = existingRegistration ? existingRegistration._id : createMockString();
    try {
      const registrationModel = await this.registrationModel.findById(newId);
      await registrationModel.updateOne(registration);
      await registrationModel.save();
    } catch (e) {
      const createdRegistration = new this.registrationModel(
        registration
      );
      await createdRegistration.save();
    }
  }

  async getRegistrations(): Promise<RegistrationDto[]> {
    const registrationModels = await this.registrationModel.find().exec();
    const registrationDtos = Promise.all(registrationModels.map(async (r) => {
      const user = await this.userService.getUser(r.user);
      const packageDto = await this.packageService.getPackage(r.packageId);
      return RegistrationDtoAdapter.toDto(r._id, r, packageDto, user)
    }
    ));
    return registrationDtos;
  }

  async getRegistration(id: string): Promise<RegistrationDto> {
    const registrationModel = await this.registrationModel.findById(id);
    const userDto = await this.userService.getUser(registrationModel.user);
    const packageDto = await this.packageService.getPackage(registrationModel.packageId);
    return RegistrationDtoAdapter.toDto(registrationModel._id, registrationModel, packageDto, userDto);
  }

  async validateRegistration(
    registration: RegistrationForUserRequestModel,
  ): Promise<string[]> {
    const errors: string[] = [];
    if (
      registration.id.length === 0 ||
      registration.id == null ||
      registration.contactMail.length === 0 ||
      registration.contactMail == null ||
      registration.contactPhone.toString().length === 0 ||
      registration.contactPhone === 0 ||
      registration.contactPhone == null ||
      registration.packageId.length === 0 ||
      registration.packageId == null ||
      registration.user.length === 0 ||
      registration.user == null ||
      registration.subject.length === 0 ||
      registration.subject == null ||
      registration.date.length === 0 ||
      registration.date == null
    ) {
      errors.push('Nie wszystkie pola są uzupełnione');
      return errors;
    }
    const registrations = await this.getRegistrations();
    if (registrations.some((r) => r.id.toString() === registration.id.toString())) {
      errors.push('Ten numer zgłoszenia już jest w systemie');
    }
    if (
      registrations.some(
        (r) =>
          r.package.id === registration.packageId &&
          r.status !== RegistrationStatus.solved,
      )
    ) {
      errors.push('Ta przesyłka ma już aktywne zgłoszenie');
    }
    if (
      !(
        new Date(registration.date).setHours(0, 0, 0, 0) <=
        new Date().setHours(0, 0, 0, 0)
      )
    ) {
      errors.push('Data zgłoszenia nie może być późniejsza niż dzisiaj');
    }
    return errors;
  }

  async getRegistrationsForUser(userId: string): Promise<RegistrationForUserRequestModel[]> {
    const registrations = await this.getRegistrations();
    const registrationsResponse = registrations.map((r) => new RegistrationForUserRequestModel({
      id: r.id,
      packageId: r.package.id,
      date: r.date.toString(),
      user: r.user.id,
      subject: r.subject,
      additionalInfo: r.additionalInfo,
      contactPhone: r.contactPhone,
      contactMail: r.contactMail,
      status: r.status
    }));
    return registrationsResponse.filter((r) => r.user === userId);
  }
}
