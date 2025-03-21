export interface UserProfile {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  role: string | 'USER' | 'ADMIN';
}
