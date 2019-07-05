
export const DispatchEvent = (event, config) => {
  // (() => {
  //   window[event] = function () {
  //     new CustomEvent(event, config);
  //   };
  // })();

  const ev = new CustomEvent(event, config);
  // window[event] = ev;
  window.dispatchEvent(ev);
};

export default DispatchEvent;
