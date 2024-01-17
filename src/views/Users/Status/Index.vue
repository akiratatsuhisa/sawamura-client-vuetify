<template>
  <v-main
    :class="[$vuetify.display.xs ? 'bg-surface' : 'bg-surface-container']"
  >
    <div v-if="!whinny" class="fill-height d-flex align-center justify-center">
      <v-progress-circular size="88" width="6" color="primary" indeterminate />
    </div>
    <v-container v-else fluid class="pa-0 pa-sm-4">
      <div class="d-flex">
        <div class="flex-grow-1 flex-shrink-1">
          <v-main-status :data="whinny" />

          <v-main-content
            ref="mainContentRef"
            :query="{ sourceId: whinny.id }"
          />
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
import { provide, ref, watch } from 'vue';
import { RouteLocationRaw, useRouter } from 'vue-router';

import VRecommendFollows from '@/components/RecommendFollows/Index.vue';
import VTrendings from '@/components/Trendings/Index.vue';
import { useAxios, useBackgroundRoute, useRouterModal } from '@/composables';
import { KEYS } from '@/constants';
import { IComposeWhinnyProps, IWhinnyResponse } from '@/interfaces';
import { services } from '@/services';
import VMainContent from '@/views/Users/components/MainContent.vue';
import VMainStatus from '@/views/Users/Status/components/MainStatus.vue';

const router = useRouter();
const route = useBackgroundRoute();

const { excute, data: whinny } = useAxios(services.whinnies, 'getByUrlId');

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

const mainContentRef = ref<InstanceType<typeof VMainContent>>();

const { openModal } = useRouterModal<IComposeWhinnyProps, IWhinnyResponse>({
  key: 'Users:Status',
  onSuccess(data) {
    mainContentRef.value?.insertWhinny(data);
  },
});
function openModalComposeWhinny() {
  openModal(
    { name: 'Compose:Whinny' },
    {
      type: 'Comment',
      whinny: {
        ..._.pick(whinny.value, [
          'id',
          'urlId',
          'type',
          'content',
          'publishDate',
          'createdAt',
          'updatedAt',
        ]),
        user: {
          ..._.pick(whinny.value?.user, [
            'id',
            'username',
            'displayName',
            'photoUrl',
          ]),
        },
      } as IWhinnyResponse,
    },
  );
}

provide(KEYS.WHINNY.ON_CREATE, (data) => {
  if (whinny.value && whinny.value.id === data.source!.id) {
    whinny.value.countComments++;

    mainContentRef.value?.insertWhinny(data);
    return;
  }

  setTimeout(() => {
    router.push({
      name: 'Users:Status',
      params:
        data.type === 'Quote'
          ? { username: data.user.username, urlId: data.urlId }
          : {
              username: data.source!.user!.username,
              urlId: data.source!.urlId,
            },
    });
  }, 100);
});

provide(KEYS.WHINNY.ON_DELETE, (data) => {
  if (data.urlId === route.value.params.urlId) {
    const to: RouteLocationRaw = data.source?.id
      ? {
          name: 'Users:Status',
          params: {
            username: data.source.user!.username,
            urlId: data.source.urlId,
          },
        }
      : {
          name: 'Users:Detail',
          params: {
            username: data.user.username,
          },
        };

    return router.push(to);
  }

  mainContentRef.value?.deleteWhinny(data);
});
</script>
