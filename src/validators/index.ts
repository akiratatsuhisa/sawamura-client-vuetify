import {
  email as originEmail,
  helpers,
  maxLength as originMaxLength,
  minLength as originMinLength,
  required as originRequired,
  requiredIf as originRequiredIf,
  sameAs as originSameAs,
} from '@vuelidate/validators';
import { Ref } from 'vue';

import i18n from '@/locales';

export const required = (label: string) =>
  helpers.withMessage(
    () => i18n.global.t('validators.required', { label: i18n.global.t(label) }),
    originRequired,
  );

export const requiredIf = (
  label: string,
  ...prop: Parameters<typeof originRequiredIf>
) =>
  helpers.withMessage(
    () => i18n.global.t('validators.required', { label: i18n.global.t(label) }),
    originRequiredIf(...prop),
  );

export const maxLength = (label: string, max: number | Ref<number>) =>
  helpers.withMessage(
    ({ $params }) =>
      i18n.global.t('validators.maxLength', {
        label: i18n.global.t(label),
        max: $params.max,
      }),
    originMaxLength(max),
  );

export const minLength = (label: string, min: number | Ref<number>) =>
  helpers.withMessage(
    ({ $params }) =>
      i18n.global.t('validators.minLength', {
        label: i18n.global.t(label),
        min: $params.min,
      }),
    originMinLength(min),
  );

export const email = helpers.withMessage(
  () => i18n.global.t('validators.email'),
  originEmail,
);

export const sameAs = <E = unknown>(
  firstField: string,
  secondField: string,
  equalTo: E | Ref<E>,
) =>
  helpers.withMessage(
    () =>
      i18n.global.t('validators.sameAs', {
        firstField: i18n.global.t(firstField),
        secondField: i18n.global.t(secondField),
      }),
    originSameAs(equalTo),
  );

export const regex = (label: string, regex: RegExp) =>
  helpers.withMessage(
    () => i18n.global.t('validators.regex', { label: i18n.global.t(label) }),
    helpers.regex(regex),
  );

export const regexCustomMessage = (
  translateMessageKey: string,
  label: string,
  regex: RegExp,
) =>
  helpers.withMessage(
    () =>
      i18n.global.t(`validators.${translateMessageKey}`, {
        label: i18n.global.t(label),
      }),
    helpers.regex(regex),
  );
