// export default {
//   functionPermission: {
//     component: () => import(
//       /* webpackChunkName: 'functionPermission' */
//       /* webpackMode: 'eager' */
//       '../__customize__/functionPower/FunctionPower.vue'
//     )
//   },
// };
import functionPermission from '../__customize__/functionPower/FunctionPowerNew.vue';

// import functionPermissionTest from '../__customize__/functionPower/FunctionPowerNew.vue';
import proDesc from '../__customize__/pro_desc/pro_desc.vue';
import standard from '../__customize__/colorSize/Standard.vue';
import taskList from '../__customize__/taskList/taskList.vue';
import metricsDefinition from '../__customize__/metricsDefinition/metricsDefinition.vue';


export default {
  // 列表配置双击跳转定制界面，需在文档里维护对应的labelName属性
  functionPermission: {
    component: functionPermission,
    labelName: '功能权限',
    label: '功能权限'
  },
  pro_desc: {
    component: proDesc,
    label: '功能权限1'

  },
  standard: {
    component: standard,
    label: '功能权限2'

  },
  metricsDefinition: {
    component: metricsDefinition,
    label: '功能权限3'

  },
  // AD_TABLE: {
  //   component: AD_TABLE
  // },
  taskList: {
    component: taskList,
    labelName: '任务记录',
    label: '功能权限4'

  }
  
};
