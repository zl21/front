import axios from 'axios';

import network, { urlSearchParams } from '../__utils__/network';
// import window.vm.$router.from '../__config__/router.config';

export default async function data() {
  // ....
  let a = [];
  await 
  network.post('api', {
    businessCode: window.vm.$router.currentRoute.params.itemId,
    userId: JSON.parse(window.localStorage.getItem('userInfo')).id,
    businessType: window.vm.$router.currentRoute.params.tableId,
    isApprover: window.vm.$router.currentRoute.query.isApprover
  })
    .then((res) => {
      if (res.data.resultCode === 0) {
        a = [
          {
            expand: false, // 是否开启
  
            title: 'ceshi',
            TREENO: 2,
            MIXNAME: '[001]ceshi',
            ECODE: '001',
            RIGHTVALUE: 12,
            ID: 2,
            LEFTVALUE: 1,
            clickNode: true,
            children: [
              {
                title: 'CYX内部组织档案',
                TREENO: 2,
                MIXNAME: '[10001]CYX内部组织档案',
                ECODE: '10001',
                RIGHTVALUE: 7,
                ID: 7,
                CP_C_ORGUP_ID: 2,
                LEFTVALUE: 4,
                lastChild: false,
                expand: false, // 是否开启
  
                children: [
                  {
                    title: '销售部',
                    TREENO: 2,
                    MIXNAME: '[011]销售部',
                    ECODE: '011',
                    RIGHTVALUE: 6,
                    ID: 13,
                    CP_C_ORGUP_ID: 7,
                    LEFTVALUE: 5,
                    lastChild: true,
                    children: [],
                    expand: false, // 是否开启
  
                  }
                ]
              },
              {
                title: '11',
                TREENO: 2,
                MIXNAME: '[11]11',
                ECODE: '11',
                RIGHTVALUE: 9,
                ID: 10,
                CP_C_ORGUP_ID: 2,
                LEFTVALUE: 8,
                lastChild: false,
                children: [],
                expand: false, // 是否开启
  
              },
              {
                title: '12',
                TREENO: 2,
                MIXNAME: '[12]12',
                ECODE: '12',
                RIGHTVALUE: 3,
                ID: 1,
                CP_C_ORGUP_ID: 2,
                LEFTVALUE: 2,
                lastChild: false,
                children: [],
                expand: false, // 是否开启
  
              },
              {
                expand: false, // 是否开启
  
                title: 'llnlin',
                TREENO: 2,
                MIXNAME: '[LINLIN]llnlin',
                ECODE: 'LINLIN',
                RIGHTVALUE: 11,
                ID: 12,
                CP_C_ORGUP_ID: 2,
                LEFTVALUE: 10,
                lastChild: true,
                children: []
              }
            ]
          }
        ];
      }
    });
  return a;
}
// export const data = () => { 
//   const a = [
//     {
//       expand: false, // 是否开启
  
//       title: 'ceshi',
//       TREENO: 2,
//       MIXNAME: '[001]ceshi',
//       ECODE: '001',
//       RIGHTVALUE: 12,
//       ID: 2,
//       LEFTVALUE: 1,
//       clickNode: true,
//       children: [
//         {
//           title: 'CYX内部组织档案',
//           TREENO: 2,
//           MIXNAME: '[10001]CYX内部组织档案',
//           ECODE: '10001',
//           RIGHTVALUE: 7,
//           ID: 7,
//           CP_C_ORGUP_ID: 2,
//           LEFTVALUE: 4,
//           lastChild: false,
//           expand: false, // 是否开启
  
//           children: [
//             {
//               title: '销售部',
//               TREENO: 2,
//               MIXNAME: '[011]销售部',
//               ECODE: '011',
//               RIGHTVALUE: 6,
//               ID: 13,
//               CP_C_ORGUP_ID: 7,
//               LEFTVALUE: 5,
//               lastChild: true,
//               children: [],
//               expand: false, // 是否开启
  
//             }
//           ]
//         },
//         {
//           title: '11',
//           TREENO: 2,
//           MIXNAME: '[11]11',
//           ECODE: '11',
//           RIGHTVALUE: 9,
//           ID: 10,
//           CP_C_ORGUP_ID: 2,
//           LEFTVALUE: 8,
//           lastChild: false,
//           children: [],
//           expand: false, // 是否开启
  
//         },
//         {
//           title: '12',
//           TREENO: 2,
//           MIXNAME: '[12]12',
//           ECODE: '12',
//           RIGHTVALUE: 3,
//           ID: 1,
//           CP_C_ORGUP_ID: 2,
//           LEFTVALUE: 2,
//           lastChild: false,
//           children: [],
//           expand: false, // 是否开启
  
//         },
//         {
//           expand: false, // 是否开启
  
//           title: 'llnlin',
//           TREENO: 2,
//           MIXNAME: '[LINLIN]llnlin',
//           ECODE: 'LINLIN',
//           RIGHTVALUE: 11,
//           ID: 12,
//           CP_C_ORGUP_ID: 2,
//           LEFTVALUE: 10,
//           lastChild: true,
//           children: []
//         }
//       ]
//     }
//   ];
//   async function jflowButtons(id, callback, pid, flag, active, isApprover) { // jflow按钮逻辑处理
//     await new Promise((resolve) => {
//       network.post('/jflow/p/cs/task/buttons', {
//         businessCode: id,
//         userId: JSON.parse(window.localStorage.getItem('userInfo')).id,
//         businessType: pid || window.vm.$router.currentRoute.params.tableId,
//         isApprover: isApprover || window.vm.$router.currentRoute.query.isApprover
//       })
//         .then((res) => {
//           if (res.data.resultCode === 0) {
//             callback(res);
//           }
//           resolve(res);
//         });
//     });
//   }
//   jflowButtons(router.currentRoute.params.itemId, () => a);

//   // function demo1(params, callback) {
//   //   let result = 1;
//   //   $.ajax({
//   //     url: 'test.do',
//   //     type: 'post',
//   //     data: { 'params ': params },
//   //     async: true,
//   //     success(data) {
//   //       result = 2;
//   //       callback(result);
//   //     }
//   //   });
//   // }    

//   // demo1('Value', (rs) => {
//   //   // do someting
//   // });
// };

// // };
// export default { data };
