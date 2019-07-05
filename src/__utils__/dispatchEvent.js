

// // function dispatchEvent() {
// //   // window.a = function (a, b) {
// //   //   this.console.log(a, b);
// //   // };
// // }
// // const dispatch = new dispatchEvent();


// // export default dispatch;

// // const DispatchEvent = (url, config) => {
// //   console.log(a, b);
// //   // (() => {
// //   //   const defining = { a() { }, b() { }, c() { } }; 
// //   //   Object.keys(defining).forEach((key) => {
// //   //     window[key] = defining[key];
// //   //   });
// //   // })();
// // };
// export const DispatchEvent = (event, config) => {
//   // (() => {
//   // window[event] = function (a) {
//   //   a = config;
//   // };
//   // })();

//   // window.addEventListener(event, (config) => { console.log('🍓', config); });
//   window.addEventListener("myEvent", function(e) { console.log(e.detail) });
//   var event = new CustomEvent("myEvent", {"detail":{"username":123}});

// };
// // const dispatchEvent = new DispatchEvent();

// export default DispatchEvent;
