import _ from 'lodash';
import { LocationQueryValue, RouteLocationNormalized } from 'vue-router';

export namespace Router {
  export const TAKE_LIMITS = [
    { value: 10 },
    { value: 25 },
    { value: 50 },
    { value: 100 },
  ];

  export const SKIP_DEFAULT = '0';
  export const TAKE_DEFAULT = TAKE_LIMITS[0].value.toString();

  export function getQuery(
    value: LocationQueryValue | LocationQueryValue[],
  ): string | undefined {
    return _.isArray(value)
      ? (value[0] as string)
      : _.isNil(value) || value === ''
      ? undefined
      : (value as string);
  }

  export function getQueryAll(
    value: LocationQueryValue | LocationQueryValue[],
  ): Array<string> | undefined {
    return _.isArray(value)
      ? (value as Array<string> | undefined)
      : _.isNil(value) || value === ''
      ? ([] as Array<string>)
      : ([value] as Array<string>);
  }

  export function parseSearchForm<F extends Object>(form: F) {
    function parse<T>(values: T) {
      {
        for (const key in values) {
          const value = values[key];
          if (_.isNil(value) || value === '') {
            delete values[key];
            continue;
          }
          if (_.isObject(value)) {
            if (_.isEmpty(value)) {
              delete values[key];
            } else {
              values[key] = parse(value);
            }
          }
        }
        return values;
      }
    }

    return parse(_.cloneDeep(form)) satisfies F;
  }

  export const ExcludeBackRouteNames = [
    'Auth',
    'Oauth',
    'Settings',
    'Users:Detail',
  ];

  export function setBackRoute(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
  ) {
    if (
      !_.some(
        ExcludeBackRouteNames,
        (name) => from.name?.toString().startsWith(name),
      )
    ) {
      to.meta.backRoute = from;
    }
  }
}
