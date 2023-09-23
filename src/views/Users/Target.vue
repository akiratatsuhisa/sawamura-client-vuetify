<template>
  <v-display-profile>
    <template #actions>
      <v-btn size="36" variant="tonal" icon="mdi-dots-vertical" />
      <v-btn
        size="36"
        variant="tonal"
        icon="mdi-message-text"
        :loading="isLoadingPrivateChat"
        @click="openPrivateChat"
      />
      <v-spacer></v-spacer>
      <v-hover #default="{ isHovering, props }">
        <v-btn
          height="36"
          :variant="
            (hasFollowing && isHovering) || (!hasFollowing && !isHovering)
              ? 'flat'
              : 'outlined'
          "
          :color="isHovering && hasFollowing ? 'error' : 'primary'"
          :loading="isLoadingChangeRelationship"
          @click="onChangeRelationship"
          v-bind="props"
        >
          <template v-if="hasFollowing">
            {{
              $t(
                `common.user.relationshipStates.${
                  isHovering ? 'unfollow' : 'following'
                }`,
              )
            }}
          </template>
          <template v-else>
            {{
              $t(
                `common.user.relationshipStates.${
                  isHovering ? 'following' : 'follow'
                }`,
              )
            }}
          </template>
        </v-btn>
      </v-hover>
    </template>
  </v-display-profile>
</template>

<script lang="ts" setup>
import { useStyleTag } from '@vueuse/core';
import { computed, inject } from 'vue';
import { useRouter } from 'vue-router';

import { useAxios, useSocketChat, useSocketEventListener } from '@/composables';
import { KEYS } from '@/constants';
import {
  IRoomPrivateRequest,
  IRoomResponse,
  ProfileUserRelationshipState,
} from '@/interfaces';
import { services } from '@/services';
import VDisplayProfile from '@/views/Users/components/DisplayProfile.vue';

const profileUser = inject(KEYS.USERS.PAGE.PROFILE_USER)!;
const hasFollowing = inject(KEYS.USERS.PAGE.HAS_FOLLOWING)!;

const {
  excute: reuqestChangeRelationship,
  isLoading: isLoadingChangeRelationship,
} = useAxios(services.profileUsers, 'changeRelationship', {
  displayMessageFromException: false,
});

async function onChangeRelationship() {
  const username = profileUser.value.username;

  await reuqestChangeRelationship({
    username,
    relationshipState: hasFollowing.value
      ? ProfileUserRelationshipState.Unfollow
      : ProfileUserRelationshipState.Follow,
  });

  if (username === profileUser.value.username) {
    hasFollowing.value = !hasFollowing.value;
  }
}

const router = useRouter();
const socket = useSocketChat();

const { request: requestPrivateChat, isLoading: isLoadingPrivateChat } =
  useSocketEventListener<IRoomResponse, IRoomPrivateRequest>(
    socket,
    'read:room:private',
    {
      response(data) {
        router.push({ name: 'Messages:Room', params: { roomId: data.id } });
      },
    },
  );

async function openPrivateChat() {
  await requestPrivateChat({ otherUserId: profileUser.value.id });
}

useStyleTag(
  computed(() => profileUser.value?.themeStyle ?? ''),
  { id: 'vuetify-profile-style' },
);
</script>
