export interface Vehicle {
  id: number;
  brand: string;
  license_plate: string;
  name: string;
  status: 'available' | 'unavailable' | 'maintenance' | 'rented' | 'expired';
  type: string;
  location_id: number;
  price_per_day: number;
  price_per_month: number;
  price_per_year: number;
  image: string;
  pickup_location: string;
}
