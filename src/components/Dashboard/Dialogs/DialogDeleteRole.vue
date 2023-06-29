<template>
  <v-base-dialog
    mobile-width="500"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    @submit="onSubmit"
    @open="onOpen"
  >
    <template #title>Role</template>

    <span>Delete this role: {{ name }}</span>

    <template #action>Delete</template>
  </v-base-dialog>
</template>

<script lang="ts" setup>
import { required } from '@vuelidate/validators';
import { reactive, ref } from 'vue';
import { useRoute } from 'vue-router';

import { useAxios, useVuelidate } from '@/composables';
import { IDeleteRoleRequest } from '@/interfaces';
import { services } from '@/services';

defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'submit', value: IDeleteRoleRequest): void;
}>();

const form = reactive<IDeleteRoleRequest>({
  id: '',
});

const [v$, { handleSubmit }] = useVuelidate(
  {
    id: {
      required: required,
    },
  },
  form,
);

const onSubmit = handleSubmit((data) => {
  emit('submit', data);
  emit('update:modelValue', false);
});

const name = ref('');

const route = useRoute();
const { excute } = useAxios(services.roles, 'getById');

async function onOpen() {
  try {
    const result = await excute({ id: route.params.id as string });

    form.id = result.id;
    name.value = result.name;

    v$.value.$reset();
  } catch {
    emit('update:modelValue', false);
  }
}
</script>
