export default {
  DingTalkModuleConfig: {
    // 自定义界面：掌云数据报表权限设置模块
    path: 'DingTalkModuleConfig',
    component: () => import('../__customize__/palmCloud/PowerConfig.vue')
  },
};
