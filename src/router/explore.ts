import { RouteRecordRaw } from 'vue-router';

import VBottomAppBar from '@/layouts/Default/BottomAppBar.vue';
import VLeftAppBar from '@/layouts/Default/LeftAppBar.vue';
import VExplore from '@/views/Explore/Index.vue';
import VExploreTopAppBar from '@/views/Explore/layouts/ExploreTopAppBar.vue';

export default {
  path: 'explore/:dialog(settings)?',
  name: 'Explore',
  meta: { requiresAuth: true },
  components: {
    left: VLeftAppBar,
    top: VExploreTopAppBar,
    bottom: VBottomAppBar,
    default: VExplore,
  },
} as RouteRecordRaw;
