<template>
  <v-menu>
    <template #activator="{ props, isActive }">
      <v-chip
        :prepend-icon="hasSelected ? filterIcon ?? 'mdi-check' : icon"
        rounded="lg"
        variant="outlined"
        class="v-chip--menu my-1 mr-2"
        :class="{ 'v-chip--selected': !!hasSelected }"
        :append-icon="isActive ? 'mdi-menu-up' : 'mdi-menu-down'"
        v-bind="{ ...attrs, ...props }"
      >
        <slot name="content" :selected="model">
          <template v-if="hasSelected">
            <span>
              {{
                displaySelectedItem.translate
                  ? $t(displaySelectedItem.translate)
                  : displaySelectedItem.title
              }}
            </span>
            <v-badge
              v-if="multiple && model.length > 1"
              color="secondary"
              :content="`+${model.length - 1}`"
              inline
            />
          </template>
          <slot v-else name="label">{{ label }}</slot>
        </slot>
      </v-chip>
    </template>
    <slot>
      <v-list class="bg-surface-container-high bg-on-surface" density="compact">
        <template v-for="(item, index) in items" :key="index">
          <slot
            name="item"
            :item="item"
            :is-active="isActive(item.value)"
            :select-item="selectItem"
          >
            <v-list-item
              :prepend-icon="item.icon"
              :value="item.value"
              :class="{ 'v-list-item--active': isActive(item.value) }"
              @click="selectItem(item.value)"
            >
              <v-list-item-title>
                {{ item.translate ? $t(item.translate) : item.title }}
              </v-list-item-title>
            </v-list-item>
          </slot>
        </template>
      </v-list>
    </slot>
  </v-menu>
</template>

<script lang="ts" setup>
import _ from 'lodash';
import { computed, useAttrs } from 'vue';

interface IItem {
  icon?: string;
  value: any;
  title?: string;
  translate?: string;
}

defineOptions({ inheritAttrs: false });

const attrs = useAttrs();

const props = defineProps<{
  modelValue?: any;
  mandatory?: boolean;
  multiple?: boolean;
  label?: string;
  icon?: string;
  filterIcon?: string;
  items?: Array<IItem>;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', payload: any): void;
}>();

defineSlots<{
  default(): any;
  content(props: { selected: any }): any;
  label(): any;
  item(props: {
    item: IItem;
    isActive: boolean;
    selectItem(value: any): void;
  }): any;
}>();

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

function isActive(value: any) {
  return props.multiple && _.isArray(model.value)
    ? _.some(model.value, (o) => _.isEqual(o, value))
    : _.isEqual(model.value, value);
}

function selectItem(value: any) {
  if (props.multiple && _.isArray(model.value)) {
    if (_.some(model.value, (o) => _.isEqual(o, value))) {
      model.value = _.filter(model.value, (o) => !_.isEqual(o, value));
    } else {
      model.value.push(value);
    }
  } else if (_.isEqual(model.value, value)) {
    model.value = undefined;
  } else {
    model.value = value;
  }
}

const hasSelected = computed(() =>
  props.multiple && _.isArray(model.value)
    ? model.value.length
    : !_.isNil(model.value),
);

const displaySelectedItem = computed(
  () =>
    _.find(props.items, (o) =>
      _.isEqual(
        o.value,
        props.multiple && _.isArray(model.value)
          ? _.first(model.value)
          : model.value,
      ),
    )!,
);
</script>

<style lang="scss">
.v-chip.v-chip--menu {
  .v-chip__content {
    flex-grow: 1;
  }
}
</style>
