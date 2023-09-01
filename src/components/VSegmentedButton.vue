<template>
  <v-btn-toggle
    v-model="model"
    :class="{ 'd-flex': block }"
    variant="outlined"
    divided
    :mandatory="mandatory"
    :multiple="multiple"
  >
    <slot>
      <template v-for="(item, index) in items" :key="index">
        <slot name="item" :item="item" :is-active="isActive(item.value)">
          <v-btn
            :class="{ 'flex-grow-1 flex-shrink-1': block }"
            :value="item.value"
            :prepend-icon="isActive(item.value) ? 'mdi-check' : item.icon"
          >
            {{ item.translate ? $t(item.translate) : item.title }}
          </v-btn>
        </slot>
      </template>
    </slot>
  </v-btn-toggle>
</template>

<script lang="ts" setup>
import _ from 'lodash';
import { computed } from 'vue';

const props = defineProps<{
  modelValue?: any;
  mandatory?: boolean;
  multiple?: boolean;
  block?: boolean;
  items?: Array<{
    icon?: string;
    value: any;
    title?: string;
    translate?: string;
  }>;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', payload: any): void;
}>();

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

function isActive(value: any) {
  return props.multiple && _.isArray(model.value)
    ? _.some(model.value, (o) => o === value)
    : model.value === value;
}
</script>
