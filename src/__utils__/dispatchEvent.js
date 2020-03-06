
export const DispatchEvent = (eventName, config) => {
  const ev = new CustomEvent(eventName, config);
  window.dispatchEvent(ev);
};

export default DispatchEvent;
