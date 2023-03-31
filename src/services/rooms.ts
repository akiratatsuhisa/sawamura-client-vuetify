import { AxiosRequestConfig } from 'axios';

import { Service } from '@/services/common';

export class RoomsService extends Service {
  updatePhoto(config: AxiosRequestConfig, data: { id: string; image: File }) {
    const formData = new FormData();
    formData.append('image', data.image);

    return this.fetch<void>({
      ...config,
      url: `rooms/${data.id}/photo`,
      method: 'PATCH',
      data: formData,
    });
  }
}
