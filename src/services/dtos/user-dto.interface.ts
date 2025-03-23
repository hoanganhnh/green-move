export interface CreateUserDto {
  full_name: string;
  email: string;
  password: string;
  phone_number: string;
  role_id: number;
}

export interface UpdateUserDto {
  full_name?: string;
  email?: string;
  password?: string;
  phone_number?: string;
  role_id?: number;
}
