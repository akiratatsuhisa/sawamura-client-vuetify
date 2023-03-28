import Decimal from 'decimal.js';
import _ from 'lodash';
import moment from 'moment';

type localesType = undefined | string | string[];

type dateTimeDataType = undefined | null | string | Date | moment.Moment;

type dateTimeStyle = undefined | 'full' | 'long' | 'medium' | 'short';

export enum BinaryUnit {
  Byte = 'B',
  Kibibyte = 'KiB',
  Mebibyte = 'MiB',
  Gibibyte = 'GiB',
  Tebibyte = 'TiB',
  Pebibyte = 'PiB',
  Exbibyte = 'EiB',
  Zebibyte = 'ZiB',
  Yobibyte = 'YiB',
}

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

  export function number(
    data: unknown,
    options?: { locales?: localesType },
  ): string {
    const { locales } = options ?? {};

    if (_.isNil(data) || _.trim(String(data)) === '') {
      return '';
    }

    if (_.isNaN(data)) {
      return 'N/a';
    }

    return new Intl.NumberFormat(locales).format(Number(data));
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

  export function binaryUnit(
    input: Decimal.Value,
    options?: { outputUnit?: BinaryUnit; inputUnit?: BinaryUnit },
  ): string {
    const bytes = new Decimal(input);

    const { outputUnit = BinaryUnit.Byte, inputUnit = BinaryUnit.Byte } =
      options ?? {};

    const units = _.values(BinaryUnit);

    const inputIndex = _.indexOf(units, inputUnit);
    const outputIndex = _.indexOf(units, outputUnit);

    const factor = 1024 ** (inputIndex - outputIndex);

    const result = new (Decimal.clone({ rounding: Decimal.ROUND_HALF_UP }))(
      bytes.times(factor),
    ).toFixed(2);

    return `${result} ${outputUnit}`;
  }
}
