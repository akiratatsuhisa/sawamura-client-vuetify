import VBaseDialog from '@/components/BaseDialog.vue';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    BaseDialog: typeof VBaseDialog;
  }
}
