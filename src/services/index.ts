import axios, { CreateAxiosDefaults } from 'axios';

import { AuthService } from '@/services/auth';
import { Service } from '@/services/common';
import { OauthService } from '@/services/oauth';
import { RolesService } from '@/services/roles';
import { RoomsService } from '@/services/rooms';
import { UsersService } from '@/services/users';

export { Service };

export const config: CreateAxiosDefaults = {
  baseURL: import.meta.env.VITE_API_URL,
};

export const axiosInstacne = axios.create(config);

export const services = {
  auth: new AuthService(),
  oauth: new OauthService(),
  users: new UsersService(),
  roles: new RolesService(),
  rooms: new RoomsService(),
};
