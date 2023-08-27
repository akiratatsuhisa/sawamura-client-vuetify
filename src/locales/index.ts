import { createI18n } from 'vue-i18n';

import { en } from '@/locales/en';
import { ja } from '@/locales/ja';

import { LocaleMessages } from './type';

const messages: { [key: string]: LocaleMessages } = { en, ja };

export default createI18n({
  legacy: false,
  locale: localStorage.getItem('locale:language') ?? 'en',
  fallbackLocale: 'en',
  messages,
});
