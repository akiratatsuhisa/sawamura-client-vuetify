<template>
  <v-base-dialog
    mobile-width="500"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    :disabled-submit="!submitable"
    @submit="onSubmit"
    @open="onOpen"
  >
    <template #title>{{ translate('title') }}</template>

    <v-text-field
      class="mt-3"
      :label="translateFormField('name')"
      v-model="v$.name.$model"
      @blur="v$.name.$validate"
      :error-messages="getErrorMessage(v$.name)"
    />

    <template #action>{{ translate('form.submit') }}</template>
  </v-base-dialog>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { useRoute } from 'vue-router';

import {
  getErrorMessage,
  useAxios,
  usePageLocale,
  useVuelidate,
} from '@/composables';
import { IUpdateRoleRequest } from '@/interfaces';
import { services } from '@/services';
import { maxLength, required } from '@/validators';

defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'submit', value: IUpdateRoleRequest): void;
}>();

const { translate, pathFormField, translateFormField } = usePageLocale({
  prefix: 'dashboard.users.roles.update',
});

const form = reactive<IUpdateRoleRequest>({
  id: '',
  name: '',
});

const [v$, { handleSubmit, submitable }] = useVuelidate(
  {
    id: {
      required: required(pathFormField('id')),
    },
    name: {
      required: required(pathFormField('name')),
      maxLength: maxLength(pathFormField('name'), 255),
    },
  },
  form,
);

const onSubmit = handleSubmit((data) => {
  emit('submit', data);
  emit('update:modelValue', false);
});

const route = useRoute();
const { excute } = useAxios(services.roles, 'getById');

async function onOpen() {
  try {
    const result = await excute({ id: route.params.id as string });

    form.id = result.id;
    form.name = result.name;

    v$.value.$reset();
  } catch {
    emit('update:modelValue', false);
  }
}
</script>
