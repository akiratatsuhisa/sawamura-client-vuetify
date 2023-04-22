<template>
  <v-list-item tag="div" class="bg-surface">
    <template #prepend>
      <v-icon icon="mdi-menu" class="handle cursor-move" />
    </template>
    <v-list-item-title> {{ value.name }} </v-list-item-title>
    <template #append>
      <v-tooltip v-if="value.default" location="start" text="Default value">
        <template v-slot:activator="{ props }">
          <v-btn
            icon="mdi-shield-lock-outline"
            variant="plain"
            v-bind="props"
          ></v-btn>
        </template>
      </v-tooltip>
      <v-menu v-else location="start bottom">
        <template v-slot:activator="{ props }">
          <v-btn
            icon="mdi-dots-vertical"
            variant="plain"
            v-bind="props"
            :loading="loading"
          ></v-btn>
        </template>
        <v-list>
          <v-list-item
            append-icon="mdi-pencil-outline"
            title="Update"
            @click="onAction('update')"
          />
          <v-list-item
            append-icon="mdi-trash-can-outline"
            title="Delete"
            @click="onAction('delete')"
          />
        </v-list>
      </v-menu>
    </template>
  </v-list-item>
</template>

<script lang="ts" setup>
import { IRoleResponse } from '@/interfaces/roles';

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

function onAction(mode: 'update' | 'delete') {
  emit('action', { mode, value: props.value });
}
</script>
