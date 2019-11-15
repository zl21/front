// export default {
//   functionPermission: {
//     component: () => import(
//       /* webpackChunkName: 'functionPermission' */
//       /* webpackMode: 'eager' */
//       '../__customize__/functionPower/FunctionPower.vue'
//     )
//   },
// };
import FunctionPower from '../__customize__/functionPower/FunctionPower.vue';
import proDesc from '../__customize__/pro_desc/pro_desc.vue';
import standard from '../__customize__/colorSize/Standard.vue';
import AD_TABLE from '../__customize__/queryStandardTableList/queryStandardTableList.vue';


export default {
  AD_TABLE: {
    component: AD_TABLE,
    labelName: '功能权限'
  },
  pro_desc: {
    component: proDesc,

  },
  standard: {
    component: standard
  },
  
  
};
