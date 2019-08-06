export default {
  NetworkMonitor: {
    name: '网络监控', // 菜单Tab显示的label
    component: () => import(
      /* webpackChunkName: 'NetworkMonitor' */
      /* webpackMode: 'eager' */
      '../__plugin__/NetworkMonitor/NetworkMonitor.vue'
    )
  },
};
