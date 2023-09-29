import VBaseDialog from '@/components/BaseDialog.vue';
import VBaseLoading from '@/components/BaseLoading.vue';
import VBaseMenu from '@/components/VBaseMenu.vue';
import VFloatingActionButton from '@/components/VFloatingActionButton.vue';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    BaseLoading: typeof VBaseLoading;
    BaseDialog: typeof VBaseDialog;
    BaseMenu: typeof VBaseMenu;
    VFloatingActionButton: typeof VFloatingActionButton;
  }
}
