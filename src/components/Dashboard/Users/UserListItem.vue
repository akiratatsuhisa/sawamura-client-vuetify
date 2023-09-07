<template>
  <div class="px-1 px-md-3 py-1 d-flex flex-row align-center">
    <v-avatar
      :image="photoUrl"
      color="secondary-container"
      class="elevation-2"
      :size="$vuetify.display.mobile ? 'default' : 'x-large'"
    />
    <div
      class="h-100 px-2 flex-grow-1 text-subtitle-1 d-flex flex-column align-content-lg-space-between"
    >
      <div class="text-subtitle-1 font-weight-medium">
        {{ record.displayName }}
      </div>
      <i18n-t
        keypath="pages.dashboard.users.list.username"
        tag="div"
        scope="global"
        class="text-subtitle-2"
      >
        {{ record.username }}
      </i18n-t>
      <div class="text-body-2">{{ fullName }}</div>
      <div class="text-subtitle-2 font-weight-light">
        <v-icon size="x-small" icon="mdi-clock-outline" />
        <i18n-t
          keypath="pages.dashboard.users.list.timeAgo"
          tag="span"
          scope="global"
          class="ml-1"
        >
          {{ timeAgo }}
        </i18n-t>
      </div>
    </div>
    <v-btn
      v-if="$vuetify.display.mobile"
      variant="tonal"
      size="small"
      icon="mdi-open-in-new"
      :to="{ name: 'Users:Page', params: { username: record.username } }"
      target="_blank"
    />
    <v-btn
      v-else
      variant="tonal"
      append-icon="mdi-open-in-new"
      :to="{ name: 'Users:Page', params: { username: record.username } }"
      target="_blank"
    >
      {{ $t('common.data.view') }}
    </v-btn>
  </div>
  <v-divider class="my-1 mx-2" />
  <div class="px-1 d-flex flex-wrap align-end">
    <v-chip
      :prepend-icon="emailStateIcon"
      rounded="lg"
      variant="outlined"
      class="my-1 mr-2"
      @click="openEmail"
    >
      {{
        record.email
          ? _.truncate(record.email, { length: 40 })
          : $t('common.verifyStates.none')
      }}
    </v-chip>
    <v-chip
      v-if="record.userRoles.length"
      rounded="lg"
      variant="outlined"
      class="my-1 mr-2"
      prepend-icon="mdi-account-cog-outline"
      @click="openDialog(record.id)"
    >
      {{ record.userRoles[0].role.name }}
    </v-chip>
    <v-chip
      v-else
      rounded="lg"
      variant="outlined"
      class="my-1 mr-2"
      prepend-icon="mdi-account-cog-outline"
      @click="openDialog(record.id)"
    >
      {{ $t('common.verifyStates.none') }}
    </v-chip>
    <v-chip
      v-if="record.userRoles.length > 1"
      rounded="lg"
      variant="outlined"
      class="my-1 mr-2"
      prepend-icon="mdi-account-cog-outline"
      @click="openDialog(record.id)"
    >
      +{{ record.userRoles.length - 1 }}
    </v-chip>
    <v-chip
      v-if="record.birthDate"
      rounded="lg"
      variant="outlined"
      class="my-1 mr-2"
      prepend-icon="mdi-cake-variant-outline"
      @click="() => {}"
    >
      {{
        Format.date(record.birthDate, {
          locales: $i18n.locale,
          dateStyle: 'medium',
        })
      }}
    </v-chip>
    <v-chip
      v-if="record.salary"
      rounded="lg"
      variant="outlined"
      class="my-1 mr-2"
      prepend-icon="mdi-cash"
      @click="() => {}"
    >
      {{ Format.currency(record.salary, { locales: $i18n.locale }) }}
    </v-chip>
    <v-chip
      rounded="lg"
      variant="outlined"
      class="my-1 mr-2"
      prepend-icon="mdi-database-clock-outline"
      @click="() => {}"
    >
      {{
        Format.dateTime(record.createdAt, {
          locales: $i18n.locale,
          dateStyle: 'short',
          timeStyle: 'short',
        })
      }}
    </v-chip>
  </div>
</template>

<script lang="ts" setup>
import { useTimeAgo } from '@vueuse/core';
import _ from 'lodash';
import { computed, inject } from 'vue';

import { useUserImage } from '@/composables';
import { KEYS } from '@/constants';
import { Format } from '@/helpers';
import { IUserResponse } from '@/interfaces';

const props = defineProps<{
  record: IUserResponse;
}>();

const photoUrl = useUserImage(
  'photo',
  computed(() => props.record),
);

const fullName = computed(() =>
  _.trim(`${props.record.lastName ?? ''} ${props.record.firstName ?? ''}`),
);

const timeAgo = useTimeAgo(computed(() => props.record.updatedAt));

const emailStateIcon = computed(() => {
  if (!props.record.email) {
    return 'mdi-email-remove-outline';
  }
  if (!props.record.emailConfirmed) {
    return 'mdi-email-alert-outline';
  }
  return 'mdi-email-check-outline';
});

function openEmail() {
  if (!props.record.email) {
    return;
  }
  window.open(`mailto:${props.record.email}`);
}

const openDialog = inject(
  KEYS.DASHBOARD.USERS.DIALOGS.CHANGE_ROLES.OPEN_DIALOG,
)!;
</script>
