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
import proDesc from '../__component__/Login';


export default {
  functionPermission: {
    component: functionPermission
  },
  pro_desc: {
    component: proDesc
  },
  
  
};
