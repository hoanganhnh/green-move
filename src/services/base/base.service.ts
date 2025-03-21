import axios, { AxiosError, AxiosInstance } from 'axios';
import { deleteCookie } from 'cookies-next';
import { NextResponse } from 'next/server';
import queryString from 'query-string';

import { IBaseService } from '@/services/interfaces/base-service.interface';

import { UnInterceptedApiError } from '@/types/api';

const AUTH_TOKEN_HEADER = 'Authorization';

export class BaseService implements IBaseService {
  private static instance: BaseService;
  private readonly axiosClient: AxiosInstance;
  private accessToken?: string;

  private constructor() {
    this.axiosClient = this.createAxiosInstance();
    this.setupInterceptors();
  }

  public static getInstance(): BaseService {
    if (!BaseService.instance) {
      BaseService.instance = new BaseService();
    }
    return BaseService.instance;
  }

  public getClient(): AxiosInstance {
    return this.axiosClient;
  }

  private createAxiosInstance(): AxiosInstance {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const baseURL = process.env.NEXT_PUBLIC_API_URL!;

    return axios.create({
      baseURL,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      withCredentials: true, // to send cookie
      paramsSerializer: (params) => queryString.stringify(params),
    });
  }

  private setupInterceptors(): void {
    this.setupRequestInterceptor();
    this.setupResponseInterceptor();
  }

  private setupRequestInterceptor(): void {
    this.axiosClient.interceptors.request.use(async (config) => {
      try {
        if (this.accessToken) {
          config.headers[AUTH_TOKEN_HEADER] = `Bearer ${this.accessToken}`;
        }
        return config;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error setting authorization header:', error);
        return config;
      }
    }, this.handleRequestError);
  }

  private setupResponseInterceptor(): void {
    this.axiosClient.interceptors.response.use(
      (response) => response,
      this.handleResponseError,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private handleRequestError(error: Record<string, any>): Promise<never> {
    const statusCode = error.response?.status;

    if (statusCode === 401 || statusCode === 403) {
      // eslint-disable-next-line no-console
      console.log('Unauthorized or Forbidden');
    }

    if (statusCode === 406) {
      deleteCookie(AUTH_TOKEN_HEADER);
      this.axiosClient.post('/logout');
      return Promise.reject(NextResponse.redirect(new URL('/sign-in')));
    }

    return Promise.reject(error);
  }

  private handleResponseError(
    error: AxiosError<UnInterceptedApiError>,
  ): Promise<never> {
    if (error.response?.data.message) {
      return Promise.reject({
        ...error,
        response: {
          ...error.response,
          data: {
            ...error.response.data,
            message:
              typeof error.response.data.message === 'string'
                ? error.response.data.message
                : Object.values(error.response.data.message)[0][0],
          },
        },
      });
    }
    return Promise.reject(error);
  }

  public setAccessToken(token: string): void {
    this.accessToken = token;
    this.axiosClient.defaults.headers[AUTH_TOKEN_HEADER] = `Bearer ${token}`;
  }

  public clearAccessToken(): void {
    this.accessToken = undefined;
    delete this.axiosClient.defaults.headers[AUTH_TOKEN_HEADER];
  }
}

export const baseService = BaseService.getInstance();
