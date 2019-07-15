export default {
  ChangePassword: {
    component: () => import(
      /* webpackChunkName: 'ChangePassword' */
      /* webpackMode: 'eager' */
      '../__customizeDialog__/ChangePassword/ChangePassword.vue'
    )
  },
  clonePopUp: {
    component: () => import(
      /* webpackChunkName: 'clonePopUp' */
      /* webpackMode: 'eager' */
      '../__customizeDialog__/ClonePopUp/ClonePopUp.vue'
    )
  },
  Publish: {
    component: () => import(
      /* webpackChunkName: 'Publish' */
      /* webpackMode: 'eager' */
      '../__customizeDialog__/Publish/Publish.vue'
    )
  },
};
