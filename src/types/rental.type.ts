export interface Rental {
  id: number;
  user_id: number;
  vehicle_id: number;
  start_time: string;
  end_time: string;
  total_price: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}
