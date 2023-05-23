import { AxiosRequestConfig } from 'axios';

import { Service } from '@/services/common';

export class RoomsService extends Service {
  updatePhoto(
    config: AxiosRequestConfig,
    data: { id: string; theme: boolean; image: File },
  ) {
    const formData = new FormData();
    formData.append('image', data.image);

    return this.fetch<void>({
      ...config,
      url: `rooms/${data.id}/photo`,
      method: 'PUT',
      data: formData,
      params: { theme: data.theme },
    });
  }

  updateCover(
    config: AxiosRequestConfig,
    data: { id: string; theme: boolean; image: File },
  ) {
    const formData = new FormData();
    formData.append('image', data.image);

    return this.fetch<void>({
      ...config,
      url: `rooms/${data.id}/cover`,
      method: 'PUT',
      data: formData,
      params: { theme: data.theme },
    });
  }

  deleteCover(config: AxiosRequestConfig, data: { id: string }) {
    return this.fetch<void>({
      ...config,
      url: `rooms/${data.id}/cover`,
      method: 'DELETE',
    });
  }

  updateTheme(
    config: AxiosRequestConfig,
    data: { id: string; source: number | null },
  ) {
    return this.fetch<void>({
      ...config,
      url: `rooms/${data.id}/theme`,
      method: 'PATCH',
      data,
    });
  }
}
