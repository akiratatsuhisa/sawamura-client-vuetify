<template>
  <v-btn
    v-if="$vuetify.display.smAndDown"
    class="ma-2"
    size="small"
    icon
    @click.stop="openDialog('settings')"
  >
    <v-icon class="mx-4" size="24" icon="mdi-cog" color="on-surface" />
  </v-btn>

  <v-btn v-else icon @click="openDialog('settings')">
    <v-avatar color="primary" icon="mdi-cog" />
  </v-btn>

  <v-base-dialog
    :model-value="isActiveDialog('settings')"
    @update:model-value="closeDialog"
    desktop-width="700"
  >
    <template #title>
      {{ $t('pages.explore.menuSettings.title') }}
    </template>

    <template #action>
      {{ $t('pages.explore.menuSettings.form.submit') }}
    </template>
  </v-base-dialog>
</template>

<script lang="ts" setup>
import { useRouterDialog } from '@/composables';

const { openDialog, closeDialog, isActiveDialog } = useRouterDialog({
  name: 'Explore',
  param: 'dialog',
});
</script>
