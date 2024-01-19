<template>
  <v-list-item
    class="pa-0"
    :to="{
      name: 'Users:Detail',
      params: {
        username: item.user.username,
      },
    }"
  >
    <div class="d-flex align-center pa-2 px-md-4">
      <v-avatar
        :image="photoUrl"
        color="secondary-container"
        class="flex-grow-0 flex-shrink-0 mr-2"
      />

      <div class="flex-grow-1 flex-shrink-1">
        <v-list-item-title>
          {{ item.user.displayName }}
        </v-list-item-title>
        <v-list-item-subtitle>@{{ item.user.username }}</v-list-item-subtitle>
      </div>

      <v-btn
        v-if="state !== 'none'"
        :variant="state === 'following' ? 'outlined' : 'flat'"
        :loading="isLoading"
        class="flex-grow-0 flex-shrink-0 ml-2"
        @click.prevent="onChangeRelationship"
      >
        {{
          $t(
            `common.user.relationshipStates.${
              state === 'following' ? 'following' : 'follow'
            }`,
          )
        }}
      </v-btn>
    </div>

    <div v-if="item.user.biography" class="px-2 pb-2 px-md-4">
      <p class="text-body pl-11">
        {{ item.user.biography }}
      </p>
    </div>
  </v-list-item>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import { useAxios, useUserImage } from '@/composables';
import {
  IProfileUserRelationshipResponse,
  ProfileUserRelationshipState,
} from '@/interfaces';
import { services } from '@/services';

const props = defineProps<{ item: IProfileUserRelationshipResponse }>();

const photoUrl = useUserImage(
  'photo',
  computed(() => props.item.user),
);

const { request: reuqestChangeRelationship, isLoading } = useAxios(
  services.profileUsers,
  'changeRelationship',
  {
    displayMessageFromException: false,
  },
);

const state = ref<'none' | 'following' | 'noFollow'>(props.item.state as any);

async function onChangeRelationship() {
  const username = props.item.user.username;
  if (state.value === 'none') {
    return;
  }

  await reuqestChangeRelationship({
    username,
    relationshipState:
      state.value === 'following'
        ? ProfileUserRelationshipState.Unfollow
        : ProfileUserRelationshipState.Follow,
  });

  if (username === props.item.user.username) {
    state.value = state.value === 'following' ? 'noFollow' : 'following';
  }
}
</script>
