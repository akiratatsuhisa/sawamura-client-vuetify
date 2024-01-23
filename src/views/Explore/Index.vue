<template>
  <v-main class="bg-surface-container">
    <v-container
      fluid
      class="fill-height text-center"
      :class="[$vuetify?.display.smAndDown ? 'pa-0' : 'pa-4']"
    >
      <v-responsive
        class="bg-surface h-100 d-flex align-center justify-center"
        :class="[$vuetify?.display.smAndDown ? 'rounded-0' : 'rounded-lg']"
      >
        <h1>
          {{ $t('pages.explore.content') }}
        </h1>
      </v-responsive>
    </v-container>

    <v-floating-action-button-wrapper>
      <template #default>
        <v-floating-action-button
          icon="mdi-pencil-plus-outline"
          :is-fab-show="$vuetify.display.smAndDown"
          :style="{ bottom: $vuetify.display.xs ? '80px' : '0' }"
          @click="openModalComposeWhinny"
        />
      </template>

      <template #rail>
        <v-floating-action-button
          icon="mdi-pencil-plus-outline"
          :is-fab-show="$vuetify.display.mdAndUp"
          @click="openModalComposeWhinny"
          :screen-fab="false"
        />
      </template>
    </v-floating-action-button-wrapper>
  </v-main>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

import { useRouterModal } from '@/composables';
import { IComposeWhinnyProps, IWhinnyResponse } from '@/interfaces';

const router = useRouter();

const { openModal } = useRouterModal<IComposeWhinnyProps, IWhinnyResponse>({
  key: 'Explore',
  onSuccess(data) {
    setTimeout(() => {
      router.push({
        name: 'Users:Status',
        params: { username: data.user.username, urlId: data.urlId },
      });
    }, 100);
  },
});

function openModalComposeWhinny() {
  openModal({ name: 'Compose:Whinny' }, { type: 'Owner' });
}
</script>
