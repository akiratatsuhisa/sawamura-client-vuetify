import { computedAsync, MaybeRef } from '@vueuse/core';
import { unref } from 'vue';

import { axiosInstacne } from '@/services';

const NO_AVATAR_URL = import.meta.env.VITE_NO_AVATAR_URL as string;
const NO_BACKGROUND_URL = import.meta.env.VITE_NO_BACKGROUND_URL as string;

export function useUserImage(
  type: 'photo' | 'cover',
  user: MaybeRef<{
    username: string;
    photoUrl?: string | null;
    coverUrl?: string | null;
  }>,
) {
  const defaultImage = type === 'photo' ? NO_AVATAR_URL : NO_BACKGROUND_URL;

  return computedAsync(async () => {
    const unwrapUser = unref(user);

    if (!unwrapUser[`${type}Url`]) {
      return defaultImage;
    }

    return await axiosInstacne
      .request<string>({
        url: `/users/profile/${unwrapUser.username}/${type}`,
      })
      .then((data) => data.data)
      .catch(() => defaultImage);
  }, defaultImage);
}
