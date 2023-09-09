<template>
  <v-btn
    :value="item.value"
    :ripple="false"
    :active="isActived"
    class="v-btn--bottom mx-2"
    :to="{ name: item.value.name }"
  >
    <div class="d-flex justify-center flex-column text-center">
      <div class="d-flex justify-center my-1">
        <div
          v-ripple="true"
          class="v-btn--bottom-icon d-flex justify-center align-center px-5 py-1 rounded-pill"
          :class="{ 'bg-secondary-container': isActived }"
        >
          <v-icon :icon="item.icon" size="24" color="on-surface-variant" />
        </div>
      </div>

      <span
        class="v-btn--bottom--text text-on-surface-variant"
        :class="[isActived ? 'font-weight-medium' : 'font-weight-regular']"
      >
        {{ translate(item.translate!) }}
      </span>
    </div>
  </v-btn>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { useLayoutLocale } from '@/composables';
import { INavigationMenuItem } from '@/interfaces';
import { useAppStore } from '@/store';

const props = defineProps<{ item: INavigationMenuItem }>();

const { isNavigationActive } = useAppStore();

const isActived = computed(() => isNavigationActive(props.item.value, true));

const { translate } = useLayoutLocale({
  prefix: 'default.navigations',
});
</script>

<style lang="scss">
.v-btn--bottom {
  & .v-btn__overlay,
  & .v-btn__underlay {
    display: none;
  }

  padding: 0 !important;

  & .v-btn--bottom-icon {
    &:hover {
      background-color: rgba(var(--v-theme-on-surface), 0.1);
    }

    transition: background-color 0.2s ease-out;
  }

  & .v-btn--bottom--text {
    font-size: 12px;
    line-height: 16px;
  }
}
</style>
