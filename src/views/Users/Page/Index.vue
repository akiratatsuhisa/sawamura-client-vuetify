<template>
  <v-main>
    <v-container v-if="!data" class="fill-height">
      <v-responsive>
        <div class="h-100 w-100 d-flex justify-center align-center">
          <v-progress-circular
            size="88"
            width="6"
            color="primary"
            indeterminate
          />
        </div>
      </v-responsive>
    </v-container>
    <v-container v-else>
      <v-row>
        <v-col cols="12" xl="8" class="mx-auto">
          <v-source v-if="user?.username === data?.username" />
          <v-target v-else />
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
import { provide, Ref, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { useAuth, useAxios } from '@/composables';
import { KEYS } from '@/constants';
import { IProfileUserResponse } from '@/interfaces';
import { services } from '@/services';
import VSource from '@/views/Users/Page/Source.vue';
import VTarget from '@/views/Users/Page/Target.vue';

const route = useRoute();
const { user } = useAuth();

const { excute, data, headers } = useAxios(
  services.users,
  'searchProfileByUsername',
);

const hasFollowing = ref<boolean>(false);

watch(
  () => route.params.username as string,
  async (username) => {
    if (!username) {
      return;
    }
    await excute({ username });
    hasFollowing.value = headers.value.get('Has-Following') === 'true';
  },
  { immediate: true },
);

provide(KEYS.USERS.PAGE.PROFILE_USER, data as Ref<IProfileUserResponse>);
provide(KEYS.USERS.PAGE.HAS_FOLLOWING, hasFollowing);
</script>
