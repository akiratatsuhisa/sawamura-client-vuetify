import axios, { CreateAxiosDefaults } from 'axios';

import { Service } from '@/services/common';

import { UsersService } from './users';

export { Service };

export const config: CreateAxiosDefaults = {
  baseURL: 'http://localhost:4000',
};

export const axiosInstacne = axios.create(config);

export const services = {
  users: new UsersService(),
};
