export interface CreateRentalDto {
  user_id: number;
  vehicle_id: number;
  start_time: string;
  end_time: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  pickup_location?: string;
}

export interface UpdateRentalDto {
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  end_time?: string;
  total_price?: number;
  pickup_location?: string;
}
