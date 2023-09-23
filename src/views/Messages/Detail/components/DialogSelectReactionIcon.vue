<template>
  <v-base-dialog
    desktop-width="500"
    :model-value="modelValue"
    :disabled-submit="!submitable"
    @update:model-value="emit('update:modelValue', $event)"
    @submit="onSubmit"
    @open="onOpen"
  >
    <template #title>
      <div class="d-flex justify-space-between mr-3">
        <span>{{ translate('title') }} {{ form.value }}</span>
        <v-btn
          v-if="form.value"
          color="primary"
          variant="tonal"
          size="small"
          @click="v$.value.$model = ''"
        >
          {{ translate('clear') }}
        </v-btn>
      </div>
    </template>

    <emoji-picker
      :data="emojiIndex"
      set="twitter"
      class="w-100 rounded-xl"
      :class="{ 'h-100': $vuetify.display.smAndDown }"
      @select="selectEmoji"
      :style="{
        right: $vuetify.display.mdAndUp ? '3.5rem' : '0',
        bottom: '0',
      }"
    />

    <template #action>{{ translate('form.submit') }}</template>
  </v-base-dialog>
</template>

<script lang="ts" setup>
import data from 'emoji-mart-vue-fast/data/twitter.json';
// @ts-ignore
import { EmojiIndex, Picker as EmojiPicker } from 'emoji-mart-vue-fast/src';
import { inject, reactive } from 'vue';

import { usePageLocale, useVuelidate } from '@/composables';
import { KEYS } from '@/constants';

interface IReactionIconForm {
  value: string;
}

defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'submit', value: IReactionIconForm): void;
}>();

const { translate } = usePageLocale({
  prefix: 'messages.room.dialogs.reactionIcon',
});

const reactionIcon = inject(KEYS.CHAT.REACTION_ICON)!;

const form = reactive<IReactionIconForm>({
  value: '',
});

const [v$, { handleSubmit, submitable }] = useVuelidate<IReactionIconForm>(
  {
    value: {},
  },
  form,
);

const emojiIndex = new EmojiIndex(data);

async function selectEmoji(params: { native: string }) {
  v$.value.value.$model = params.native;
}

const onSubmit = handleSubmit((data) => {
  emit('submit', data);
  emit('update:modelValue', false);
});

function onOpen() {
  form.value = reactionIcon.value ?? '';
  v$.value.$reset();
}
</script>
