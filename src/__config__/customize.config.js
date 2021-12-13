// import functionPermission from '../__customize__/functionPower/FunctionPowerNew.vue';

// import proDesc from '../__customize__/pro_desc/pro_desc.vue';
// import standard from '../__customize__/colorSize/Standard.vue';
// import taskList from '../__customize__/taskList/taskList.vue';
// import metricsDefinition from '../__customize__/metricsDefinition/metricsDefinition.vue';
// import customizeReport from '../__component__/CustomizeReport.vue';
// import ApiPermission from '../__customize__/ApiPermission/ApiPermission.vue';

// import dataPermission from '../__customize__/DataPermission/DataPermission.vue';
import i18n from '../assets/js/i18n';

export default {
  // 列表配置双击跳转定制界面，需在文档里维护对应的labelName属性
  functionPermission: {
    component: () => import(
      /* webpackChunkName: 'functionPermission' */
      /* webpackMode: 'eager' */
      '../__customize__/functionPower/FunctionPowerNew.vue'
    ),
    labelName: i18n.t('tips.functionPermission'),
    label: 'functionPermission'
  },
  pro_desc: {
    component: () => import(
      /* webpackChunkName: 'pro_desc' */
      /* webpackMode: 'eager' */
      '../__customize__/pro_desc/pro_desc.vue'
    ),
    label: 'pro_desc'
  },
  standard: {
    component: () => import(
      /* webpackChunkName: 'standard' */
      /* webpackMode: 'eager' */
      '../__customize__/colorSize/Standard.vue'
    ),
    label: 'standard'
  },
  metricsDefinition: {
    component: () => import(
      /* webpackChunkName: 'metricsDefinition' */
      /* webpackMode: 'eager' */
      '../__customize__/metricsDefinition/metricsDefinition.vue'
    ),
    label: 'metricsDefinition'

  },
  taskList: {
    component: () => import(
      /* webpackChunkName: 'taskList' */
      /* webpackMode: 'eager' */
      '../__customize__/taskList/taskList.vue'
    ),
    labelName: i18n.t('messages.taskRecord'),
    label: 'taskList'
  },
  customizeReport: {
    component: () => import(
      /* webpackChunkName: 'customizeReport' */
      /* webpackMode: 'eager' */
      '../__component__/CustomizeReport.vue'
    ),
    label: 'customizeReport'
  },
  dataPermission: {
    component: () => import(
      /* webpackChunkName: 'dataPermission' */
      /* webpackMode: 'eager' */
      '../__customize__/DataPermission/DataPermission.vue'
    ),
    label: i18n.t('tips.dataPermission')
  },
  apiPermission: {
    component: () => import(
      /* webpackChunkName: 'apiPermission' */
      /* webpackMode: 'eager' */
      '../__customize__/ApiPermission/ApiPermission.vue'
    ),
    label: i18n.t('messages.devAccount')
  }
};
