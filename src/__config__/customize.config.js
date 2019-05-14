export default {
  DingTalkModuleConfig: {
    component: () => import('../__customize__/palmCloud/PowerConfig.vue')
  },
  functionPermission: {
    component: () => import('../__customize__/functionPower/FunctionPower.vue')
  },
};
