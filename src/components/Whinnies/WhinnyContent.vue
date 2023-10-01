<template>
  <v-whinny-wrapper
    v-ripple="!detail"
    :direction="detail ? 'vertical' : 'horizontal'"
    :photoUrl="photoUrl"
    @click="gotoStatus"
    @goto-user="gotoUser"
  >
    <template v-if="data.type === 'Repost' || data.type === 'Quote'" #reference>
      <div class="pl-2 pb-2 text-subtitle-2">
        <v-icon color="tertiary" start>mdi-repeat-variant</v-icon>
        <span class="font-weight-medium">
          {{
            $t(
              isRepost
                ? 'common.whinny.repostTitle'
                : 'common.whinny.quoteTitle',
            )
          }}
        </span>
      </div>
    </template>

    <template #userInfo>
      <div class="w-100 d-flex justify-space-around">
        <div
          class="flex-grow-1 flex-shrink-1 text-medium-emphasis text-body-2 d-flex"
          :class="[detail ? 'flex-column' : 'flex-row flex-wrap align-center']"
          :style="{ height: '24px' }"
        >
          <div
            class="mr-1 font-weight-bold v-text-decoration-underline"
            @click.stop="gotoUser"
            v-bind="props"
          >
            {{ user.displayName }}
          </div>
          <div class="mr-1" @click.stop="gotoUser">@{{ user.username }}</div>
          <div v-if="!detail" class="mr-1">
            <use-time-ago v-slot="{ timeAgo }" :time="whinny.publishDate">
              <span class="v-text-decoration-underline font-weight-medium">
                {{ timeAgo }}
              </span>
            </use-time-ago>
          </div>
        </div>
        <div class="flex-grow-0 flex-shrink-0">
          <v-menu v-if="whinny.user.id === identityId" location="bottom right">
            <template #activator="{ props }">
              <v-btn icon variant="plain" size="24" v-bind="props">
                <v-icon icon="mdi-dots-vertical" size="16" />
              </v-btn>
            </template>

            <v-list
              class="bg-surface-container-high text-on-surface"
              rounded="xl"
            >
              <v-list-item
                append-icon="mdi-pencil-outline"
                :title="$t('common.whinny.actions.delete.title')"
                @click="deleteWhinny"
              />
            </v-list>
          </v-menu>
        </div>
      </div>
    </template>

    <template v-if="detail" #detail>
      <v-divider class="my-2" />
      <div class="d-flex flex-wrap">
        <v-chip
          v-if="whinny.countReactions"
          variant="outlined"
          rounded="lg"
          class="my-1 mr-2"
          @click="() => undefined"
        >
          <template #prepend>
            <v-icon
              :icon="whinny.hasReaction ? 'mdi-heart' : 'mdi-heart-outline'"
              start
              color="primary"
            />
          </template>
          {{
            $t(
              'common.whinny.actions.reactions.subtitle',
              {
                count: whinny.countReactions,
              },
              whinny.countReactions,
            )
          }}
        </v-chip>
        <v-chip
          v-if="whinny.countComments"
          variant="outlined"
          rounded="lg"
          class="my-1 mr-2"
          @click="() => undefined"
        >
          <template #prepend>
            <v-icon icon="mdi-chat-outline" start color="primary" />
          </template>
          {{
            $t(
              'common.whinny.actions.comments.subtitle',
              {
                count: whinny.countComments,
              },
              whinny.countComments,
            )
          }}
        </v-chip>
        <v-chip
          v-if="whinny.countQuotes"
          variant="outlined"
          rounded="lg"
          class="my-1 mr-2"
          @click="() => undefined"
        >
          <template #prepend>
            <v-icon icon="mdi-repeat-variant" start color="primary" />
          </template>
          {{
            $t(
              'common.whinny.actions.quotes.subtitle',
              {
                count: whinny.countQuotes,
              },
              whinny.countQuotes,
            )
          }}
        </v-chip>
        <v-chip
          variant="outlined"
          rounded="lg"
          class="my-1 mr-2"
          @click="() => undefined"
        >
          <template #prepend>
            <v-icon icon="mdi-calendar-clock-outline" start color="primary" />
          </template>
          <use-time-ago v-slot="{ timeAgo }" :time="whinny.publishDate">
            {{ timeAgo }}
          </use-time-ago>
        </v-chip>
      </div>
      <v-divider class="my-2" />
    </template>

    <template #action>
      <v-whinny-content-action
        :icon="whinny.hasReaction ? 'mdi-heart' : 'mdi-heart-outline'"
        :color="whinny.hasReaction ? 'info' : 'primary'"
        :value="detail ? undefined : whinny.countReactions"
        @click="reactWhinny"
      />
      <v-whinny-content-action
        icon="mdi-chat-outline"
        :value="detail ? undefined : whinny.countComments"
        @click="openModalComposeWhinny('Comment')"
      />
      <v-base-bottom-sheet>
        <template #activator="{ props }">
          <v-whinny-content-action
            icon="mdi-repeat-variant"
            :color="whinny.repostUrlId ? 'info' : 'primary'"
            :value="detail ? undefined : whinny.countQuotes"
            v-bind="props"
          />
        </template>

        <v-list>
          <v-list-item prepend-icon="mdi-repeat-variant" @click="repostWhinny">
            <template #title>{{ $t('common.share.repost') }}</template>
          </v-list-item>
          <v-list-item
            prepend-icon="mdi-pen"
            @click="openModalComposeWhinny('Quote')"
          >
            <template #title>{{ $t('common.share.quote') }}</template>
          </v-list-item>
        </v-list>
      </v-base-bottom-sheet>
      <v-base-bottom-sheet>
        <template #activator="{ props }">
          <v-whinny-content-action icon="mdi-share-outline" v-bind="props" />
        </template>

        <v-list>
          <v-list-item prepend-icon="mdi-link-variant" @click="copyLink">
            <template #title>{{ $t('common.share.copyLink') }}</template>
          </v-list-item>
          <v-list-item prepend-icon="mdi-tray-arrow-up" @click="sharePost">
            <template #title>{{ $t('common.share.shareVia') }}</template>
          </v-list-item>
        </v-list>
      </v-base-bottom-sheet>
    </template>

    <template #default>
      {{ isRepost ? whinny.source.content : whinny.content }}
    </template>
  </v-whinny-wrapper>
