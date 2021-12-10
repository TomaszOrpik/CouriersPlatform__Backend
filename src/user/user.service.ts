import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserLoginDTO } from '../DTOs/userLogin.dto';
import { UserDTO } from '../DTOs/user.dto';
import { UserDtoAdapter } from '../DTOs/user.dto.adapter';
import { User, UserDocument } from '../schemas/user.schema';
import { Admin, AdminDocument } from '../schemas/admin.schema';
import { AuthService } from '../shared/auth.service';
import { TokenResponse } from '../models/token.response.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    private authService: AuthService
  ) { }

  async addUpdateUser(user: UserDTO) {
    try {
      const userModel = await this.userModel.findById(user.id);
      await userModel.updateOne(UserDtoAdapter.toModel(user));
      await userModel.save();
    } catch (e) {
      const createdUser = new this.userModel(
        UserDtoAdapter.toModel(user)
      );
      await createdUser.save();
    }
  }

  async getUsers(): Promise<UserDTO[]> {
    const userModels = await this.userModel.find().exec();
    return userModels.map((u) => UserDtoAdapter.toDto(u._id, u));
  }

  async getUser(id: string): Promise<UserDTO> {
    const userModel = await this.userModel.findById(id).exec();
    return UserDtoAdapter.toDto(userModel._id, userModel);
  }

  async validateUser(user: UserDTO): Promise<string[]> {
    const errors: string[] = [];
    if (
      user.id.length === 0 ||
      user.id == null ||
      user.street.length === 0 ||
      user.street == null ||
      user.postCode.length === 0 ||
      user.postCode == null ||
      user.city.length === 0 ||
      user.city == null ||
      user.firstName.length === 0 ||
      user.firstName == null ||
      user.lastName.length === 0 ||
      user.lastName == null ||
      user.password.length === 0 ||
      user.password == null ||
      user.phoneNumber === 0
    ) {
      errors.push('Nie wszystkie pola są uzupełnione');
      return errors;
    }
    const users = await this.getUsers();
    if (users.some((u) => u.id === user.id))
      errors.push('Te id już jest w systemie');
    if (users.some((u) => u.phoneNumber === user.phoneNumber))
      errors.push('Ten numer telefonu już jest w systemie');
    return errors;
  }

  async loginUser(data: UserLoginDTO): Promise<{ isLoginCorrect: boolean, tokens: TokenResponse }> {
    try {
      const user: User = await this.userModel.findById(data.login);
      if (user.password === data.password) {
        return {
          isLoginCorrect: true,
          tokens: new TokenResponse({
            userToken: this.authService.generateJwt({ login: data.login, role: 'user' }),
            mapToken: this.authService.generateJwt({ login: data.login, role: 'map' })
          })
        }
      } else {
        return {
          isLoginCorrect: false,
          tokens: {
            userToken: '',
            mapToken: ''
          }
        }
      }
    } catch (e) {
      return {
        isLoginCorrect: false,
        tokens: {
          userToken: '',
          mapToken: ''
        }
      }
    }
  }

  async loginAdmin(data: UserLoginDTO): Promise<{ token: TokenResponse, canWrite: boolean }> {
    try {
      const admin = await this.adminModel.findOne({ 'login': data.login });
      if (admin.password === data.password) {
        const isSuperAdmin = admin.write;
        let userToken: string;
        if (isSuperAdmin) {
          userToken = this.authService.generateJwt({ login: data.login, role: 'superAdmin' });
        } else {
          userToken = this.authService.generateJwt({ login: data.login, role: 'admin' });
        }
        return {
          token: new TokenResponse({
            userToken: userToken,
            mapToken: this.authService.generateJwt({ login: data.login, role: 'map' })
          }),
          canWrite: isSuperAdmin
        };
      } else {
        throw new UnauthorizedException();
      }
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
