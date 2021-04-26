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
import customizeReport from '../__component__/CustomizeReport.vue';

import dataPermission from '../__customize__/DataPermission/DataPermission.vue';

export default {
  // 列表配置双击跳转定制界面，需在文档里维护对应的labelName属性
  functionPermission: {
    component: functionPermission,
    labelName: '功能权限',
    label: 'functionPermission'
  },
  pro_desc: {
    component: proDesc,
    label: 'pro_desc'

  },
  standard: {
    component: standard,
    label: 'standard'
  },
  metricsDefinition: {
    component: metricsDefinition,
    label: 'metricsDefinition'

  },
  taskList: {
    component: taskList,
    labelName: '任务记录',
    label: 'taskList'

  },
  customizeReport: {
    component: customizeReport,
    label: 'customizeReport'
  },
  dataPermission: {
    component: dataPermission,
    label: '数据权限'
  },

};
