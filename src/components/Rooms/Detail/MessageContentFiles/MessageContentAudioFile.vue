<template>
  <div
    class="bg-surface-container-highest audio pa-1 d-flex align-center"
    :class="[isCurrentUserMessage ? 'flex-row-reverse' : 'flex-row']"
  >
    <v-chip size="small" rounded>{{ currentTime }}</v-chip>
    <v-wave-surfer-player
      ref="player"
      class="flex-grow-1 mx-1"
      :class="[isCurrentUserMessage ? 'pl-1' : 'pr-1']"
      progress-color="#FFFFFF"
      wave-color="#F0F0F0"
      :barWidth="2"
      :barGap="2"
      :bar-radius="2"
      :url="fileSrc"
      :height="28"
    />

    <v-btn
      size="28"
      variant="tonal"
      :icon="isPlaying ? 'mdi-pause' : 'mdi-play'"
      @click="toggleAudio"
    />
  </div>
</template>

<script lang="ts" setup>
import _ from 'lodash';
import { computed, ref, unref } from 'vue';

import VWaveSurferPlayer from '@/components/VWaveSurferPlayer.vue';
import { Format } from '@/helpers';

defineProps<{
  isCurrentUserMessage: boolean;
  fileSrc?: string;
}>();

const player = ref<InstanceType<typeof VWaveSurferPlayer>>();
const isPlaying = computed(() => player.value?.isPlaying);
const currentTime = computed(() =>
  Format.formatDuration(player.value?.currentTime ?? 0),
);

function toggleAudio() {
  const waveSurfer = unref(player.value?.wavesurfer);

  if (!waveSurfer) {
    return;
  }

  if (isPlaying.value) {
    waveSurfer.pause();
  } else {
    waveSurfer.play();
  }
}
</script>
