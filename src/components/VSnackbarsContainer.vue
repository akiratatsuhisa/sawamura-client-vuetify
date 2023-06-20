<template>
  <v-snackbar
    v-for="{ show, id, content, ...attrs } in snackbars"
    :key="id"
    :model-value="show"
    @update:model-value="remove(id)"
    v-bind="attrs"
  >
    <template v-if="typeof content === 'string'">
      {{ content }}
    </template>
    <template v-else>
      <component :is="content" />
    </template>

    <template v-if="typeof content === 'string'" #actions>
      <v-btn variant="text" color="on-primary" @click="remove(id)">Close</v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { useSnackbar } from '@/composables';

const { snackbars, remove } = useSnackbar();
</script>
