import launchApp from './src/app.entry';
import network, { urlSearchParams } from './src/__utils__/network';

const validateConfig = (config) => {
  return {
    isQualified: true,
    message: 'xxx'
  };
};

export default {
  version: '0.0.4',
  /**
   * @param projectConfig 项目配置
   * projectConfig: {
   *   image: {
   *     enterpriseLogo: '',  // 公司 Logo 图片
   *     enterpriseBanner: '', // 公司Banner 图片
   *   },
   *   globalComponent: {
   *     Login: '',  // 登录页
   *     WelcomePage: '', // 欢迎页
   *   },
   *   externalModules: {
   *      key-1: VueComponent-1
   *      key-2: VueComponent-2
   *      ...
   *   }
   * }
   */
  launchApplication(projectConfig) {
    const validateInfo = validateConfig(projectConfig);
    if (!validateInfo.isQualified) {
      alert(validateInfo.message);
      return;
    }
    if (projectConfig.externalModules) {
      const m = projectConfig.externalModules;
      // 将外部自定义界面入口模块的标识key置为大写
      projectConfig.externalModules = Object.keys(m).reduce((a, c) => {
        a[c.toUpperCase()] = m[c];
        return a;
      }, {});
    }
    window.ProjectConfig = projectConfig;

    launchApp(projectConfig);
  },
  urlSearchParams,
  network,
};
