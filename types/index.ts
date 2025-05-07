export interface User {
  id: string;
  displayName: string;
  email: string;
  emailConfirmed: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}
