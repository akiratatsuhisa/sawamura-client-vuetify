import axios, { CreateAxiosDefaults } from 'axios';

import { Service } from '@/services/common';

import { AuthService } from './auth';
import { RolesService } from './roles';
import { RoomsService } from './rooms';
import { UsersService } from './users';

export { Service };

export const config: CreateAxiosDefaults = {
  baseURL: import.meta.env.VITE_API_URL,
};

export const axiosInstacne = axios.create(config);

export const services = {
  auth: new AuthService(),
  users: new UsersService(),
  roles: new RolesService(),
  rooms: new RoomsService(),
};
