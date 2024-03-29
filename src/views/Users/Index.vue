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
          <v-source v-if="identityUser?.username === data?.username" />
          <v-target v-else />

          <v-main-content ref="mainContentRef" :query="{ username }" />
        </div>
        <div
          v-if="$vuetify.display.mdAndUp"
          :style="{ width: $vuetify.display.lgAndDown ? '300px' : '450px' }"
          class="flex-grow-0 flex-shrink-0 ml-0 ml-sm-4 ml-lg-12"
        >
          <v-display-last-medias />
          <v-recommend-follows class="my-4" />
          <v-trendings class="my-4" />
        </div>
      </div>
    </v-container>

    <v-floating-action-button-wrapper>
      <template #default>
        <v-floating-action-button
          icon="mdi-pencil-plus-outline"
          :is-fab-show="$vuetify.display.smAndDown"
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
import { storeToRefs } from 'pinia';
import { computed, provide, Ref, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import VRecommendFollows from '@/components/RecommendFollows/Index.vue';
import VTrendings from '@/components/Trendings/Index.vue';
import {
  useAuth,
  useAxios,
  useBackgroundRoute,
  useRouterModal,
} from '@/composables';
import { KEYS } from '@/constants';
import {
  IComposeWhinnyProps,
  IProfileUserResponse,
  IWhinnyResponse,
} from '@/interfaces';
import { services } from '@/services';
import { useProfileUserStore } from '@/store';
import VDisplayLastMedias from '@/views/Users/components/DisplayLastMedias.vue';
import VMainContent from '@/views/Users/components/MainContent.vue';
import VSource from '@/views/Users/Source.vue';
import VTarget from '@/views/Users/Target.vue';

const profileUserStore = useProfileUserStore();
const { user } = storeToRefs(profileUserStore);

const router = useRouter();
const route = useBackgroundRoute();
const { user: identityUser } = useAuth();

const { request, data, headers } = useAxios(
  services.profileUsers,
  'searchProfileByUsername',
);

const hasFollowing = ref<boolean>(false);

const username = computed(() => route.value.params.username as string);

watch(
  username,
  async (username, _prev, onCleanup) => {
    if (!username) {
      return;
    }
    if (
      route.value.params.dialog &&
      username !== identityUser.value?.username
    ) {
      router.replace({
        name: 'Users:Detail',
        params: { username },
      });
    }

    const result = await request({ username });
    hasFollowing.value = headers.value.get('Has-Following') === 'true';
    user.value = result;

    onCleanup(() => {
      user.value = undefined;
    });
  },
  { immediate: true },
);

provide(KEYS.USERS.PAGE.PROFILE_USER, data as Ref<IProfileUserResponse>);
provide(KEYS.USERS.PAGE.HAS_FOLLOWING, hasFollowing);

const isIdentityUserPage = computed(
  () => username.value === identityUser.value?.username,
);

const mainContentRef = ref<InstanceType<typeof VMainContent>>();

const { openModal } = useRouterModal<IComposeWhinnyProps, IWhinnyResponse>({
  key: 'Users:Detail',
  onSuccess(data) {
    if (!isIdentityUserPage.value) {
      setTimeout(() => {
        router.push({
          name: 'Users:Status',
          params: { username: data.user.username, urlId: data.urlId },
        });
      }, 100);
      return;
    }

    mainContentRef.value?.insertWhinny(data);
  },
});

function openModalComposeWhinny() {
  openModal(
    { name: 'Compose:Whinny' },
    {
      type: 'Owner',
      username: !isIdentityUserPage.value ? username.value : undefined,
    },
  );
}

provide(KEYS.WHINNY.ON_CREATE, (data) => {
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
  mainContentRef.value?.deleteWhinny(data);
});
</script>
