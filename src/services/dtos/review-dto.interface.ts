export interface CreateReviewDto {
  rental_id: number;
  user_id: number;
  rating: number;
  comment: string;
}

export interface UpdateReviewDto {
  rating?: number;
  comment?: string;
}
