import { AxiosInstance } from 'axios';

import { baseService } from '@/services/base/base.service';
import {
  UserInformationRegisterDto,
  UserInformationSignInDto,
} from '@/services/dtos/auth-dto.interface';

import { IBaseService } from './interfaces/base-service.interface';

export interface LoginResponse {
  token: string;
}

export class AuthService {
  private static instance: AuthService;
  private readonly api: AxiosInstance;

  private constructor(private readonly baseService: IBaseService) {
    this.api = this.baseService.getClient();
  }

  public static getInstance(baseService: IBaseService): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService(baseService);
    }
    return AuthService.instance;
  }

  register = (userInformationRegisterDto: UserInformationRegisterDto) => {
    return this.api.post('/register', userInformationRegisterDto);
  };

  login = async (
    userSignInDto: UserInformationSignInDto,
  ): Promise<LoginResponse> => {
    const { data } = await this.api.post<LoginResponse>(
      '/login',
      userSignInDto,
    );
    return data;
  };

  setAccessToken = (token: string): void => {
    this.baseService.setAccessToken(token);
  };

  clearAccessToken = (): void => {
    this.baseService.clearAccessToken();
  };
}

const authService = AuthService.getInstance(baseService);

export default authService;
