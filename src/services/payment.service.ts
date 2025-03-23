/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosInstance } from 'axios';

import { baseService } from '@/services/base/base.service';
import {
  CreatePaymentDto,
  UpdatePaymentDto,
} from '@/services/dtos/payment-dto.interface';

import { IBaseService } from './interfaces/base-service.interface';

import { Payment } from '@/types/payment.type';

export class PaymentService {
  private static instance: PaymentService;
  private readonly api: AxiosInstance;
  private readonly baseUrl = '/payments';

  private constructor(private readonly baseService: IBaseService) {
    this.api = this.baseService.getClient();
  }

  public static getInstance(baseService: IBaseService): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService(baseService);
    }
    return PaymentService.instance;
  }

  /**
   * Create a new payment
   * @param createPaymentDto - Payment data to create
   * @returns Promise with the created payment
   */
  createPayment = async (
    createPaymentDto: CreatePaymentDto,
  ): Promise<Payment> => {
    const { data } = await this.api.post<Payment>(
      this.baseUrl,
      createPaymentDto,
    );
    return data;
  };

  /**
   * Get a payment by ID
   * @param paymentId - ID of the payment to retrieve
   * @returns Promise with the payment data
   */
  getPayment = async (paymentId: number): Promise<Payment> => {
    const { data } = await this.api.get<Payment>(
      `${this.baseUrl}/${paymentId}`,
    );
    return data;
  };

  /**
   * Get all payments with optional filtering
   * @param params - Optional query parameters for filtering
   * @returns Promise with an array of payments
   */
  getPayments = async (
    params?: Record<string, unknown>,
  ): Promise<Payment[]> => {
    const { data } = await this.api.get<Payment[]>(this.baseUrl, {
      params,
    });
    return data;
  };

  /**
   * Update a payment
   * @param paymentId - ID of the payment to update
   * @param updatePaymentDto - Data to update
   * @returns Promise with the updated payment
   */
  updatePayment = async (
    paymentId: number,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment> => {
    const { data } = await this.api.put<Payment>(
      `${this.baseUrl}/${paymentId}`,
      updatePaymentDto,
    );
    return data;
  };

  /**
   * Delete a payment
   * @param paymentId - ID of the payment to delete
   * @returns Promise with success status
   */
  deletePayment = async (paymentId: number): Promise<void> => {
    await this.api.delete(`${this.baseUrl}/${paymentId}`);
  };
}

const paymentService = PaymentService.getInstance(baseService);

export default paymentService;
