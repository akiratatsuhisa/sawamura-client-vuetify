<template>
  <v-btn
    v-show="isFabShow"
    :color="color"
    class="v-btn--fab ma-3"
    :min-width="isFabShowDetail ? undefined : size"
    :min-height="size"
    :elevation="screenFab ? 2 : 0"
    :position="screenFab ? 'fixed' : undefined"
    :location="screenFab ? 'bottom right' : undefined"
  >
    <v-slide-x-reverse-transition>
      <v-icon :start="isFabShowDetail" :icon="icon" />
    </v-slide-x-reverse-transition>

    <v-slide-x-transition>
      <span v-if="isFabShowDetail">
        {{ title }}
      </span>
    </v-slide-x-transition>
  </v-btn>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    color?: string;
    icon: string;
    title?: string;
    isFabShow: boolean;
    isFabShowDetail?: boolean;
    size?: number | string;
    screenFab?: boolean;
  }>(),
  {
    color: 'primary-container',
    isFabShowDetail: false,
    size: 56,
    screenFab: true,
  },
);
</script>

<style lang="scss" scoped>
.v-btn--fab {
  border-radius: 16px !important;
}
</style>
