
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

window.RupdateLocalStorage = (target,{ k, v })=>{
  // 更新本地
  let data = JSON.parse(window.localStorage.getItem(target));
  if(data){
    data[k] = v;
    window.localStorage.setItem(target, JSON.stringify(data)); 
  }
      
}

window.RgetItemLocalStorage = (target)=>{
  // 获取
  let data = JSON.parse(window.localStorage.getItem(target) || '{}');
  return data;    
}

export {
  updateSessionObject, getSessionObject, deleteFromSessionObject, removeSessionObject 
};
