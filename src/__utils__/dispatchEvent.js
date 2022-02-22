// 定义事件名
export const ADD_TASK = 'addTask'
export const UPDATE_TASK = 'updateTask'
export const R3_EXPORT = 'R3-export'
export const R3_IMPORT = 'R3-import'
export const R3_TAB_CLOSE = 'R3-tab-close' // 关闭tab标签

export const DispatchEvent = (eventName, config = {}) => {
  const ev = new CustomEvent(eventName, config);
  window.dispatchEvent(ev);
};

export default DispatchEvent;
