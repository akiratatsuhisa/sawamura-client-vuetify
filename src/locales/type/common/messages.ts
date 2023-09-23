import { messages } from '@akiratatsuhisa/sawamura-utils';

export type LocaleCommonMessages = {
  [key1 in keyof typeof messages]: {
    [key2 in keyof (typeof messages)[key1]]: string;
  };
};
