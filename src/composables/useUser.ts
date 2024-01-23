import { computedAsync, MaybeRef } from '@vueuse/core';
import { unref } from 'vue';

import { axiosInstacne } from '@/services';

const NO_AVATAR_URL = import.meta.env.VITE_NO_AVATAR_URL as string;
const NO_BACKGROUND_URL = import.meta.env.VITE_NO_BACKGROUND_URL as string;

const cacheUserImages: Map<string, Promise<string>> = new Map();

export function clearCacheUserImages() {
  cacheUserImages.clear();
}

export function useUserImage(
  type: 'photo' | 'cover',
  user: MaybeRef<{
    username: string;
    photoUrl?: string | null;
    coverUrl?: string | null;
  }>,
) {
  const defaultImage = type === 'photo' ? NO_AVATAR_URL : NO_BACKGROUND_URL;

  async function request(username: string, type: string) {
    return await axiosInstacne
      .request<string>({
        url: `/profileUsers/${username}/${type}`,
      })
      .then((data) => data.data)
      .catch(() => defaultImage);
  }

  return computedAsync(async () => {
    const unwrapUser = unref(user);
    const url = unwrapUser[`${type}Url`];

    if (!url) {
      return defaultImage;
    }

    if (cacheUserImages.has(url)) {
      return await cacheUserImages.get(url)!;
    }

    const promise = request(unwrapUser.username, type);

    cacheUserImages.set(url, promise);

    return await promise;
  }, defaultImage);
}
