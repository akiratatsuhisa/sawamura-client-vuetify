<template>
  <v-tooltip :text="name" location="top center">
    <template #activator="{ props }">
      <v-avatar
        color="secondary-container"
        class="avatar"
        :image="photoUrl"
        v-bind="props"
        size="20"
      ></v-avatar>
    </template>
  </v-tooltip>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { useUserImage } from '@/composables';
import { IRoomUserResponse } from '@/interfaces';

const props = defineProps<{ name: string; member: IRoomUserResponse }>();

const photoUrl = useUserImage(
  'photo',
  computed(() => props.member),
);
</script>

<style lang="scss" scoped>
.avatar:not(:first-child) {
  margin-left: -8px;
}
</style>
