/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosInstance } from 'axios';

import { baseService } from '@/services/base/base.service';
import {
  CreateReviewDto,
  UpdateReviewDto,
} from '@/services/dtos/review-dto.interface';

import { IBaseService } from './interfaces/base-service.interface';

import { Review } from '@/types/review.type';

export class ReviewService {
  private static instance: ReviewService;
  private readonly api: AxiosInstance;
  private readonly baseUrl = '/reviews';

  private constructor(private readonly baseService: IBaseService) {
    this.api = this.baseService.getClient();
  }

  public static getInstance(baseService: IBaseService): ReviewService {
    if (!ReviewService.instance) {
      ReviewService.instance = new ReviewService(baseService);
    }
    return ReviewService.instance;
  }

  /**
   * Create a new review
   * @param createReviewDto - Review data to create
   * @returns Promise with the created review
   */
  createReview = async (createReviewDto: CreateReviewDto): Promise<Review> => {
    const { data } = await this.api.post<Review>(this.baseUrl, createReviewDto);
    return data;
  };

  /**
   * Get a review by ID
   * @param reviewId - ID of the review to retrieve
   * @returns Promise with the review data
   */
  getReview = async (reviewId: number): Promise<Review> => {
    const { data } = await this.api.get<Review>(`${this.baseUrl}/${reviewId}`);
    return data;
  };

  /**
   * Get all reviews with optional filtering
   * @param params - Optional query parameters for filtering
   * @returns Promise with an array of reviews
   */
  getReviews = async (params?: Record<string, unknown>): Promise<Review[]> => {
    const { data } = await this.api.get<Review[]>(this.baseUrl, { params });
    return data;
  };

  /**
   * Update a review
   * @param reviewId - ID of the review to update
   * @param updateReviewDto - Data to update
   * @returns Promise with the updated review
   */
  updateReview = async (
    reviewId: number,
    updateReviewDto: UpdateReviewDto,
  ): Promise<Review> => {
    const { data } = await this.api.put<Review>(
      `${this.baseUrl}/${reviewId}`,
      updateReviewDto,
    );
    return data;
  };

  /**
   * Delete a review
   * @param reviewId - ID of the review to delete
   * @returns Promise with success status
   */
  deleteReview = async (reviewId: number): Promise<void> => {
    await this.api.delete(`${this.baseUrl}/${reviewId}`);
  };
}

const reviewService = ReviewService.getInstance(baseService);

export default reviewService;
