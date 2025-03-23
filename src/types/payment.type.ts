export interface Payment {
  id: number;
  rental_id: number;
  user_id: number;
  amount: number;
  payment_method: string;
  payment_date: string;
  status: string;
  created_at: string;
  updated_at: string;
}
