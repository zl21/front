export default {
  functionPermission: {
    component: () => import(
      /* webpackChunkName: 'FunctionPowser' */
      '../__customize__/functionPower/FunctionPower.vue'
    )
  },
};
