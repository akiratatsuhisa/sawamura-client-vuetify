<template>
  <v-base-dialog
    mobile-width="500"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    :disabled-submit="!submitable"
    @submit="onSubmit"
    @open="onOpen"
  >
    <template #title>Role</template>

    <v-text-field
      class="mt-3"
      label="Role name"
      v-model="v$.name.$model"
      :error-messages="getErrorMessage(v$.name)"
      @blur="v$.name.$validate"
    ></v-text-field>

    <template #action>Update</template>
  </v-base-dialog>
</template>

<script lang="ts" setup>
import { maxLength, required } from '@vuelidate/validators';
import { reactive } from 'vue';
import { useRoute } from 'vue-router';

import { getErrorMessage, useAxios, useVuelidate } from '@/composables';
import { IUpdateRoleRequest } from '@/interfaces';
import { services } from '@/services';

defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'submit', value: IUpdateRoleRequest): void;
}>();

const form = reactive<IUpdateRoleRequest>({
  id: '',
  name: '',
});

const [v$, { handleSubmit, submitable }] = useVuelidate(
  {
    id: {
      required: required,
    },
    name: {
      required,
      maxLength: maxLength(255),
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
