export default {
  NetworkMonitor: {
    name: '网络监控', // 菜单Tab显示的label
    component: () => import(
      /* webpackChunkName: 'NetworkMonitor' */
      /* webpackMode: 'eager' */
      '../__plugin__/NetworkMonitor/NetworkMonitor.vue'
    )
  },
  INSTANCEMANAGEMENTLIST: {
    name: '待办列表', // 菜单Tab显示的label
    component: () => import(
      /* webpackChunkName: 'NetworkMonitor' */
      /* webpackMode: 'eager' */
      '../__plugin__/InstanceManagementList/InstanceManagementList.vue'
    )
  },
  PRINTTEMPLATE: { 
    name: '设置模版', // 菜单Tab显示的label
    component: () => import(
      /* webpackChunkName: 'NetworkMonitor' */
      /* webpackMode: 'eager' */
      '../__plugin__/InstanceManagementList/printTemplate.vue'
    )
  },
  PRINTPREVIEW: { 
    name: '打印预览', // 菜单Tab显示的label
    component: () => import(
      /* webpackChunkName: 'NetworkMonitor' */
      /* webpackMode: 'eager' */
      '../__plugin__/InstanceManagementList/printPreview.vue'
    )
  }
};
