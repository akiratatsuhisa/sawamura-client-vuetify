<template>
  <v-list>
    <v-relationship-list-item
      v-for="item in items"
      :key="item.id"
      :item="item"
    />
    <v-list-item v-if="!isAllLoaded" v-intersect="onIntersect">
      <v-btn :loading="isLoading" variant="plain" block @click="fetchMore">
        {{ $t('pages.users.relationships.fetchMore') }}
      </v-btn>
    </v-list-item>
  </v-list>
</template>

<script lang="ts" setup>
import _ from 'lodash';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

import { useAxios, useFetchIntersection } from '@/composables';
import {
  IProfileUserRelationshipResponse,
  ProfileUserRelationshipType,
} from '@/interfaces';
import { services } from '@/services';
import VRelationshipListItem from '@/views/Users/components/RelationshipListItem.vue';

const props = defineProps<{ type: ProfileUserRelationshipType }>();

const route = useRoute();

const isAllLoaded = ref<boolean>(false);
const items = ref<Array<IProfileUserRelationshipResponse>>([]);

const { excute, isLoading } = useAxios(
  services.profileUsers,
  'searchRelationships',
);

async function fetchMore() {
  const cursor = _.last(items.value)?.id;
  const data = await excute({
    username: route.params.username as string,
    type: props.type,
    take: 10,
    cursor,
  });

  if (!data.length) {
    isAllLoaded.value = true;
  }

  items.value = _.uniqBy(
    [...items.value, ...data],
    (relationship) => relationship.user.id,
  );
}

fetchMore();

const { onIntersect } = useFetchIntersection({
  fetch: fetchMore,
  ms: 500,
  isLoading,
  isAllLoaded,
});
</script>
