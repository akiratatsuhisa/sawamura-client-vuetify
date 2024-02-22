import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useProfileUserStore = defineStore('profileUser', () => {
  const user = ref<{
    id: string;
    username: string;
    displayName: string | null;
    photoUrl: string | null;
    coverUrl: string | null;
    themeSource: number | null;
    themeStyle: string | null;
  }>();

  return { user };
});
