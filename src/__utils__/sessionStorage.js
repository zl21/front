
const updateSessionObject = (target, { k, v }) => {
  const data = JSON.parse(window.sessionStorage.getItem(target)) || {};
  data[k] = v;
  window.sessionStorage.setItem(target, JSON.stringify(data));
};

const deleteFromSessionObject = (target, key) => {
  const data = JSON.parse(window.sessionStorage.getItem(target)) || {};
  delete data[key];
  window.sessionStorage.setItem(target, JSON.stringify(data));
};

const getSeesionObject = target => JSON.parse(window.sessionStorage.getItem(target)) || {};

export { updateSessionObject, getSeesionObject, deleteFromSessionObject };
