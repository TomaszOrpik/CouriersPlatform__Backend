import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenData } from '../models/tokenData.model';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {
  }

  generateJwt(data: TokenData): string {
    return this.jwtService.sign({ data });
  }

  decodeJwt(token: string) {
    if (token.includes('Bearer'))
      return this.jwtService.decode(token.replace('Bearer ', ''));
    return this.jwtService.decode(token);
  }
}
