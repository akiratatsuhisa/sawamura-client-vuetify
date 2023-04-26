import {
  ErrorObject,
  GlobalConfig,
  useVuelidate as useDefault,
  Validation,
  ValidationArgs,
} from '@vuelidate/core';
import _ from 'lodash';
import { computed, ComputedRef, isProxy, Ref, ref, unref } from 'vue';

export function getErrorMessage(
  field: { $errors: ErrorObject[] },
  all: true,
): string[] | undefined;
export function getErrorMessage(
  field: { $errors: ErrorObject[] },
  all?: boolean,
): string | undefined;
export function getErrorMessage(
  field: { $errors: ErrorObject[] },
  all?: boolean,
): string[] | string | undefined {
  if (all) {
    if (!field.$errors.length) {
      return;
    }
    return field.$errors.map((error) => unref(error.$message));
  }

  const error = field.$errors.at(0);
  return !error ? undefined : unref(error.$message);
}

export function setFieldData<T>(data: T | undefined | null): T {
  return data as unknown as T;
}

export function useVuelidate<
  T extends { [key in keyof Vargs]: any },
  Vargs extends ValidationArgs = ValidationArgs,
>(
  validationsArgs: Ref<Vargs> | Vargs,
  state: T | Ref<T>,
  globalConfig?: GlobalConfig,
): [
  Ref<Validation<Vargs, Vargs>>,
  {
    isLoading: Ref<boolean>;
    handleSubmit(
      callback: (values: T) => void | Promise<void>,
    ): () => Promise<void>;
    submitable: ComputedRef<boolean>;
  },
] {
  if (!isProxy(state)) {
    throw new Error('custom vuevalidate state must be proxy');
  }

  const isLoading = ref<boolean>(false);

  const vuelidate = useDefault(validationsArgs, state, globalConfig);

  function transform(state: Record<string | number, any>) {
    for (const [key, value] of _.entries(state)) {
      if (typeof value === 'string' && value === '') {
        state[key] = null;
      } else if (_.isObject(value) || _.isArray(value)) {
        state[key] = transform(value);
      }
    }
    return state;
  }

  function handleSubmit(callback: (data: T) => void | Promise<void>) {
    return async () => {
      try {
        if (isLoading.value || !(await vuelidate.value.$validate())) {
          return;
        }
        isLoading.value = true;

        await Promise.resolve(
          callback(transform(_.cloneDeep(unref(state))) as T),
        );
      } finally {
        isLoading.value = false;
      }
    };
  }

  const submitable = computed(() => vuelidate.value.$anyDirty);

  return [vuelidate, { isLoading, handleSubmit, submitable }];
}
