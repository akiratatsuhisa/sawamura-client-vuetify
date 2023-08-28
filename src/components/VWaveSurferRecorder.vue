<template>
  <div ref="containerRef" />
</template>

<script lang="ts" setup>
import _ from 'lodash';
import { ref } from 'vue';
import { WaveSurferOptions } from 'wavesurfer.js';

import { useWaveSurferRecord } from '@/composables';

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
  (event: 'isRecording', payload: boolean): void;
  (event: 'recorded', payload: Blob): void;
}>();

const containerRef = ref<HTMLDivElement>();

const { record, state, isRecording } = useWaveSurferRecord(
  containerRef,
  props,
  {
    onIsRecordinghanged: (value) => emit('isRecording', value),
    onRecorded: (value) => emit('recorded', value),
  },
);

defineExpose({
  record,
  state,
  isRecording,
});
</script>
