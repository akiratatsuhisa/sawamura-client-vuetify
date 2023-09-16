<template>
  <v-btn icon>
    <v-avatar
      color="secondary-container"
      class="elevation-2"
      :image="photoUrl"
      :size="($attrs.size as any)"
    />

    <v-base-menu :title="$t('common.app.title')">
      <template #default="{ close }">
        <v-list>
          <v-list-item @click="gotoUserAuth(close)">
            <template #prepend>
              <v-avatar
                color="secondary-container"
                class="elevation-1"
                :image="photoUrl"
              ></v-avatar>
            </template>
            <v-list-item-title>
              {{ user?.displayName }}
            </v-list-item-title>
            <v-list-item-subtitle>{{ user?.username }}</v-list-item-subtitle>

            <template #append>
              <div style="width: 56px"></div>
            </template>
          </v-list-item>

          <v-divider class="my-2" />

          <v-list-item>
            <v-list-item-title>
              {{
                translateItem('theme', {
                  name: $t(`common.themes.${selectedThemeModeDetail.name}`),
                })
              }}
            </v-list-item-title>

            <template #append>
              <v-avatar
                v-for="(detail, mode) in themeModes"
                v-ripple="true"
                :key="mode"
                :color="
                  isActiveThemeMode(mode) ? 'tertiary' : 'tertiary-container'
                "
                class="cursor-pointer ml-1"
                @click.stop="selectedThemeMode = mode"
              >
                <v-icon :icon="detail.icon" />
              </v-avatar>
            </template>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>
              {{ $t(`common.languages.${selectedLanguageDetail.name}`) }}
            </v-list-item-title>

            <template #append>
              <v-avatar
                v-for="(detail, language) in languages"
                v-ripple="true"
                :key="language"
                :image="detail.image"
                class="cursor-pointer ml-1"
                @click.stop="selectedLanguage = language"
              />
            </template>
          </v-list-item>

          <v-list-item
            :to="{ name: 'Settings', params: { tab: 'account' } }"
            @click="close"
          >
            <v-list-item-title>
              {{ translateItem('settings') }}
            </v-list-item-title>

            <template #append>
              <v-avatar color="tertiary-container">
                <v-icon icon="mdi-cog" />
              </v-avatar>
            </template>
          </v-list-item>

          <v-list-item @click="onLogout">
            <v-list-item-title>
              {{ translateItem('logout') }}
            </v-list-item-title>

            <template #append>
              <v-avatar color="tertiary-container">
                <v-icon icon="mdi-logout" />
              </v-avatar>
            </template>
          </v-list-item>
        </v-list>
      </template>
    </v-base-menu>
  </v-btn>
</template>

<script lang="ts" setup>
import _ from 'lodash';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import {
  useAuth,
  useLanguageStorage,
  useLayoutLocale,
  useThemeModeStorage,
} from '@/composables';

const router = useRouter();
const route = useRoute();

const { translateItem } = useLayoutLocale({
  prefix: 'default.topAppBar.profile',
});

const redirectUrl = computed(() =>
  _.isArray(route.query.redirectUrl)
    ? _.get(route.query.redirectUrl, '0', '/')
    : route.query.redirectUrl,
);

const {
  themeModes,
  selectedThemeMode,
  selectedThemeModeDetail,
  isActiveThemeMode,
} = useThemeModeStorage();

const { languages, selectedLanguage, selectedLanguageDetail } =
  useLanguageStorage();

const { logout, user, photoUrl } = useAuth();

async function onLogout() {
  await router.push({
    name: 'Auth:Login',
    query: { redirectUrl: redirectUrl.value },
  });
  await logout();
}

function gotoUserAuth(callback: Function) {
  router.push({
    name: 'Users:Detail',
    params: { username: user.value?.username },
  });
  callback();
}
</script>
