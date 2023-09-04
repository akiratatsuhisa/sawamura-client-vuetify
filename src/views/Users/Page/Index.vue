<template>
  <v-main>
    <v-container v-if="!data" class="fill-height">
      <div class="h-100 w-100 d-flex justify-center align-center">
        <v-progress-circular
          size="88"
          width="6"
          color="primary"
          indeterminate
        />
      </div>
    </v-container>
    <v-container v-else>
      <v-row>
        <v-col cols="12" xl="8" class="mx-auto">
          <v-source v-if="user?.username === data?.username" :user="data" />
          <v-target v-else :user="data" />
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
import { useAuth, useAxios } from '@/composables';
import { services } from '@/services';
import VSource from '@/views/Users/Page/Source.vue';
import VTarget from '@/views/Users/Page/Target.vue';

const { user } = useAuth();

const { data } = useAxios(services.users, 'searchByUsername', {
  immediate: true,
  paramsOrData: { username: 'dat' },
});
</script>
