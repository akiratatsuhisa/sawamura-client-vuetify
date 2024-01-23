import { onClickOutside } from '@vueuse/core';
import { ref, watch } from 'vue';

export function useSearchField() {
  const searchFieldContainerRef = ref<HTMLDivElement>();
  const searchFieldRef = ref<HTMLInputElement>();

  const isSearchFieldOpen = ref(false);

  watch([isSearchFieldOpen, searchFieldRef], ([isOpened, searchFieldRef]) => {
    if (!searchFieldRef) {
      return;
    }

    if (isOpened) {
      searchFieldRef.focus();
    }
  });

  onClickOutside(
    searchFieldContainerRef,
    () => (isSearchFieldOpen.value = !isSearchFieldOpen.value),
  );

  return { searchFieldContainerRef, searchFieldRef, isSearchFieldOpen };
}
