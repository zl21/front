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
      /* webpackChunkName: 'ChangePassword' */
      /* webpackMode: 'eager' */
      '../__customizeDialog__/ClonePopUp/ClonePopUp.vue'
    )
  },
};

// export default [
//   {
//     componentName: 'ChangePassword',
//     component: () => import('../__customizeDialog__/ChangePassword/ChangePassword')
//   },
//   {
//     filePath: 'custompage/clonePopUp',
//     component: () => import('../__customizeDialog__/ClonePopUp/ClonePopUp')
//   },
// ];
