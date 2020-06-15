import store from '../__config__/store.config';
import customize from '../__config__/customize.config';
import { updateSessionObject } from './sessionStorage';

const setCustomeLabel = (param) => {
  // 参数说明
  // param:{
  //   customizedModuleName:自定义界面表名，
  //   customizedModuleId：自定义界面ID，
  //   label：定义的自定义界面label
  // }
  const customizedModuleName = param.customizedModuleName;
  const externalModules = (window.ProjectConfig || { externalModules: undefined }).externalModules || {};
  const externalModulesRes = {};// 外部配置
  Object.keys(externalModules).forEach((key) => {
    externalModulesRes[key.toUpperCase()] = externalModules[key];
  });
  
  const customizeRes = {};// 内部配置
  Object.keys(customize).forEach((key) => {
    customizeRes[key.toUpperCase()] = customize[key];
  });
  let customizeConfig = {};
  if (externalModulesRes[customizedModuleName.toUpperCase()]) {
    customizeConfig = externalModulesRes;
  } else if (customizeRes[customizedModuleName.toUpperCase()]) {
    customizeConfig = customizeRes;
  }
  
  Object.keys(customizeConfig).forEach((customizeName) => {
    const nameToUpperCase = customizeName.toUpperCase();
    if (nameToUpperCase === customizedModuleName) { // 匹配到配置文件中的自定义界面配置
      const labelName = param.label || customizeConfig[customizeName].labelName;//
      const name = `C.${customizedModuleName}.${param.customizedModuleId}`;
      store.commit('global/addKeepAliveLabelMaps', { name, label: `${labelName}` });
      const keepAliveLabelMapsObj = {
        k: name,
        v: labelName
      };
      updateSessionObject('keepAliveLabelMaps', keepAliveLabelMapsObj);// keepAliveLabel因刷新后来源信息消失，存入session
    }
  });
};
export default setCustomeLabel;
