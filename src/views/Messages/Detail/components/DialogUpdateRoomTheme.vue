<template>
  <v-base-dialog
    desktop-width="500"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    :disabled-submit="isLoading"
    @submit="onSubmit"
    @open="onOpen"
  >
    <template #title>{{ translate('title') }}</template>

    <div class="d-flex mb-12 flex-column flex-md-row">
      <v-menu :close-on-content-click="false" offset="16">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            variant="flat"
            color="primary-container"
            prepend-icon="mdi-palette"
          >
            {{ translate('select') }}
            <template #append>
              <v-avatar
                v-if="themeSource"
                :color="displayThemeColor"
                size="x-small"
                class="elevation-1"
              ></v-avatar>
            </template>
          </v-btn>
        </template>

        <v-color-picker
          v-model="themePicker"
          class="overflow-hidden"
          mode="rgb"
          hide-inputs
        ></v-color-picker>
      </v-menu>

      <v-spacer></v-spacer>

      <v-btn
        color="primary"
        variant="tonal"
        class="mt-6 mt-md-0"
        @click="clearThemeSource"
      >
        {{ translate('clear') }}
      </v-btn>
    </div>

    <template #action>{{ translate('form.submit') }}</template>
  </v-base-dialog>
</template>

<script lang="ts" setup>
import { inject } from 'vue';

import { useAxios, usePageLocale, useThemePicker } from '@/composables';
import { KEYS } from '@/constants';
import { services } from '@/services';

defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'submit', data: any): void;
}>();

const { translate } = usePageLocale({
  prefix: 'messages.room.dialogs.chooseTheme',
});

const room = inject(KEYS.CHAT.ROOM)!;

const { themeSource, themePicker, displayThemeColor, clearThemeSource } =
  useThemePicker();

const { isLoading, excute: updateTheme } = useAxios(
  services.rooms,
  'updateTheme',
);

async function onSubmit() {
  await updateTheme({ id: room.value.id, source: themeSource.value });

  emit('update:modelValue', false);
}

function onOpen() {
  themeSource.value = Number(room.value.themeSource);
}
</script>
