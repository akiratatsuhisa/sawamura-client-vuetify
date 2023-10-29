import { jwtDecode } from 'jwt-decode';
import _ from 'lodash';

import { IdentityUser } from '@/interfaces';

type ParseType = 'string' | 'number' | 'boolean' | 'object';

export namespace Jwt {
  export function getExpires(token?: string) {
    if (!token) {
      return null;
    }

    const payload = jwtDecode(token) as Record<string, unknown>;

    if (!payload || !payload.exp) {
      return null;
    }

    return new Date(Number(payload.exp) * 1000);
  }

  export function parseData(data: any, type?: ParseType) {
    switch (type) {
      case 'object': {
        if (data instanceof Object) {
          return data;
        }
        return null;
      }
      case 'boolean': {
        if (data instanceof Boolean) {
          return data;
        }
        if (/y|Y|yes|Yes|YES|true|True|TRUE|on|On|ON/g.test(data)) {
          return true;
        }
        if (/n|N|no|No|NO|false|False|FALSE|off|Off|OFF/g.test(data)) {
          return false;
        }
        return null;
      }
      case 'number': {
        if (data instanceof Number) {
          return data;
        }
        if (/^-?\d+\.?\d*$/g.test(data)) {
          return Number(data);
        }
        return null;
      }
      case 'string':
      default:
        return String(data);
    }
  }

  export function get(
    payload: Record<string, any>,
    name: string,
    type?: ParseType,
  ) {
    const data =
      payload[name] instanceof Array ? _.first(payload[name]) : payload[name];

    if (_.isNil(data)) {
      return null;
    }

    return parseData(data, type);
  }

  export function getAll(
    payload: Record<string, any>,
    name: string,
    type?: ParseType,
  ) {
    const data =
      payload[name] instanceof Array ? payload[name] : [payload[name]];

    if (_.isNil(data)) {
      return null;
    }

    return _.map(data, (value) => parseData(value, type));
  }

  export function parseUser(token?: string) {
    if (!token) {
      return null;
    }

    const payload = jwtDecode(token) as Record<string, unknown>;

    if (!payload) {
      return null;
    }

    return {
      id: get(payload, 'sub') as string | null,
      username: get(payload, 'username') as string | null,
      displayName: get(payload, 'displayName') as string | null,
      hasPassword: get(payload, 'hasPassword', 'boolean') as boolean | null,
      email: get(payload, 'email') as string | null,
      emailConfirmed: get(payload, 'emailConfirmed', 'boolean') as
        | boolean
        | null,
      firstName: get(payload, 'firstName') as string | null,
      lastName: get(payload, 'lastName') as string | null,
      birthDate: get(payload, 'birthDate') as string | null,
      salary: get(payload, 'salary', 'number') as number | null,
      roles: getAll(payload, 'roles') as Array<string> | null,
      photoUrl: get(payload, 'photoUrl') as string | null,
      coverUrl: get(payload, 'coverUrl') as string | null,
      themeSource: get(payload, 'themeSource') as string | null,
      themeStyle: get(payload, 'themeStyle') as string | null,
    } as IdentityUser;
  }
}
