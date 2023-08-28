<template>
  <div ref="containerRef" />
</template>

<script lang="ts" setup>
import _ from 'lodash';
import { ref } from 'vue';
import { WaveSurferOptions } from 'wavesurfer.js';

import { useWaveSurfer } from '@/composables';

const props = withDefaults(
  defineProps<Omit<WaveSurferOptions, 'container'>>(),
  {
    autoCenter: undefined,
    autoScroll: undefined,
    autoplay: undefined,
    fillParent: undefined,
    hideScrollbar: undefined,
    interact: undefined,
    mediaControls: undefined,
    normalize: undefined,
  },
);

const emit = defineEmits<{
  (event: 'isPlaying', payload: boolean): void;
}>();

const containerRef = ref<HTMLDivElement>();

const { wavesurfer, state, isPlaying, currentTime, duration } = useWaveSurfer(
  containerRef,
  props,
  {
    onIsPlayingChanged: (value) => emit('isPlaying', value),
  },
);

defineExpose({ wavesurfer, state, isPlaying, currentTime, duration });
</script>
