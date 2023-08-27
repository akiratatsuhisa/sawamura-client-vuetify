import { Component } from 'vue';

export type SettingsTab = {
  name: string;
  icon: string;
  component: Component;
};

export type SettingsTabs = Record<
  | 'account'
  | 'display'
  | 'languages'
  | 'email'
  | 'password'
  | 'oauth-providers',
  SettingsTab
>;
