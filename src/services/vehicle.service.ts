/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosInstance } from 'axios';

import { baseService } from '@/services/base/base.service';
import {
  CreateVehicleDto,
  UpdateVehicleDto,
} from '@/services/dtos/vehicle-dto.interface';

import { IBaseService } from './interfaces/base-service.interface';

import { Vehicle } from '@/types/vehicle.type';

export class VehicleService {
  private static instance: VehicleService;
  private readonly api: AxiosInstance;
  private readonly baseUrl = '/vehicles';

  private constructor(private readonly baseService: IBaseService) {
    this.api = this.baseService.getClient();
  }

  public static getInstance(baseService: IBaseService): VehicleService {
    if (!VehicleService.instance) {
      VehicleService.instance = new VehicleService(baseService);
    }
    return VehicleService.instance;
  }

  /**
   * Create a new vehicle
   * @param createVehicleDto - Vehicle data to create
   * @returns Promise with the created vehicle
   */
  createVehicle = async (
    createVehicleDto: CreateVehicleDto,
  ): Promise<Vehicle> => {
    const { data } = await this.api.post<Vehicle>(
      this.baseUrl,
      createVehicleDto,
    );
    return data;
  };

  /**
   * Get a vehicle by ID
   * @param vehicleId - ID of the vehicle to retrieve
   * @returns Promise with the vehicle data
   */
  getVehicle = async (vehicleId: number): Promise<Vehicle> => {
    const { data } = await this.api.get<Vehicle>(
      `${this.baseUrl}/${vehicleId}`,
    );
    return data;
  };

  /**
   * Get all vehicles with optional filtering
   * @param params - Optional query parameters for filtering
   * @returns Promise with an array of vehicles
   */
  getVehicles = async (
    params?: Record<string, unknown>,
  ): Promise<Vehicle[]> => {
    const { data } = await this.api.get<Vehicle[]>(this.baseUrl, {
      params,
    });
    return data;
  };

  /**
   * Update a vehicle
   * @param vehicleId - ID of the vehicle to update
   * @param updateVehicleDto - Data to update
   * @returns Promise with the updated vehicle
   */
  updateVehicle = async (
    vehicleId: number,
    updateVehicleDto: UpdateVehicleDto,
  ): Promise<Vehicle> => {
    const { data } = await this.api.put<Vehicle>(
      `${this.baseUrl}/${vehicleId}`,
      updateVehicleDto,
    );
    return data;
  };

  /**
   * Delete a vehicle
   * @param vehicleId - ID of the vehicle to delete
   * @returns Promise with success status
   */
  deleteVehicle = async (vehicleId: number): Promise<void> => {
    await this.api.delete(`${this.baseUrl}/${vehicleId}`);
  };
}

const vehicleService = VehicleService.getInstance(baseService);

export default vehicleService;
