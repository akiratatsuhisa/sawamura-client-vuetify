import _ from 'lodash';
import moment from 'moment';

type localesType = undefined | string | string[];

type dateTimeDataType = undefined | null | string | Date | moment.Moment;

type dateTimeStyle = undefined | 'full' | 'long' | 'medium' | 'short';

export namespace Format {
  export function date(
    data: dateTimeDataType,
    options?: { locales?: localesType; dateStyle?: dateTimeStyle },
  ) {
    return dateTime(data, {
      dateStyle: options?.dateStyle ?? 'long',
      timeStyle: undefined,
    });
  }

  export function dateTime(
    data: dateTimeDataType,
    options?: {
      locales?: localesType;
      dateStyle?: dateTimeStyle;
      timeStyle?: dateTimeStyle;
      timeZone?: string;
    },
  ) {
    const { locales, dateStyle, timeStyle, timeZone } = options ?? {};

    if (
      _.isNil(data) ||
      (_.isString(data) && _.trim(data) === '') ||
      !moment(data).isValid()
    ) {
      return '';
    }

    data = moment(data).toDate();

    return new Intl.DateTimeFormat(locales, {
      dateStyle,
      timeStyle,
      timeZone,
    }).format(data);
  }

  export function currency(
    data: unknown,
    options?: { locales?: localesType; currency?: string },
  ): string {
    const { locales, currency = 'USD' } = options ?? {};

    if (_.isNil(data) || _.trim(String(data)) === '') {
      return '';
    }

    if (_.isNaN(data)) {
      return 'N/a';
    }

    return new Intl.NumberFormat(locales, {
      style: 'currency',
      currency,
    }).format(Number(data));
  }
}
