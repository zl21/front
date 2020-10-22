
const updateLocalObject = (target, { k, v }) => {
  const data = JSON.parse(window.localStorage.getItem(target)) || {};
  data[k] = v;
  window.localStorage.setItem(target, JSON.stringify(data));
};

const deleteFromLocalObject = (target, key) => {
  const data = JSON.parse(window.localStorage.getItem(target)) || {};
  if (data[key] !== undefined) {
    delete data[key];
    window.localStorage.setItem(target, JSON.stringify(data));
  }
};
const getLocalObject = target => JSON.parse(window.localStorage.getItem(target)) || {};

const removeLocalObject = (target) => {
  window.localStorage.removeItem(target);
};

export {
  updateLocalObject, getLocalObject, deleteFromLocalObject, removeLocalObject 
};
