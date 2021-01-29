
const updateSessionObject = (target, { k, v }) => {
  const data = JSON.parse(window.sessionStorage.getItem(target)) || {};
  data[k] = v;
  window.sessionStorage.setItem(target, JSON.stringify(data));
};

const deleteFromSessionObject = (target, key) => {
  const data = JSON.parse(window.sessionStorage.getItem(target)) || {};
  if (data[key] !== undefined) {
    delete data[key];
    window.sessionStorage.setItem(target, JSON.stringify(data));
  }
};
const getSessionObject = target => JSON.parse(window.sessionStorage.getItem(target)) || {};

const removeSessionObject = (target) => {
  window.sessionStorage.removeItem(target);
};

export {
  updateSessionObject, getSessionObject, deleteFromSessionObject, removeSessionObject 
};
