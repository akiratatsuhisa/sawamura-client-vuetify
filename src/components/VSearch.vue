<template>
  <div
    class="position-relative"
    :class="[offsetX ? `px-${offsetX}` : '', offsetY ? `py-${offsetY}` : '']"
  >
    <div
      class="v-search text-on-surface d-flex flex-row align-center cursor-pointer rounded-pill"
      :class="[`v-search-${density}`, `bg-${fieldBgColor}`]"
      @click.stop="model = !model"
    >
      <slot name="prepend-icon">
        <template v-if="prependIcon">
          <v-icon class="ml-2" :icon="prependIcon" />
        </template>
      </slot>

      <div class="px-2 flex-grow-1">
        <input
          v-model="search"
          class="v-search-input"
          type="text"
          :readonly="readonly"
          spellcheck="false"
          :placeholder="placeholder"
        />
      </div>
      <v-icon
        v-if="!readonly && searchClearable"
        class="mr-2"
        icon="mdi-close"
        @click="search = ''"
      />
      <slot name="append-icon">
        <template v-if="appendIcon">
          <v-icon class="mr-2" :icon="appendIcon" />
        </template>
      </slot>
    </div>

    <v-slide-y-transition v-if="dropdown">
      <div
        v-if="model"
        ref="searchFieldContainerRef"
        class="position-absolute v-search-container d-flex flex-column elevation-1 rounded-xl"
        :class="[
          offsetX ? `mx-${offsetX}` : '',
          offsetY ? `my-${offsetY}` : '',
          `bg-${dropdownBgColor}`,
        ]"
      >
        <div
          class="position-relative v-search flex-shrink-0 text-on-surface d-flex flex-row align-center cursor-pointer rounded-pill rounded-b-0"
          :class="[`v-search-${density}`, `bg-${dropdownBgColor}`]"
        >
          <v-icon class="ml-2" icon="mdi-arrow-left" @click="model = !model" />
          <div class="px-2 flex-grow-1">
            <input
              v-model="search"
              ref="searchFieldRef"
              class="v-search-input"
              type="text"
              spellcheck="false"
              :placeholder="placeholder"
            />
          </div>
          <v-icon
            v-if="searchClearable"
            class="mr-2"
            icon="mdi-close"
            @click="search = ''"
          />
          <v-icon class="mr-2" icon="mdi-magnify" @click="emit('submit')" />
          <v-progress-linear
            v-if="loading"
            absolute
            location="bottom"
            color="primary"
            indeterminate
          />
        </div>
        <v-divider />

        <div class="overflow-y-auto flex-grow-1">
          <slot></slot>
        </div>

        <div class="py-2 flex-shrink-0"></div>
      </div>
    </v-slide-y-transition>

    <v-dialog
      v-if="dialog"
      :model-value="model"
      fullscreen
      transition="slide-y-transition"
    >
      <v-card
        rounded="none"
        class="text-on-surface"
        :class="[`bg-${dialogBgColor}`]"
      >
        <v-toolbar class="text-on-surface" :class="[`bg-${dialogBgColor}`]">
          <v-input
            class="px-3"
            hide-details
            prepend-icon="mdi-arrow-left"
            @click:prepend="model = !model"
            :append-icon="searchClearable ? 'mdi-close' : undefined"
            @click:append="search = ''"
          >
            <input
              v-model="search"
              ref="searchFieldRef"
              class="v-search-input"
              type="text"
              spellcheck="false"
              :placeholder="placeholder"
            />
          </v-input>

          <v-progress-linear
            v-if="loading"
            absolute
            location="bottom"
            color="primary"
            indeterminate
          />
        </v-toolbar>
        <v-divider />

        <div class="overflow-y-auto">
          <slot></slot>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core';
import _ from 'lodash';
import { computed, ref, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue?: boolean;
    loading?: boolean;
    placeholder?: string;
    search?: string;
    prependIcon?: string;
    appendIcon?: string;
    offsetX?: string | number;
    offsetY?: string | number;
    dropdown?: boolean;
    dialog?: boolean;
    readonly?: boolean;
    density?: 'compact' | 'default';
    clearable?: boolean;
    fieldBgColor?: string;
    dropdownBgColor?: string;
    dialogBgColor?: string;
  }>(),
  {
    appendIcon: 'mdi-magnify',
    offsetX: 3,
    offsetY: 3,
    dropdown: false,
    dialog: false,
    readonly: true,
    density: 'default',
    clearable: true,
    fieldBgColor: 'surface-container-high',
    dropdownBgColor: 'surface-container-high',
    dialogBgColor: 'surface-container-high',
  },
);

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'update:search', value: string): void;
  (event: 'submit'): void;
}>();

defineSlots<{ default(): any; 'prepend-icon'(): any; 'append-icon'(): any }>();

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const search = computed<string>({
  get: () => props.search ?? '',
  set: (value: string) => emit('update:search', value),
});

const searchClearable = computed(
  () => props.clearable && !!_.trim(search.value).length,
);

const searchFieldContainerRef = ref<HTMLDivElement>();
const searchFieldRef = ref<HTMLInputElement>();

watch([model, searchFieldRef], ([isOpened, searchFieldRef]) => {
  if (!searchFieldRef) {
    return;
  }

  if (isOpened) {
    searchFieldRef.focus();
  }
});

onClickOutside(searchFieldContainerRef, () => (model.value = !model.value));
</script>

<style lang="scss" scoped>
.v-search-default {
  height: 56px;
}

.v-search-compact {
  height: 48px;
}

.v-search-input {
  width: 100%;
  outline: none;
  color: rgb(var(--v-theme-on-surface));
}

.v-search-container {
  top: 0;
  left: 0;
  right: 0;
  min-height: 300px;
  max-height: 450px;
  z-index: 100;
}
</style>