</template>

<script lang="ts" setup>
import { UseTimeAgo } from '@vueuse/components';
import _ from 'lodash';
import { computed, reactive } from 'vue';
import { useRouter } from 'vue-router';

import VWhinnyContentAction from '@/components/Whinnies/WhinnyContentAction.vue';
import VWhinnyWrapper from '@/components/Whinnies/WhinnyWrapper.vue';
import {
  useAlert,
  useAuth,
  useAxios,
  useLayoutLocale,
  useRouterModal,
  useSnackbar,
  useUserImage,
} from '@/composables';
import { IWhinnyResponse } from '@/interfaces';
import { services } from '@/services';

const props = defineProps<{
  data: IWhinnyResponse;
  detail?: boolean;
}>();

const whinny = reactive(props.data);

const { identityId } = useAuth();
const router = useRouter();

const isRepost = computed(() => whinny.type === 'Repost');
const user = computed(() => {
  if (isRepost.value) {
    return whinny.source.user!;
  }

  return whinny.user;
});
const photoUrl = useUserImage('photo', user);

function gotoUser() {
  router.push({
    name: 'Users:Detail',
    params: {
      username: user.value.username,
    },
  });
}

function gotoStatus() {
  if (props.detail) {
    return;
  }

  router.push({
    name: 'Users:Status',
    params: isRepost.value
      ? {
          urlId: whinny.source.urlId,
          username: whinny.source.user!.username,
        }
      : {
          urlId: whinny.urlId,
          username: whinny.user.username,
        },
  });
}

