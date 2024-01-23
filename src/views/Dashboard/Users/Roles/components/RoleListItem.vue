<template>
  <v-list-item tag="div">
    <template #prepend>
      <v-icon icon="mdi-menu" class="handle cursor-move" />
    </template>

    <v-list-item-title> {{ value.name }} </v-list-item-title>

    <template #append>
      <v-tooltip
        v-if="value.default"
        location="start"
        :text="translate('actions.default')"
        content-class="elevation-2"
      >
        <template #activator="{ props }">
          <v-btn
            icon="mdi-shield-lock-outline"
            variant="plain"
            v-bind="props"
          />
        </template>
      </v-tooltip>

      <v-menu v-else location="start bottom">
        <template #activator="{ props }">
          <v-btn
            icon="mdi-dots-vertical"
            variant="plain"
            v-bind="props"
            :loading="loading"
          />
        </template>

        <v-list class="bg-surface-container-high text-on-surface" rounded="xl">
          <v-list-item
            append-icon="mdi-pencil-outline"
            :title="translate('actions.update')"
            @click="onAction('update')"
          />

          <v-list-item
            append-icon="mdi-trash-can-outline"
            :title="translate('actions.delete')"
            @click="onAction('delete')"
          />
        </v-list>
      </v-menu>
    </template>
  </v-list-item>
</template>

<script lang="ts" setup>
import { usePageLocale } from '@/composables';
import { IRoleResponse } from '@/interfaces';

const props = defineProps<{
  value: IRoleResponse;
  loading: boolean;
}>();

const emit = defineEmits<{
  (
    event: 'action',
    value: { mode: 'update' | 'delete'; value: IRoleResponse },
  ): void;
}>();

const { translate } = usePageLocale({ prefix: 'dashboard.users.roles' });

function onAction(mode: 'update' | 'delete') {
  emit('action', { mode, value: props.value });
}
</script>
