<template>
  <div class="d-flex flex-row align-center">
    <div>
      <v-btn
        icon="mdi-trash-can-outline"
        size="small"
        variant="tonal"
        @click="onCancel"
      />
    </div>

    <div
      class="flex-grow-1 mx-2 bg-primary rounded-pill flex-row align-center"
      :style="{
        height: '44px',
        display: isRecording ? 'flex' : 'none',
      }"
    >
      <v-btn
        icon
        variant="flat"
        color="primary-container"
        size="x-small"
        class="mx-2"
        @click="stopRecord"
      >
        <v-icon size="x-large" color="primary" icon="mdi-stop" />
      </v-btn>

      <div class="flex-grow-1">
        <v-wave-surfer-recorder
          ref="recorder"
          v-bind="wavesurferProps"
          @recorded="onRecorded"
        />
      </div>

      <v-chip class="mx-2" rounded>{{ displayRecordTime }}</v-chip>
    </div>
    <div
      v-if="!isSending"
      class="flex-grow-1 mx-2 bg-primary rounded-pill flex-row align-center"
      :style="{
        height: '44px',
        display: !isRecording ? 'flex' : 'none',
      }"
    >
      <v-btn
        icon
        variant="flat"
        color="primary-container"
        size="x-small"
        class="mx-2"
        @click="togglePlayer"
      >
        <v-icon size="x-large" color="primary">{{
          isPlaying ? 'mdi-pause' : 'mdi-play'
        }}</v-icon>
      </v-btn>

      <div class="flex-grow-1">
        <v-wave-surfer-player
          ref="player"
          v-bind="wavesurferProps"
          :url="urlSrc"
          autoplay
        />
      </div>

      <v-chip class="mx-2" rounded>{{ displayPlayerTime }}</v-chip>
    </div>
    <div>
      <v-btn
        icon="mdi-send"
        size="small"
        variant="text"
        @click="onSendRecord"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useObjectUrl } from '@vueuse/core';
import { computed, nextTick, ref, shallowRef, unref, watch } from 'vue';

import VWaveSurferPlayer from '@/components/VWaveSurferPlayer.vue';
import VWaveSurferRecorder from '@/components/VWaveSurferRecorder.vue';
import { useRecordTime } from '@/composables';
import { Format } from '@/helpers';

const wavesurferProps = {
  progressColor: '#FFFFFF',
  waveColor: '#F0F0F0',
  barWidth: 2,
  barGap: 2,
  barRadius: 2,
  height: 30,
};

defineProps<{ modelValue?: boolean }>();

const emit = defineEmits<{
  (event: 'update:modelValue', payload: boolean): void;
  (event: 'sendRecord', payload: File): void;
}>();

const recorder = ref<InstanceType<typeof VWaveSurferRecorder>>();
const isRecording = computed(() => recorder.value?.isRecording ?? false);
const recordTime = useRecordTime(isRecording, { immediate: true });
const displayRecordTime = computed(() =>
  Format.formatDuration(recordTime.value),
);

function onCancel() {
  emit('update:modelValue', false);
}

async function startRecord() {
  const record = unref(recorder.value?.record);
  if (!record) {
    emit('update:modelValue', false);
    return;
  }
  if (isRecording.value) {
    return;
  }

  await record.startMic();
  await record.startRecording();
}

async function stopRecord() {
  const record = unref(recorder.value?.record);
  if (!record) {
    emit('update:modelValue', false);
    return;
  }
  if (!isRecording.value) {
    return;
  }

  await record.stopRecording();
  await record.stopMic();
}

const blob = shallowRef<Blob>();
const urlSrc = useObjectUrl(blob);

function onRecorded(value: Blob) {
  blob.value = value;
}

const isSending = ref<boolean>(false);

async function onSendRecord() {
  isSending.value = true;

  await stopRecord();
  await new Promise((resolve) => setTimeout(resolve, 0));

  const file = new File([blob.value!], 'audio.webm', { type: 'audio/webm' });
  emit('sendRecord', file);
  emit('update:modelValue', false);
}

const MAX_TIME_RECORD = 1000 * 60 * 5; // 5 minutes
let timeout: number | undefined = undefined;

watch(recorder, async (current, _prev, onCleanup) => {
  if (!current) {
    return;
  }

  await nextTick();
  startRecord();
  timeout = window.setTimeout(() => stopRecord(), MAX_TIME_RECORD);
  onCleanup(() => window.clearTimeout(timeout));
});

const player = ref<InstanceType<typeof VWaveSurferPlayer>>();
const isPlaying = computed(() => player.value?.isPlaying);
const displayPlayerTime = computed(() => {
  const current = Format.formatDuration(player.value?.currentTime ?? 0);
  const duration = Format.formatDuration(player.value?.duration ?? 0);
  return `${current} / ${duration}`;
});

function togglePlayer() {
  const wavesurfer = unref(player.value?.wavesurfer);
  if (!wavesurfer) {
    return;
  }

  isPlaying.value ? wavesurfer.pause() : wavesurfer.play();
}
</script>
