import launchApp from './src/app.entry';
import network, { urlSearchParams } from './src/__utils__/network';

const validateConfig = (config) => {
  return {
    isQualified: true,
    message: 'xxx'
  };
};

export default {
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
   *   customizedEntry: {
   *
   *   }
   * }
   */
  launchApplication(projectConfig) {
    const validateInfo = validateConfig(projectConfig);
    if (!validateInfo.isQualified) {
      alert(validateInfo.message);
      return;
    }
    window.ProjectConfig = projectConfig;
    launchApp(projectConfig);
  },
  urlSearchParams,
  network,
};
