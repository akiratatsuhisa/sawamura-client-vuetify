<template>
  <v-whinny-wrapper direction="horizontal" :photo-url="photoUrl">
    <template #action>
      <div>
        <v-whinny-input-action icon="mdi-emoticon-outline" />
        <v-whinny-input-action icon="mdi-image-outline" />
        <v-whinny-input-action icon="mdi-video-outline" />
        <v-whinny-input-action icon="mdi-calendar-clock-outline" />
      </div>
      <div>
        <v-btn @click="onSubmit" :loading="isLoading">
          {{ $t('common.whinny.compose.submit') }}
        </v-btn>
      </div>
    </template>

    <template #default>
      <v-textarea
        v-model="text"
        variant="solo"
        hide-details
        :placeholder="$t('common.whinny.compose.placeholder')"
      ></v-textarea>
    </template>
  </v-whinny-wrapper>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import VWhinnyInputAction from '@/components/Whinnies/WhinnyInputAction.vue';
import VWhinnyWrapper from '@/components/Whinnies/WhinnyWrapper.vue';
import { useAuth, useAxios, useModalCallback } from '@/composables';
import { IWhinnyResponse } from '@/interfaces';
import { services } from '@/services';

const props = defineProps<{
  type: 'Owner' | 'Quote' | 'Comment';
  referenceUsername?: string;
  referenceWhinny?: IWhinnyResponse;
}>();

const router = useRouter();
const { photoUrl } = useAuth();

const text = ref('');

watch(
  () => props.referenceUsername,
  (referenceUsername) => {
    if (!referenceUsername) {
      return;
    }

    text.value = `@${referenceUsername}`;
  },
  { immediate: true },
);

const { request: requestCreateWhinny, isLoading } = useAxios(
  services.whinnies,
  'create',
);

const { onSuccess } = useModalCallback<IWhinnyResponse>();

async function onSubmit() {
  const data = await requestCreateWhinny({
    type: props.type,
    sourceId: props.type !== 'Owner' ? props.referenceWhinny?.id : undefined,
    content: text.value,
    publishDate: undefined,
  });

  onSuccess(data);

  router.back();
}
</script>
