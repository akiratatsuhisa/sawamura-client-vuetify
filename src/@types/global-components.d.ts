import VBaseDialog from '@/components/BaseDialog.vue';
import VBaseMenu from '@/components/VBaseMenu.vue';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    BaseDialog: typeof VBaseDialog;
    BaseMenu: typeof VBaseMenu;
  }
}
