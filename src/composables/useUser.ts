import { MaybeRef } from '@vueuse/core';
import { computed, unref } from 'vue';

import { IAdvancedUserResponse } from '@/interfaces';

export function useUser(user: MaybeRef<IAdvancedUserResponse>) {
  const coverUrl = computed(() => {
    const unwrapUser = unref(user);
    return unwrapUser.coverUrl
      ? `${import.meta.env.VITE_API_URL}/auth/cover?username=${
          unwrapUser.username
        }`
      : import.meta.env.VITE_NO_BACKGROUND_URL;
  });

  const photoUrl = computed(() => {
    const unwrapUser = unref(user);
    return unwrapUser.photoUrl
      ? `${import.meta.env.VITE_API_URL}/auth/photo?username=${
          unwrapUser.username
        }`
      : import.meta.env.VITE_NO_AVATAR_URL;
  });

  return {
    coverUrl,
    photoUrl,
  };
}
