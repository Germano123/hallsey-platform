import { AbstractDto } from "../abstract-dto";

export type Credentials = {
  email: string;
  password: string;
}

export type RegisterData = {
  name?: string;
  email: string;
  password: string;
  roles: string[];
}

export interface User extends AbstractDto {
  name?: string;
  email?: string;
  role: string;
  // timestamps
  lastLoginAt?: Date;
}

export interface LoggedUser extends User {
  accessToken?: string;
}

export interface IAuthService {
  login(credentials: Credentials): Promise<LoggedUser | null>;
  register(data: RegisterData): Promise<User>;
  logout(): Promise<void>;
  refreshToken(): Promise<void>;
  getOrCreateUser(uid: string): Promise<User>;
}
