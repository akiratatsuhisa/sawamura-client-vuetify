<template>
  <v-base-dialog
    mobile-width="700"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    @submit="onSubmit"
    @open="onOpen"
  >
    <template #title>Profile Edit</template>

    <v-row class="my-2">
      <v-col cols="6" md="6" class="pr-1">
        <v-text-field label="First Name" />
      </v-col>
      <v-col cols="6" md="6" class="pl-1">
        <v-text-field label="Last Name" />
      </v-col>
      <v-col cols="12">
        <v-text-field label="Birth Date" />
      </v-col>
      <v-col cols="12">
        <v-text-field label="Salary" prefix="$" />
      </v-col>
      <v-col cols="12">
        <v-text-field label="Email" />
      </v-col>
    </v-row>

    <template #action>Change</template>
  </v-base-dialog>
</template>

<script lang="ts" setup>
defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'submit', data: any): void;
}>();

async function onSubmit() {
  emit('update:modelValue', false);
}

function onOpen() {}
</script>
