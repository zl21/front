let globalConfig = {
  apiEncryptable: false, // 是否加密处理
  PUBLIC_KEY: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDACe1nZlA5AXo1D1PnHNVbeBThNfN6zM+ydWyOUHwQFahHiifeR91mCjrbkMWiqDqB5N+xz6UXCXGRlTRUYJchhGxhUlOhCA53T/F5ZlXrOoyKTdVgB7+HWmQOITwKcgThRFO2GCPCQB/bPYn5FVR7hqmxHBo7L6MONC9aXnL6PQIDAQAB', 
};

export const globalChange = (data) => {
  globalConfig = Object.assign(globalConfig, data);
};

export const global = globalConfig;
