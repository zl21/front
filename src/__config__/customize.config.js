// export default {
//   functionPermission: {
//     component: () => import(
//       /* webpackChunkName: 'functionPermission' */
//       /* webpackMode: 'eager' */
//       '../__customize__/functionPower/FunctionPower.vue'
//     )
//   },
// };
import functionPermission from '../__customize__/functionPower/FunctionPower.vue';


export default {
  functionPermission: {
    component: functionPermission
  },
  
  
};
