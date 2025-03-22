/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosInstance } from 'axios';

import { baseService } from '@/services/base/base.service';
import {
  CreateRentalDto,
  UpdateRentalDto,
} from '@/services/dtos/rental-dto.interface';

import { IBaseService } from './interfaces/base-service.interface';

import { Rental } from '@/types/rental.type';

export class RentalService {
  private static instance: RentalService;
  private readonly api: AxiosInstance;
  private readonly baseUrl = '/rentals';

  private constructor(private readonly baseService: IBaseService) {
    this.api = this.baseService.getClient();
  }

  public static getInstance(baseService: IBaseService): RentalService {
    if (!RentalService.instance) {
      RentalService.instance = new RentalService(baseService);
    }
    return RentalService.instance;
  }

  /**
   * Create a new rental
   * @param createRentalDto - Rental data to create
   * @returns Promise with the created rental
   */
  createRental = async (createRentalDto: CreateRentalDto): Promise<Rental> => {
    const { data } = await this.api.post<Rental>(this.baseUrl, createRentalDto);
    return data;
  };

  /**
   * Get a rental by ID
   * @param rentalId - ID of the rental to retrieve
   * @returns Promise with the rental data
   */
  getRental = async (rentalId: number | string): Promise<Rental> => {
    const { data } = await this.api.get<Rental>(`${this.baseUrl}/${rentalId}`);
    return data;
  };

  /**
   * Get all rentals with optional filtering
   * @param params - Optional query parameters for filtering
   * @returns Promise with an array of rentals
   */
  getRentals = async (params?: Record<string, unknown>): Promise<Rental[]> => {
    const { data } = await this.api.get<Rental[]>(this.baseUrl, {
      params,
    });
    return data;
  };

  /**
   * Update a rental
   * @param rentalId - ID of the rental to update
   * @param updateRentalDto - Rental data to update
   * @returns Promise with the updated rental
   */
  updateRental = async (
    rentalId: number | string,
    updateRentalDto: UpdateRentalDto,
  ): Promise<Rental> => {
    const { data } = await this.api.put<Rental>(
      `${this.baseUrl}/${rentalId}`,
      updateRentalDto,
    );
    return data;
  };

  /**
   * Delete a rental
   * @param rentalId - ID of the rental to delete
   * @returns Promise with the deleted rental
   */
  deleteRental = async (rentalId: number | string): Promise<void> => {
    await this.api.delete(`${this.baseUrl}/${rentalId}`);
  };
}

// Export a singleton instance
const rentalService = RentalService.getInstance(baseService);

export default rentalService;
