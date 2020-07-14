let globalConfig = {
  // 前端配置字段
  changePattern: true, // 控制待办列表转派的选择模式 true为单选,false为多选
  gateway: null, // jflow网关，默认没有网关

  apiEncryptable: false, // 是否加密处理
  PUBLIC_KEY: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDACe1nZlA5AXo1D1PnHNVbeBThNfN6zM+ydWyOUHwQFahHiifeR91mCjrbkMWiqDqB5N+xz6UXCXGRlTRUYJchhGxhUlOhCA53T/F5ZlXrOoyKTdVgB7+HWmQOITwKcgThRFO2GCPCQB/bPYn5FVR7hqmxHBo7L6MONC9aXnL6PQIDAQAB', 
};

export const globalChange = (data) => {
  globalConfig = Object.assign(globalConfig, data);
};

export const global = globalConfig;
