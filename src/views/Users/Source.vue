<template>
  <v-display-profile :cover-url="coverUrl" :photo-url="photoUrl">
    <template #actions>
      <v-btn
        size="36"
        variant="tonal"
        icon="mdi-account-circle-outline"
        @click="dialogs.photo = true"
      />
      <v-btn
        size="36"
        variant="tonal"
        icon="mdi-image-outline"
        @click="dialogs.cover = true"
      />
      <v-spacer></v-spacer>
      <v-btn variant="tonal" height="36">
        {{ translate('editButton') }}
      </v-btn>
    </template>
  </v-display-profile>

  <v-dialog-profile-cover v-model="dialogs.cover" />
  <v-dialog-profile-photo v-model="dialogs.photo" />
</template>

<script lang="ts" setup>
import { useStyleTag } from '@vueuse/core';
import { computed, reactive } from 'vue';

import VDialogProfileCover from '@/components/Users/DialogProfileCover.vue';
import VDialogProfilePhoto from '@/components/Users/DialogProfilePhoto.vue';
import { useAuth, usePageLocale } from '@/composables';
import VDisplayProfile from '@/views/Users/components/DisplayProfile.vue';

const { translate } = usePageLocale({ prefix: 'users.profile' });

const { coverUrl, photoUrl, user } = useAuth();

const dialogs = reactive({
  cover: false,
  photo: false,
});

useStyleTag(
  computed(() => user.value?.themeStyle ?? ''),
  { id: 'vuetify-profile-style' },
);
</script>
