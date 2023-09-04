import { useI18n } from 'vue-i18n';

enum PREFIX {
  PAGE = 'pages',
  FORM = 'form',
  ALERTS = 'alerts',
  SHARED = 'shared',

  COMMON = 'common',

  LAYOUT = 'layout',
  ITEMS = 'items',
}

export interface IUseLocaleOptions {
  prefix: string;
}

export function useLocale(
  options: IUseLocaleOptions & { module?: PREFIX.PAGE | PREFIX.LAYOUT },
) {
  const { module, prefix } = options;

  const i18n = useI18n();
  const { t } = i18n;

  function path(key: string) {
    return [module, prefix, key].join('.');
  }

  function translate(
    key: string,
    payload?: Record<string, unknown> | Array<unknown>,
  ) {
    return t(path(key), payload as any);
  }

  function pathShared(key: string) {
    return [module, prefix.split('.')?.at(0), PREFIX.SHARED, key].join('.');
  }

  function translateShared(
    key: string,
    payload?: Record<string, unknown> | Array<unknown>,
  ) {
    return t(pathShared(key), payload as any);
  }

  function pathAlert(alert: string, field: string) {
    return [module, prefix, PREFIX.ALERTS, alert, field].join('.');
  }

  function makeTranslateAlert(alert: string) {
    return function (
      field: string,
      payload?: Record<string, unknown> | Array<unknown>,
    ) {
      return t(pathAlert(alert, field), payload as any);
    };
  }

  return {
    t,
    path,
    translate,
    pathShared,
    translateShared,
    pathAlert,
    makeTranslateAlert,
  };
}

export function usePageLocale(options: IUseLocaleOptions) {
  const { prefix } = options;
  const module = PREFIX.PAGE;

  const {
    t,
    path,
    translate,
    pathShared,
    translateShared,
    pathAlert,
    makeTranslateAlert,
  } = useLocale({ prefix, module });

  function pathFormField(
    field: string,
    nested: 'label' | 'placeholder' | 'hint' = 'label',
  ) {
    return [module, prefix, PREFIX.FORM, field, nested].join('.');
  }

  function translateFormField(
    field: string,
    nested: 'label' | 'placeholder' | 'hint' = 'label',
  ) {
    return t(pathFormField(field, nested));
  }

  return {
    t,
    path,
    translate,
    pathShared,
    translateShared,
    pathFormField,
    translateFormField,
    pathAlert,
    makeTranslateAlert,
  };
}

export function useLayoutLocale(options: IUseLocaleOptions) {
  const { prefix } = options;
  const module = PREFIX.LAYOUT;

  const {
    t,
    path,
    translate,
    pathShared,
    translateShared,
    pathAlert,
    makeTranslateAlert,
  } = useLocale({ prefix, module });

  function pathItem(key: string) {
    return [module, prefix, PREFIX.ITEMS, key].join('.');
  }

  function translateItem(
    key: string,
    payload?: Record<string, unknown> | Array<unknown>,
  ) {
    return t(pathItem(key), payload as any);
  }

  return {
    t,
    path,
    translate,
    pathShared,
    translateShared,
    pathItem,
    translateItem,
    pathAlert,
    makeTranslateAlert,
  };
}
