export interface CreatePaymentDto {
  rental_id: number;
  user_id: number;
  amount: number;
  payment_method: string;
  payment_date: string;
  status?: string;
}

export interface UpdatePaymentDto {
  rental_id?: number;
  user_id?: number;
  amount?: number;
  payment_method?: string;
  payment_date?: string;
  status?: string;
}
