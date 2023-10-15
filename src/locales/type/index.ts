import { LocaleCommon } from './common';
import { LocaleLayout } from './layout';
import { LocalePages } from './pages';
import { LocaleValidators } from './validators';

export type LocaleMessages = {
  layout: LocaleLayout;
  pages: LocalePages;
  common: LocaleCommon;
  validators: LocaleValidators;
};