const { openModal } = useRouterModal();
function openModalComposeWhinny(type: 'Comment' | 'Quote') {
  const data = isRepost.value ? whinny.source : whinny;
  openModal(
    { name: 'Compose:Whinny' },
    {
      type,
      whinny: {
        ..._.pick(data, [
          'id',
          'urlId',
          'type',
          'content',
          'publishDate',
          'createdAt',
          'updatedAt',
        ]),
        user: {
          ..._.pick(data?.user, ['id', 'username', 'displayName', 'photoUrl']),
        },
      },
    },
  );
}

const { t } = useLayoutLocale({ prefix: '' });

const { createSnackbarNormal } = useSnackbar();
const alert = useAlert();

const { excute: requestDeleteWhinny } = useAxios(services.whinnies, 'delete');

async function deleteWhinny() {
  const { isConfirm } = await alert.fire({
    cancelButton: {
      show: true,
      text: t('common.whinny.actions.delete.alert.cancel'),
    },
    confirmButton: {
      show: true,
      text: t('common.whinny.actions.delete.alert.confirm'),
    },
    message: t('common.whinny.actions.delete.alert.message'),
  });

  if (!isConfirm) {
    return;
  }

  await requestDeleteWhinny({ urlId: whinny.urlId });
}

const { excute: requestReactWhinny } = useAxios(services.whinnies, 'react', {
  displayMessageFromException: false,
});

async function reactWhinny() {
  const urlId = isRepost.value ? whinny.source!.urlId : whinny!.urlId;

  try {
    await requestReactWhinny({
      urlId,
      kind: whinny.hasReaction ? 'None' : 'Favorite',
    });
  } finally {
    whinny.hasReaction = !whinny.hasReaction;
    if (whinny.hasReaction) {
      whinny.countReactions += 1;
    } else {
      whinny.countReactions -= 1;
    }
  }
}

const { excute: requestCreateWhinny } = useAxios(services.whinnies, 'create');

async function repostWhinny() {
  const sourceId = isRepost.value ? whinny.source!.id : whinny!.id;

  if (whinny.repostUrlId) {
    await requestDeleteWhinny({
      urlId: whinny.repostUrlId,
    });
    whinny.repostUrlId = null;
    whinny.countQuotes -= 1;
  } else {
    const repost = await requestCreateWhinny({
      type: 'Repost',
      sourceId,
    });

    whinny.repostUrlId = repost.urlId;
    whinny.countQuotes += 1;
  }
}

async function getLink() {
  const route = await router.resolve({
    name: 'Users:Status',
    params: isRepost.value
      ? {
          urlId: whinny.source.urlId,
          username: whinny.source.user!.username,
        }
      : {
          urlId: whinny.urlId,
          username: whinny.user.username,
        },
  });

  return `${window.location.host}${route.fullPath}`;
}

async function copyLink() {
  // @ts-ignore
  const result = await navigator.permissions.query({ name: 'clipboard-write' });
  if (result.state !== 'granted' && result.state !== 'prompt') {
    createSnackbarNormal(t('common.share.copyLinkFailed'));
    return;
  }

  const link = await getLink();
  await navigator.clipboard.writeText(link);
  createSnackbarNormal(t('common.share.copyLinkSuccessfully'));
}

async function sharePost() {
  const link = await getLink();

  const shareData = {
    title: user.value.displayName,
    text: (isRepost.value ? whinny.source.content : whinny.content) ?? '',
    url: link,
  };

  try {
    await navigator.share(shareData);
  } catch (error) {
    console.error(error);
    createSnackbarNormal(t('common.share.unsupported'));
  }
}
</script>

<style lang="scss" scoped>
.v-text-decoration-underline:hover {
  text-decoration: underline;
}
</style>
