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
import proDesc from '../__customize__/pro_desc/pro_desc.vue';
import standard from '../__customize__/colorSize/Standard.vue';


export default {
  functionPermission: {
    component: functionPermission
  },
  pro_desc: {
    component: proDesc
  },
  standard: {
    component: standard
  },
  
  
};
