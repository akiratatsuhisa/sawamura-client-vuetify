<template>
  <v-rail-navigation v-if="$vuetify.display.smAndUp">
    <template #fab>
      <v-fade-transition>
        <v-btn
          v-if="$vuetify.display.mdAndUp && isFabShow"
          variant="flat"
          color="primary-container"
          min-width="56"
          min-height="56"
          class="v-btn--fab ma-3"
          @click="openDialog('create')"
        >
          <v-icon>mdi-account-group</v-icon>
        </v-btn>
      </v-fade-transition>
    </template>
  </v-rail-navigation>
</template>

<script lang="ts" setup>
import { useRouterDialog, useScrollBehavior } from '@/composables';
import VRailNavigation from '@/layouts/Default/components/RailNavigation.vue';

const { openDialog } = useRouterDialog({
  name: 'Messages',
  param: 'dialog',
});

const { isFabShow } = useScrollBehavior();
</script>

<style lang="scss" scoped>
.v-btn--fab {
  border-radius: 16px !important;
}
</style>
