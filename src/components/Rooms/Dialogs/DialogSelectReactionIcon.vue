<template>
  <base-dialog
    mobile-width="500"
    :model-value="modelValue"
    :disabled-submit="!submitable"
    @update:model-value="emit('update:modelValue', $event)"
    @submit="onSubmit"
    @open="onOpen"
  >
    <template #title>
      <div class="d-flex justify-space-between mr-3">
        <span>Reaction icon {{ form.value }}</span>
        <v-btn v-if="form.value" size="small" @click="v$.value.$model = ''"
          >Remove</v-btn
        >
      </div>
    </template>

    <emoji-picker
      :data="emojiIndex"
      set="twitter"
      class="w-100"
      :class="{ 'h-100': $vuetify.display.smAndDown }"
      @select="selectEmoji"
      :style="{
        right: $vuetify.display.mdAndUp ? '3.5rem' : '0',
        bottom: '0',
      }"
    />

    <template #action>Select</template>
  </base-dialog>
</template>

<script lang="ts" setup>
import data from 'emoji-mart-vue-fast/data/twitter.json';
// @ts-ignore
import { EmojiIndex, Picker as EmojiPicker } from 'emoji-mart-vue-fast/src';
import { reactive } from 'vue';

import { useVuelidate } from '@/composables/useVuelidate';

interface IReactionIconForm {
  value: string;
}

const emojiIndex = new EmojiIndex(data);

const props = defineProps<{
  modelValue: boolean;
  value: IReactionIconForm['value'];
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'submit', value: IReactionIconForm): void;
}>();

const form = reactive<IReactionIconForm>({
  value: '',
});

const [v$, { handleSubmit, submitable }] = useVuelidate<IReactionIconForm>(
  {
    value: {},
  },
  form,
);

async function selectEmoji(params: { native: string }) {
  v$.value.value.$model = params.native;
}

const onSubmit = handleSubmit((data) => {
  emit('submit', data);
  emit('update:modelValue', false);
});

function onOpen() {
  form.value = props.value;
  v$.value.$reset();
}
</script>
