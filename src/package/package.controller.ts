import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PackageRouteResponseModel } from '../models/packageRoute.response.model';
import { PackageValidateRequestModel } from '../models/packageValidate.request.model';
import { PackageDto } from '../DTOs/package.dto';
import { PackageService } from './package.service';
import { PackageForUserResponse } from '../models/packageForUser.response.model';
import { RolesGuard } from '../shared/roles.guard';
import { Roles } from '../shared/roles.decorator';
import { Package } from '../schemas/package.schema';

@ApiTags('Packages')
@Controller('packages')
export class PackageController {
  constructor(private readonly packageService: PackageService) { }

  @ApiResponse({ status: 200, description: 'Zwraca listę przesyłek', type: [PackageDto] })
  @ApiResponse({ status: 403, description: 'Brak dostępu' })
  @ApiBearerAuth()
  @Get()
  @Roles('admin', 'superAdmin')
  @UseGuards(RolesGuard)
  async getPackages(): Promise<PackageDto[]> {
    return await this.packageService.getPackages();
  }

  @ApiResponse({ status: 201, description: 'Zaktualizowano przesyłkę' })
  @ApiResponse({ status: 403, description: 'Brak dostępu' })
  @ApiBearerAuth()
  @Post('add-update-package')
  @Roles('superAdmin')
  @UseGuards(RolesGuard)
  async addPackage(@Body() packageModel: Package): Promise<void> {
    await this.packageService.addUpdatePackage(packageModel);
  }

  @ApiResponse({ status: 201, description: 'Zweryfikowano Przesyłkę', type: [String] })
  @ApiResponse({ status: 403, description: 'Brak dostępu' })
  @ApiResponse({ status: 404, description: 'Nie znaleziono przesyłki' })
  @ApiBearerAuth()
  @Post('validate-package')
  @Roles('superAdmin')
  @UseGuards(RolesGuard)
  async validatePackage(
    @Body() requestModel: PackageValidateRequestModel,
  ): Promise<string[]> {
    return await this.packageService.validatePackage(requestModel);
  }

  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, description: 'Zwraca listę pozycji przesyłek i id kuriera', type: [PackageRouteResponseModel] })
  @ApiResponse({ status: 403, description: 'Brak dostępu' })
  @ApiResponse({ status: 404, description: 'Nie znaleziono przesyłki' })
  @ApiBearerAuth()
  @Get('route/:id')
  @Roles('map', 'superAdmin')
  @UseGuards(RolesGuard)
  async getPackageRoute(@Param() param: any): Promise<PackageRouteResponseModel> {
    return await this.packageService.getRouteForPackage(param.id);
  }

  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, description: 'Zwraca listę przesyłek, dostawców i czasu do dostarczenia', type: [PackageRouteResponseModel] })
  @ApiResponse({ status: 403, description: 'Brak dostępu' })
  @ApiResponse({ status: 404, description: 'Nie znaleziono nadawcy' })
  @ApiBearerAuth()
  @Get('sender/:id')
  @Roles('user', 'superAdmin')
  @UseGuards(RolesGuard)
  async getPackagesForSender(@Param() param: any): Promise<PackageForUserResponse[]> {
    return await this.packageService.getPackagesForSender(param.id);
  }

  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, description: 'Zwraca listę przesyłek, dostawców i czasu do dostarczenia', type: [PackageRouteResponseModel] })
  @ApiResponse({ status: 403, description: 'Brak dostępu' })
  @ApiResponse({ status: 404, description: 'Nie znaleziono odbiorcy' })
  @ApiBearerAuth()
  @Get('receiver/:id')
  @Roles('user', 'superAdmin')
  @UseGuards(RolesGuard)
  async getPackagesForReceiver(@Param() param: any): Promise<PackageForUserResponse[]> {
    return await this.packageService.getPackagesForReceiver(param.id);

  }
}
