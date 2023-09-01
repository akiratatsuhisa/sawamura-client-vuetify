<template>
  <v-list-item
    :key="item.key"
    :value="item.value"
    class="v-list-item--rail pa-0 ma-0 mb-3 rounded-0"
    variant="text"
    :ripple="false"
    :active="isActived"
  >
    <div class="d-flex justify-center flex-column text-center">
      <div class="d-flex justify-center my-1">
        <div
          v-ripple="true"
          class="v-list-item--rail-icon d-flex justify-center align-center px-4 py-1 rounded-pill"
          :class="{ 'bg-secondary-container': isActived }"
        >
          <v-icon :icon="item.icon" size="24" color="on-surface-variant" />
        </div>
      </div>

      <span
        class="v-list-item--rail--text text-on-surface-variant"
        :class="{ 'font-weight-medium': isActived }"
      >
        {{ translate(item.translate!) }}
      </span>
    </div>
  </v-list-item>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue';

import { useLayoutLocale } from '@/composables';
import { KEYS } from '@/constants';
import { IRailMenuItem } from '@/interfaces';

const props = defineProps<{ item: IRailMenuItem }>();

const isActive = inject(KEYS.DRAWER.IS_ACTIVE)!;
const isActived = computed(() => isActive(props.item.value, true));

const { translate } = useLayoutLocale({
  prefix: 'default.sidebar',
});
</script>

<style lang="scss">
.v-list-item--rail {
  & .v-list-item__overlay,
  & .v-list-item__underlay {
    display: none;
  }

  & .v-list-item--rail-icon {
    &:hover {
      background-color: rgba(var(--v-theme-on-surface), 0.1);
    }

    transition: background-color 0.2s ease-out;
  }

  & .v-list-item--rail--text {
    font-size: 12px;
    line-height: 16px;
  }
}

.v-list-item--drawer {
  & .v-list-item__overlay,
  & .v-list-item__underlay {
    display: none;
  }
}
</style>
