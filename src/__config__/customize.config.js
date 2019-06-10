export default {
  functionPermission: {
    component: () => import(
      /* webpackChunkName: 'FunctionPowser' */
      /* webpackMode: 'eager' */
      '../__customize__/functionPower/FunctionPower.vue'
    )
  },
};
