import { AxiosInstance } from 'axios';

export interface IBaseService {
  getClient(): AxiosInstance;
  setAccessToken(token: string): void;
  clearAccessToken(): void;
}
