import { defineStore } from 'pinia';
import { ref } from 'vue';

import { IProfileUserResponse } from '@/interfaces';

export const useProfileUserStore = defineStore('profileUser', () => {
  const user = ref<IProfileUserResponse>();

  return { user };
});
