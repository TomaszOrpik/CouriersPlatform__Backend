import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TokenResponse } from '../models/token.response.model';
import { Roles } from '../shared/roles.decorator';
import { RolesGuard } from '../shared/roles.guard';
import { UserDTO } from '../DTOs/user.dto';
import { UserLoginDTO } from '../DTOs/userLogin.dto';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @ApiResponse({ status: 200, description: 'Zwraca listę użytkowników', type: [UserDTO] })
  @ApiResponse({ status: 403, description: 'Brak dostępu' })
  @ApiBearerAuth()
  @Get()
  @Roles('admin', 'superAdmin')
  @UseGuards(RolesGuard)
  async getUsers(): Promise<UserDTO[]> {
    return await this.userService.getUsers();
  }

  @ApiResponse({ status: 201, description: 'Zaktualizowano użytkownika' })
  @ApiResponse({ status: 403, description: 'Brak dostępu' })
  @ApiBearerAuth()
  @Post('add-update-user')
  @Roles('superAdmin')
  @UseGuards(RolesGuard)
  async addUser(@Body() user: UserDTO): Promise<void> {
    await this.userService.addUpdateUser(user);
  }

  @ApiResponse({ status: 201, description: 'Zweryfikowano użytkownika', type: [String] })
  @ApiResponse({ status: 403, description: 'Brak dostępu' })
  @ApiResponse({ status: 404, description: 'Nie znaleziono użytkownika' })
  @ApiBearerAuth()
  @Post('validate-user')
  @Roles('superAdmin')
  @UseGuards(RolesGuard)
  async validateUser(@Body() user: UserDTO): Promise<string[]> {
    return await this.userService.validateUser(user);
  }

  @ApiResponse({ status: 201, description: 'Zwraca token użytkownika', type: TokenResponse })
  @ApiResponse({ status: 403, description: 'Brak dostępu' })
  @ApiResponse({ status: 404, description: "Nie znaleziono użytkownika" })
  @Post('login')
  @Roles()
  async loginUser(@Body() data: UserLoginDTO): Promise<{ isLoginCorrect: boolean, tokens: TokenResponse }> {
    return await this.userService.loginUser(data);
  }

  @ApiResponse({ status: 201, description: 'Zwraca token administratora', type: TokenResponse })
  @ApiResponse({ status: 404, description: "Nie znaleziono użytkownika" })
  @Post('login_admin')
  @Roles()
  async loginAdmin(@Body() data: UserLoginDTO): Promise<{ token: TokenResponse, canWrite: boolean }> {
    return this.userService.loginAdmin(data);
  }
}
