import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TokenResponse } from '../models/token.response.model';
import { CourierDto } from '../DTOs/courier.dto';
import { CourierLoginDto } from '../DTOs/courierLogin.dto';
import { PackageDtoPublic } from '../DTOs/package.dto.public';
import { CourierPackagesResponseModel } from '../models/courierPackages.response.model';
import { Position } from '../models/position.model';
import { PositionRequest } from '../models/position.request.model';
import { UpdatePackageRequestModel } from '../models/updatePackage.request.model';
import { Courier } from '../schemas/courier.schema';
import { CourierService } from './courier.service';
import { Roles } from '../shared/roles.decorator';
import { RolesGuard } from '../shared/roles.guard';

@ApiTags('Couriers')
@Controller('couriers')
export class CourierController {
  constructor(private readonly courierService: CourierService) { }

  @ApiResponse({ status: 200, description: 'Zwraca listę kurierów', type: [CourierDto] })
  @ApiResponse({ status: 403, description: 'Brak dostępu' })
  @ApiBearerAuth()
  @Get()
  @Roles('admin', 'superAdmin')
  @UseGuards(RolesGuard)
  async getCouriers(): Promise<CourierDto[]> {
    return await this.courierService.getCouriers();
  }

  @ApiParam({ name: 'id', description: 'Numer Pracownika', type: 'string' })
  @ApiResponse({ status: 201, description: 'Zaktualizowano listę paczek kuriera' })
  @ApiResponse({ status: 403, description: 'Brak dostępu' })
  @ApiBearerAuth()
  @Post('set-packages/:id')
  @Roles('courier', 'superAdmin')
  @UseGuards(RolesGuard)
  async setPackagesForCourier(@Param() param: any)
    : Promise<CourierPackagesResponseModel> {
    return await this.courierService.setPackagesForCourier(param.id);
  }

  @ApiResponse({ status: 201, description: 'Zaktualizowanodane kuriera' })
  @ApiResponse({ status: 403, description: 'Brak dostępu' })
  @ApiBearerAuth()
  @Post('add-update-courier')
  @Roles('superAdmin')
  @UseGuards(RolesGuard)
  async addCourier(@Body() courier: Courier): Promise<void> {
    await this.courierService.addUpdateCourier(courier);
  }

  @ApiResponse({ status: 201, description: 'Zweryfikowano Kuriera', type: [String] })
  @ApiResponse({ status: 403, description: 'Brak dostępu' })
  @ApiResponse({ status: 404, description: 'Nie znaleziono kuriera' })
  @ApiBearerAuth()
  @Post('validate-courier')
  @Roles('superAdmin')
  @UseGuards(RolesGuard)
  async validateCourier(@Body() courier: Courier): Promise<string[]> {
    return await this.courierService.validateCourier(courier);
  }

  @ApiParam({ name: 'id', description: 'Numer Pracownika', type: 'string' })
  @ApiResponse({ status: 200, description: 'Zwraca trasę kuriera' })
  @ApiResponse({ status: 403, description: 'Brak dostępu' })
  @ApiResponse({ status: 404, description: 'Nie znaleziono kuriera' })
  @ApiBearerAuth()
  @Get('route/:id')
  @Roles('map', 'superAdmin')
  @UseGuards(RolesGuard)
  async getCourierRoute(@Param() param: any): Promise<Position[]> {
    return await this.courierService.getCourierRoute(param.id);
  }

  @ApiResponse({
    status: 201,
    description: 'Zwraca token kuriera',
    type: TokenResponse
  })
  @ApiResponse({ status: 403, description: 'Brak dostępu' })
  @ApiResponse({ status: 404, description: 'Nie znaleziono kuriera' })
  @Post('login')
  @Roles()
  async loginCourier(@Body() data: CourierLoginDto): Promise<{ isLoginCorrect: boolean, tokens: TokenResponse }> {
    return await this.courierService.loginCourier(data);
  }

  @ApiParam({ name: 'id', description: 'Numer Pracownika', type: 'string' })
  @ApiResponse({
    status: 201,
    description: 'Aktualizuje pazycję kuriera i zwraca wytyczne do trasy',
    type: CourierPackagesResponseModel
  })
  @ApiResponse({ status: 403, description: 'Brak dostępu' })
  @ApiResponse({ status: 404, description: 'Nie znaleziono kuriera' })
  @ApiBearerAuth()
  @Post('position/:id')
  @Roles('courier', 'superAdmin')
  @UseGuards(RolesGuard)
  async updatePosition(@Param() param: any, @Body() position: PositionRequest)
    : Promise<CourierPackagesResponseModel> {
    return await this.courierService.updateCourierPosition(param.id, {
      latitude: parseFloat(position.latitude),
      longitude: parseFloat(position.longitude)
    });
  }

  @ApiParam({ name: 'id', description: 'Numer Pracownika', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Zwraca przysłki kuriera',
    type: [PackageDtoPublic]
  })
  @ApiResponse({ status: 403, description: 'Brak dostępu' })
  @ApiResponse({ status: 404, description: 'Nie znaleziono kuriera' })
  @ApiBearerAuth()
  @Get('get-packages/:id')
  @Roles('courier', 'superAdmin')
  @UseGuards(RolesGuard)
  async getPackages(@Param() param: any): Promise<PackageDtoPublic[]> {
    return await this.courierService.getPackagesForCourier(param.id);
  }

  @ApiParam({ name: 'id', description: 'Numer Pracownika', type: 'string' })
  @ApiResponse({
    status: 201,
    description: 'Resetuje przesyłki kuriera',
  })
  @ApiResponse({ status: 403, description: 'Brak dostępu' })
  @ApiResponse({ status: 404, description: 'Nie znaleziono kuriera' })
  @ApiBearerAuth()
  @Post('clear-packages/:id')
  @Roles('courier', 'superAdmin')
  @UseGuards(RolesGuard)
  async clearPackages(@Param() param: any): Promise<void> {
    await this.courierService.clearPackagesForCourier(param.id);
  }

  @ApiParam({ name: 'id', description: 'Numer Pracownika', type: 'string' })
  @ApiResponse({
    status: 201,
    description: 'Aktualizuje przesyłki kuriera',
    type: [PackageDtoPublic]
  })
  @ApiResponse({ status: 403, description: 'Brak dostępu' })
  @ApiResponse({ status: 404, description: 'Nie znaleziono kuriera' })
  @ApiBearerAuth()
  @Post('update-package/:id')
  @Roles('courier', 'superAdmin')
  @UseGuards(RolesGuard)
  async updatePackage(
    @Param() param: any,
    @Body() data: UpdatePackageRequestModel
  ): Promise<PackageDtoPublic[]> {
    const formattedIsDelivered: boolean = data.isDelivered === 'true';
    return await this.courierService.updatePackageStatus(param.id, data.packageId, formattedIsDelivered);
  }
}
