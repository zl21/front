
export const DispatchEvent = (event, config) => {
  const ev = new CustomEvent(event, config);
  window.dispatchEvent(ev);
};

export default DispatchEvent;
