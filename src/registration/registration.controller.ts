import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../shared/roles.decorator';
import { RolesGuard } from '../shared/roles.guard';
import { RegistrationDto } from '../DTOs/registration.dto';
import { RegistrationForUserRequestModel } from '../models/registrationForUser.request.model';
import { RegistrationService } from './registration.service';
import { Registration } from '../schemas/registration.schema';
import { AddRegistrationRequestModel } from '../models/addRegistration.request.model';

@ApiTags('Registrations')
@Controller('registrations')
export class RegistrationsController {
  constructor(private readonly registrationService: RegistrationService) { }

  @ApiResponse({ status: 200, description: 'Zwraca listę zgłoszeń', type: [RegistrationDto] })
  @ApiResponse({ status: 403, description: 'Brak dostępu' })
  @ApiBearerAuth()
  @Get()
  @Roles('admin', 'superAdmin')
  @UseGuards(RolesGuard)
  async getRegistrations(): Promise<RegistrationDto[]> {
    return await this.registrationService.getRegistrations();
  }

  @ApiResponse({ status: 201, description: 'Zaktualizowano zgłoszenie' })
  @ApiResponse({ status: 403, description: 'Brak dostępu' })
  @ApiBearerAuth()
  @Post('add-update-registration')
  @Roles('superAdmin')
  @UseGuards(RolesGuard)
  async addRegistration(
    @Body() registration: AddRegistrationRequestModel,
  ): Promise<void> {
    const id = registration.id;
    const schema: Registration = {
      packageId: registration.packageId,
      date: registration.date,
      user: registration.user,
      subject: registration.subject,
      additionalInfo: registration.additionaInfo,
      contactPhone: registration.contactPhone,
      contactMail: registration.contactMail,
      status: registration.status
    }
    await this.registrationService.addUpdateRegistration(schema);
  }

  @ApiResponse({ status: 201, description: 'Zweryfikowano zgłoszenie', type: [String] })
  @ApiResponse({ status: 403, description: 'Brak dostępu' })
  @ApiResponse({ status: 404, description: 'Nie znaleziono zgłoszenia' })
  @ApiBearerAuth()
  @Post('validate-registration')
  @Roles('superAdmin')
  @UseGuards(RolesGuard)
  async validateRegistration(@Body() registration: RegistrationForUserRequestModel) {
    return await this.registrationService.validateRegistration(
      registration,
    );
  }


  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 201, description: 'Zwraca listę zgłoszeń użytkownika', type: [RegistrationForUserRequestModel] })
  @ApiResponse({ status: 403, description: 'Brak dostępu' })
  @ApiResponse({ status: 404, description: 'Nie znaleziono zgłoszenia' })
  @ApiBearerAuth()
  @Get('user/:id')
  @Roles('user', 'superAdmin')
  @UseGuards(RolesGuard)
  async getRegistrationsForUser(@Param() param: any): Promise<RegistrationForUserRequestModel[]> {
    return await this.registrationService.getRegistrationsForUser(param.id);
  }
}
