import i18n from '../assets/js/i18n';

export default {
  NetworkMonitor: {
    name: i18n.t('tips.networkMonitor'), // 菜单Tab显示的label
    component: () => import(
      /* webpackChunkName: 'NetworkMonitor' */
      /* webpackMode: 'eager' */
      '../__plugin__/NetworkMonitor/NetworkMonitor.vue'
    )
  },
  PRINTTEMPLATE: { 
    name: i18n.t('messages.setTemplate'), // 菜单Tab显示的label
    component: () => import(
      /* webpackChunkName: 'NetworkMonitor' */
      /* webpackMode: 'eager' */
      '../__plugin__/Print/printTemplate.vue'
    )
  },
  PRINTPREVIEW: { 
    name: i18n.t('messages.PrintPreview'), // 菜单Tab显示的label
    component: () => import(
      /* webpackChunkName: 'NetworkMonitor' */
      /* webpackMode: 'eager' */
      '../__plugin__/Print/printPreview.vue'
    )
  },
  INSTANCEMANAGEMENTLIST: {
    name: i18n.t('tips.todoList'), // 菜单Tab显示的label
    component: () => import(
      /* webpackChunkName: 'NetworkMonitor' */
      /* webpackMode: 'eager' */
      '../../jflowPlugin/view/InstanceManagementList.vue'
    )
  }
};
