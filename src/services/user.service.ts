/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosInstance } from 'axios';

import { baseService } from '@/services/base/base.service';
import {
  CreateUserDto,
  UpdateUserDto,
} from '@/services/dtos/user-dto.interface';

import { IBaseService } from './interfaces/base-service.interface';

import { UserProfile } from '@/types/user.type';

export class UserService {
  private static instance: UserService;
  private readonly api: AxiosInstance;
  private readonly baseUrl = '/users';

  private constructor(private readonly baseService: IBaseService) {
    this.api = this.baseService.getClient();
  }

  public static getInstance(baseService: IBaseService): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService(baseService);
    }
    return UserService.instance;
  }

  /**
   * Create a new user
   * @param createUserDto - User data to create
   * @returns Promise with the created user
   */
  createUser = async (createUserDto: CreateUserDto): Promise<UserProfile> => {
    const { data } = await this.api.post<UserProfile>(
      this.baseUrl,
      createUserDto,
    );
    return data;
  };

  /**
   * Get a user by ID
   * @param userId - ID of the user to retrieve
   * @returns Promise with the user data
   */
  getUserById = async (userId: number | string): Promise<UserProfile> => {
    const { data } = await this.api.get<UserProfile>(
      `${this.baseUrl}/${userId}`,
    );
    return data;
  };

  /**
   * Get all users with optional filtering
   * @param params - Optional query parameters for filtering
   * @returns Promise with an array of users
   */
  getUsers = async (
    params?: Record<string, unknown>,
  ): Promise<UserProfile[]> => {
    const { data } = await this.api.get<UserProfile[]>(this.baseUrl, {
      params,
    });
    return data;
  };

  /**
   * Update a user
   * @param userId - ID of the user to update
   * @param updateUserDto - User data to update
   * @returns Promise with the updated user
   */
  updateUser = async (
    userId: number | string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserProfile> => {
    const { data } = await this.api.put<UserProfile>(
      `${this.baseUrl}/${userId}`,
      updateUserDto,
    );
    return data;
  };

  /**
   * Delete a user
   * @param userId - ID of the user to delete
   * @returns Promise with void
   */
  deleteUser = async (userId: number | string): Promise<void> => {
    await this.api.delete(`${this.baseUrl}/${userId}`);
  };
}

// Export a singleton instance
const userService = UserService.getInstance(baseService);

export default userService;
