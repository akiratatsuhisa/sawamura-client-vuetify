import { MaybeRef } from '@vueuse/core';
import _ from 'lodash';
import { computed, Ref, ref, shallowRef, unref, watch } from 'vue';
import { useTheme } from 'vuetify';
import WaveSurfer, { WaveSurferOptions } from 'wavesurfer.js';
import RecordPlugin from 'wavesurfer.js/dist/plugins/record';

export type WaveSurferOptionsProps = Omit<WaveSurferOptions, 'container'>;

export enum PlayerState {
  Init,
  Ready,
  Playing,
  Paused,
  Finished,
}

export interface UseWaveSurferOptions {
  onStateChanged?: (value: PlayerState) => void;
  onIsPlayingChanged?: (value: boolean) => void;
}

const includeProps: Array<keyof WaveSurferOptionsProps> = [
  'height',
  'cursorColor',
  'cursorWidth',
  'barWidth',
  'barGap',
  'barRadius',
  'barHeight',
  'barAlign',
  'minPxPerSec',
  'fillParent',
  'url',
  'peaks',
  'duration',
  'media',
  'mediaControls',
  'autoplay',
  'interact',
  'hideScrollbar',
  'audioRate',
  'autoScroll',
  'autoCenter',
  'sampleRate',
  'splitChannels',
  'normalize',
  'plugins',
  'renderFunction',
  'fetchParams',
];

export function useWaveSurfer<R extends HTMLElement>(
  containerRef: Ref<R | undefined>,
  props: WaveSurferOptionsProps,
  options?: UseWaveSurferOptions,
) {
  const theme = useTheme();

  const state = ref<PlayerState>(PlayerState.Init);
  const isPlaying = ref<boolean>(false);

  const duration = ref<number>(0);
  const currentTime = ref<number>(0);

  const wavesurfer = shallowRef<WaveSurfer>();
  const waveSurferOptions =
    ref<Omit<WaveSurferOptions, 'container' | 'waveColor' | 'progressColor'>>();

  function changeState(value: PlayerState, playing: boolean) {
    state.value = value;
    options?.onStateChanged?.(value);
    isPlaying.value = playing;
    options?.onIsPlayingChanged?.(playing);
  }

  watch(
    () => _.pick(props, includeProps),
    (current, prev) => {
      if (_.isEqual(current, prev)) {
        return;
      }

      waveSurferOptions.value = _.omitBy(current, _.isUndefined);
    },
    { deep: true, immediate: true },
  );

  watch(
    [waveSurferOptions, containerRef],
    (current, prev, onCleanup) => {
      if (!containerRef.value || _.isEqual(current, prev)) {
        return;
      }

      const ws = WaveSurfer.create({
        ..._.omitBy(waveSurferOptions.value, _.isUndefined),
        url: props.url,
        waveColor:
          props.waveColor ?? theme.current.value.colors['primary-container'],
        progressColor:
          props.progressColor ?? theme.current.value.colors.primary,
        container: containerRef.value!,
      });

      ws.on('interaction', () => {
        ws.play();
      });

      ws.on('play', () => {
        changeState(PlayerState.Playing, true);
      });

      ws.on('finish', () => {
        changeState(PlayerState.Finished, false);
      });

      ws.on('pause', () => {
        changeState(PlayerState.Paused, false);
      });

      ws.on('ready', () => {
        changeState(PlayerState.Ready, false);
        duration.value = ws.getDuration();
      });

      ws.on('timeupdate', (time) => {
        currentTime.value = time;
      });

      wavesurfer.value = ws;

      onCleanup(() => {
        ws.unAll();
        ws.destroy();
      });
    },
    { deep: true },
  );

  watch(
    [
      () => props.waveColor,
      () => props.progressColor,
      () => theme.current.value.colors,
    ],
    ([waveColor, progressColor]) => {
      if (!wavesurfer.value) {
        return;
      }

      wavesurfer.value.setOptions({
        waveColor: waveColor ?? theme.current.value.colors['primary-container'],
        progressColor: progressColor ?? theme.current.value.colors.primary,
      });
    },
    { immediate: true, deep: true },
  );

  return { wavesurfer, state, isPlaying, currentTime, duration };
}

export enum RecordState {
  Init,
  Recording,
  Recorded,
}

export interface UseWaveSurferRecordOptions {
  onStateChanged?: (value: RecordState) => void;
  onIsRecordinghanged?: (value: boolean) => void;
  onRecorded?: (value: Blob) => void;
}

export function useWaveSurferRecord<R extends HTMLElement>(
  containerRef: Ref<R | undefined>,
  props: WaveSurferOptionsProps,
  options?: UseWaveSurferRecordOptions,
) {
  const { wavesurfer } = useWaveSurfer(containerRef, props);

  const record = shallowRef<RecordPlugin>();
  const state = ref<RecordState>(RecordState.Init);
  const isRecording = ref<boolean>(false);

  function changeState(value: RecordState, recoring: boolean) {
    state.value = value;
    options?.onStateChanged?.(value);
    isRecording.value = recoring;
    options?.onIsRecordinghanged?.(recoring);
  }

  watch(
    wavesurfer,
    (ws, _prev, onCleanup) => {
      if (!ws) {
        return;
      }

      const r = ws.registerPlugin(RecordPlugin.create());
      r.on('record-start', () => {
        changeState(RecordState.Recording, true);
      });
      r.on('record-end', (value) => {
        changeState(RecordState.Recorded, false);
        options?.onRecorded?.(value);
      });

      record.value = r;

      onCleanup(() => {
        r.destroy();
      });
    },
    { immediate: true },
  );

  return {
    record,
    state,
    isRecording,
  };
}

export interface UseRecordTimeOptions {
  currentRecord?: MaybeRef<number>;
  immediate?: boolean;
}

export function useRecordTime(
  isRecording: Ref<boolean>,
  options: UseRecordTimeOptions,
) {
  const { currentRecord = 0, immediate } = options;

  const current = ref(0);

  watch(
    isRecording,
    (isRecording, _prev, onCleanup) => {
      if (!isRecording) {
        return;
      }

      const time = new Date().getTime();
      current.value = 0;

      const interval = window.setInterval(() => {
        current.value = (new Date().getTime() - time) / 1000;
      }, 250);

      onCleanup(() => window.clearInterval(interval));
    },
    {
      immediate,
    },
  );

  return computed(() => unref(currentRecord) + unref(current));
}
