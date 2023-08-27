import { LocaleCommon } from '@/locales/type/common';
import { LocaleLayout } from '@/locales/type/layout';
import { LocalePages } from '@/locales/type/pages';
import { LocaleValidators } from '@/locales/type/validators';

export type LocaleMessages = {
  layout: LocaleLayout;
  pages: LocalePages;
  common: LocaleCommon;
  validators: LocaleValidators;
};
