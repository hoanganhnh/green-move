export interface CreateVehicleDto {
  name: string;
  brand: string;
  type: string;
  license_plate: string;
  status: string;
  location_id: number;
  price_per_day: number;
  price_per_month?: number;
  price_per_year?: number;
  image?: string;
}

export interface UpdateVehicleDto {
  name?: string;
  brand?: string;
  type?: string;
  license_plate?: string;
  status?: string;
  location_id?: number;
  price_per_day?: number;
  price_per_month?: number;
  price_per_year?: number;
  image?: string;
}
