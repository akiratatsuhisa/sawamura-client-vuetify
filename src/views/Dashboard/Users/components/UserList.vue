<template>
  <v-card-text
    v-if="!data || !data.records.length"
    class="text-center text-subtitle-1 py-6"
  >
    {{ $t('common.data.noRecord') }}
  </v-card-text>
  <div v-else class="pt-2 pb-4 px-2">
    <v-user-list-item
      v-for="record in data.records"
      :key="record.id"
      :record="record"
    />
  </div>
</template>

<script lang="ts" setup>
import { IUserResponse } from '@/interfaces';
import VUserListItem from '@/views/Dashboard/Users/components/UserListItem.vue';

defineProps<{
  data?: {
    count: number;
    totalCount: number;
    records: Array<IUserResponse>;
  };
}>();
</script>
