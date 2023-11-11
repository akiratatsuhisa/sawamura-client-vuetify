<template>
  <v-display-profile :cover-url="coverUrl" :photo-url="photoUrl">
    <template #actions>
      <v-btn
        size="36"
        variant="tonal"
        icon="mdi-account-circle-outline"
        @click="openDialog('photo')"
      />
      <v-btn
        size="36"
        variant="tonal"
        icon="mdi-image-outline"
        @click="openDialog('cover')"
      />
      <v-spacer></v-spacer>
      <v-btn variant="tonal" height="36">
        {{ translate('editButton') }}
      </v-btn>
    </template>
  </v-display-profile>

  <template v-for="(dialog, name) in dialogs" :key="name">
    <component
      :is="dialog.component"
      :model-value="isActiveDialog(name)"
      @update:model-value="closeDialog"
      @submit="dialog.onSubmit"
    />
  </template>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent } from 'vue';

import {
  useAuth,
  useBackgroundRoute,
  usePageLocale,
  useRouterDialog,
  useThemeStyle,
} from '@/composables';
import VDisplayProfile from '@/views/Users/components/DisplayProfile.vue';

const { translate } = usePageLocale({ prefix: 'users.profile' });

const { coverUrl, photoUrl, user } = useAuth();

useThemeStyle(computed(() => user.value?.themeStyle));

const route = useBackgroundRoute();

const { isActiveDialog, openDialog, closeDialog } = useRouterDialog({
  name: 'Users:Detail',
  defaultParams: computed(() => ({
    username: route.value.params.username,
  })),
  param: 'dialog',
});

const dialogs = {
  photo: {
    component: defineAsyncComponent(
      () => import('@/views/Users/components/DialogProfilePhoto.vue'),
    ),
    onSubmit: () => undefined,
  },
  cover: {
    component: defineAsyncComponent(
      () => import('@/views/Users/components/DialogProfileCover.vue'),
    ),
    onSubmit: () => undefined,
  },
};
</script>
