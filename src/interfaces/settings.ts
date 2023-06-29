import { Component } from 'vue';

export type SettingsTab = {
  title: string;
  icon: string;
  component: Component;
};

export type SettingsTabs = Record<
  'email' | 'password' | 'oauth-providers',
  SettingsTab
>;
