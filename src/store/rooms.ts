import { useThrottleFn } from '@vueuse/core';
import _ from 'lodash';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import {
  useSnackbar,
  useSocketChat,
  useSocketEventListener,
} from '@/composables';
import {
  IRoomMessageResponse,
  IRoomResponse,
  ISearchRoomsRequest,
} from '@/interfaces';

export const useRoomsStore = defineStore('rooms', () => {
  const socket = useSocketChat();
  const { createSnackbarError } = useSnackbar();

  const isRoomsAllLoaded = ref<boolean>(false);
  const rooms = ref<Array<IRoomResponse>>([]);

  const { request: requestRooms, isLoading: isLoadingRooms } =
    useSocketEventListener<
      { rooms: Array<IRoomResponse> },
      ISearchRoomsRequest
    >(socket, 'list:room', {
      response({ rooms: data }) {
        if (!data.length) {
          isRoomsAllLoaded.value = true;
          return;
        }
        isRoomsAllLoaded.value = false;
        rooms.value = _.uniqBy([...rooms.value, ...data], (room) => room.id);
      },
      exception(error) {
        createSnackbarError(error.message);
      },
    });

  const requestRoomsThrottle = useThrottleFn(requestRooms, 500);

  function fetchMore() {
    const excludeIds = _.map(rooms.value, (room) => room.id);

    requestRoomsThrottle({
      take: 10,
      excludeIds: excludeIds.length ? excludeIds : undefined,
    });
  }
  fetchMore();

  function updateListRoom(data: IRoomResponse) {
    rooms.value = _(rooms.value)
      .filter((room) => room.id !== data.id)
      .tap((rooms) => rooms.unshift(data))
      .sort((a, b) => {
        if (!_.isNil(a.lastActivatedAt) && !_.isNil(b.lastActivatedAt)) {
          const aDate = new Date(a.lastActivatedAt);
          const bDate = new Date(b.lastActivatedAt);
          return aDate > bDate ? -1 : aDate < bDate ? 1 : 0;
        }
        if (_.isNil(a.lastActivatedAt) && !_.isNil(b.lastActivatedAt)) {
          return 1;
        }
        if (!_.isNil(a.lastActivatedAt) && _.isNil(b.lastActivatedAt)) {
          return -1;
        }
        return 0;
      })
      .value();
  }

  useSocketEventListener<IRoomResponse>(socket, 'create:room', {
    listener: updateListRoom,
  });
  useSocketEventListener<IRoomResponse>(socket, 'update:room:photo', {
    listener: updateListRoom,
  });
  useSocketEventListener<IRoomResponse>(socket, 'update:room', {
    listener: updateListRoom,
  });
  useSocketEventListener<IRoomMessageResponse>(socket, 'create:message', {
    listener: (data) => updateListRoom(data.room),
  });
  useSocketEventListener<IRoomMessageResponse>(socket, 'delete:message', {
    listener: (data) => updateListRoom(data.room),
  });

  const search = ref<string>('');
  const searchClearable = computed(() => _.trim(search.value).length);

  return {
    rooms,
    isLoadingRooms,
    isRoomsAllLoaded,
    fetchMore,
    updateListRoom,
    search,
    searchClearable,
  };
});
