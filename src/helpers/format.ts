import dayjs from 'dayjs';
import Decimal from 'decimal.js';
import _ from 'lodash';

type localesType = undefined | string | string[];

type dateTimeDataType = undefined | null | string | Date | dayjs.Dayjs;

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
  export function dateTime(
    data: dateTimeDataType,
    options?: {
      locales?: localesType;
      dateStyle?: dateTimeStyle;
      timeStyle?: dateTimeStyle;
      timeZone?: string;
    },
  ): string {
    const { locales, dateStyle, timeStyle, timeZone } = options ?? {};

    if (
      _.isNil(data) ||
      (_.isString(data) && _.trim(data) === '') ||
      !dayjs(data).isValid()
    ) {
      return '';
    }

    data = dayjs(data).toDate();

    return new Intl.DateTimeFormat(locales, {
      dateStyle,
      timeStyle,
      timeZone,
    }).format(data);
  }

  export function date(
    data: dateTimeDataType,
    options?: { locales?: localesType; dateStyle?: dateTimeStyle },
  ): string {
    return dateTime(data, {
      dateStyle: options?.dateStyle ?? 'long',
      timeStyle: undefined,
    });
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
    data?: Decimal.Value,
    options?: { outputUnit?: BinaryUnit; inputUnit?: BinaryUnit },
  ): string {
    if (_.isNil(data) || _.trim(String(data)) === '') {
      return '';
    }

    if (_.isNaN(data)) {
      return 'N/a';
    }

    const bytes = new Decimal(data);

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

type RGBColor = { r: number; g: number; b: number };

type ARGBColor = { a: number; r: number; g: number; b: number };

/**
 * @param {number} value must be a number like 4278928261 (0xFF0B4385 with FF: alpha, 0B: red, green: 43, blue: 85)
 * @returns {RGBColor | ARGBColor}
 */
export function numberToRgb(value: number, alpha: true): ARGBColor;
export function numberToRgb(value: number, alpha?: false): RGBColor;
export function numberToRgb(value: number, alpha?: any): any {
  value = Number(value);

  const a = (value >> 24) & 255;
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;

  return alpha
    ? ({
        a,
        r,
        g,
        b,
      } as ARGBColor)
    : ({
        r,
        g,
        b,
      } as RGBColor);
}

/**
 * @param {RGBColor | ARGBColor} rgb
 * @returns {number}
 */
export function rgbToNumber(value: RGBColor | ARGBColor): number {
  return (
    ((value as ARGBColor)?.a ?? 255) * (1 << 24) +
    (value.r << 16) +
    (value.g << 8) +
    (value.b << 0)
  );
}

export function addPrefixToCSS(css: string, prefix: string): string {
  const selectorRegex = /(\.v-theme--\w[\w-]*)/g;
  return css.replace(selectorRegex, `${prefix} $1`);
}
