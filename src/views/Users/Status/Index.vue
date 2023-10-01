<template>
  <v-main
    :class="[$vuetify.display.xs ? 'bg-surface' : 'bg-surface-container']"
  >
    <div v-if="!data" class="fill-height d-flex align-center justify-center">
      <v-progress-circular size="88" width="6" color="primary" indeterminate />
    </div>
    <v-container v-else fluid class="pa-0 pa-sm-4">
      <div class="d-flex">
        <div class="flex-grow-1 flex-shrink-1">
          <v-whinny-content
            :key="data.id"
            detail
            :data="data"
            :user="data.user"
            class="bg-surface"
            :class="[
              { 'my-4': $vuetify.display.smAndUp },
              $vuetify.display.xs ? 'rounded-0' : 'rounded-xl',
            ]"
          />
          <v-main-content :source-id="data.id" />
        </div>
        <div
          v-if="$vuetify.display.mdAndUp"
          :style="{ width: $vuetify.display.lgAndDown ? '300px' : '450px' }"
          class="flex-grow-0 flex-shrink-0 ml-0 ml-sm-4 ml-lg-12"
        >
          <v-recommend-follows class="my-4" />
          <v-trendings class="my-4" />
        </div>
      </div>
    </v-container>

    <v-floating-action-button-wrapper>
      <template #default>
        <v-floating-action-button
          icon="mdi-chat-plus-outline"
          :is-fab-show="$vuetify.display.smAndDown"
          @click="openModalComposeWhinny"
        />
      </template>

      <template #rail>
        <v-floating-action-button
          icon="mdi-chat-plus-outline"
          :is-fab-show="$vuetify.display.mdAndUp"
          @click="openModalComposeWhinny"
          :screen-fab="false"
        />
      </template>
    </v-floating-action-button-wrapper>
  </v-main>
</template>

<script lang="ts" setup>
import _ from 'lodash';
import { watch } from 'vue';
import { useRouter } from 'vue-router';

import VRecommendFollows from '@/components/RecommendFollows/Index.vue';
import VTrendings from '@/components/Trendings/Index.vue';
import VWhinnyContent from '@/components/Whinnies/WhinnyContent.vue';
import { useAxios, useBackgroundRoute, useRouterModal } from '@/composables';
import { services } from '@/services';
import VMainContent from '@/views/Users/Status/components/MainContent.vue';

const router = useRouter();
const route = useBackgroundRoute();

const { excute, data } = useAxios(services.whinnies, 'getByUrlId');

watch(
  () => route.value.params.urlId as string,
  async (urlId) => {
    if (!urlId) {
      return;
    }

    const whinny = await excute({ urlId });
    if (router.currentRoute.value.name === 'Users:Status') {
      const route = router.currentRoute.value;
      router.replace({
        name: route.name!,
        params: { urlId: whinny.urlId, username: whinny.user.username },
      });
    }
  },
  { immediate: true },
);

const { openModal } = useRouterModal();
function openModalComposeWhinny() {
  openModal(
    { name: 'Compose:Whinny' },
    {
      type: 'Comment',
      whinny: {
        ..._.pick(data.value, [
          'id',
          'urlId',
          'type',
          'content',
          'publishDate',
          'createdAt',
          'updatedAt',
        ]),
        user: {
          ..._.pick(data.value?.user, [
            'id',
            'username',
            'displayName',
            'photoUrl',
          ]),
        },
      },
    },
  );
}
</script>
