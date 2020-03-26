
import data from '../treeData/cp_c_inorg';

import router from './router.config';
import network from '../__utils__/network';

// 需要在配置文件中加入externalTreeDatas配置

// 配置文件中相关属性说明：

// keyOne：1.3版本框（快鱼所用的框架源码中）custompage.js配置文件中的name属性值
// （所有处理接口以及返回值的逻辑可以在回调函数中处理，此回调必须有返回值，如无数据可返回[]）

// eg:
// { name: 'CP_C_HRUSERS', filePath: 'action/cp_c_hrusers', label: '权限配置-用户档案' },//权限配置-用户档案
// { name: 'CP_C_OUTORG', filePath: 'action/cp_c_outorg', label: '人员信息-伙伴组织' },//人员信息-伙伴组织
// { name: 'CP_C_GROUPS', filePath: 'action/cp_c_groups', label: '人员信息-用户组' },//人员信息-角色
// { name: 'CP_C_INORG', filePath: 'action/cp_c_inorg', label: '人员信息-组织' },//人员信息-内部组织
// { name: 'CP_C_SUPPLIER', filePath: 'action/cp_c_supplier', label: '供应商-供应商档案' },//供应商-供应商档案
// { name: 'CP_C_RSTORE', filePath: 'action/cp_c_warehouse', label: '供应商-门店档案' },//供应商-门店档案
// // { name: 'CP_C_STOREORG', filePath: 'action/cp_c_storeorg', label: '供应商-店仓业务组织' },//供应商-店仓业务组织
// { name: 'CP_C_EMP', filePath: 'action/cp_c_emp', label: '人员中心-员工档案' },//供应商-店仓业务组织


//  externalTreeDatas: { // 树形结构列表配置数据信息入口
//       keyOne: ()=>{},
//       keyTwo: ()=>{},
//  }


// 注意：返回值中的所有ENAME字段请改为title
export default {
  AD_TABLE: () => async () => {
    // ....
    const treeData = {
      data: [],
      name: 'ID'
    };
      
    // await 
    // network.post('api', {
    //   businessCode: router.currentRoute.params.itemId,
    //   userId: JSON.parse(window.localStorage.getItem('userInfo')).id,
    //   businessType: router.currentRoute.params.tableId,
    //   isApprover: router.currentRoute.query.isApprover
    // })
    //   .then((res) => {
    //     if (res.data.resultCode === 0) {
         
    //     }
    //   });
    treeData.data = [
      {
        expand: true, // 是否开启
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
            title: 'CYX内部组织档案CYX内部组织档案CYX内部组织档案CYX内部组织档案CYX内部组织档案CYX内部组织档案CYX内部组织档案CYX内部组织档案CYX内部组织档案',
            TREENO: 2,
            MIXNAME: '[10001]CYX内部组织档案',
            ECODE: '10001',
            RIGHTVALUE: 7,
            ID: 7,
            CP_C_ORGUP_ID: 2,
            LEFTVALUE: 4,
            lastChild: false,
            expand: true, // 是否开启
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
                expand: true, // 是否开启
  
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
            expand: true, // 是否开启
  
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
            expand: true, // 是否开启
  
          },
          {
            expand: true, // 是否开启
  
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
      },
      {
        expand: true, // 是否开启
  
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
            expand: true, // 是否开启
  
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
                expand: true, // 是否开启
  
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
            expand: true, // 是否开启
  
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
            expand: true, // 是否开启
  
          },
          {
            expand: true, // 是否开启
  
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
      },
      {
        expand: true, // 是否开启
  
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
            expand: true, // 是否开启
  
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
                expand: true, // 是否开启
  
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
            expand: true, // 是否开启
  
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
            expand: true, // 是否开启
  
          },
          {
            expand: true, // 是否开启
  
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
      },
      {
        expand: true, // 是否开启
  
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
            expand: true, // 是否开启
  
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
                expand: true, // 是否开启
  
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
            expand: true, // 是否开启
  
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
            expand: true, // 是否开启
  
          },
          {
            expand: true, // 是否开启
  
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
      },
      {
        expand: true, // 是否开启
  
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
            expand: true, // 是否开启
  
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
                expand: true, // 是否开启
  
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
            expand: true, // 是否开启
  
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
            expand: true, // 是否开启
  
          },
          {
            expand: true, // 是否开启
  
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
      },
      {
        expand: true, // 是否开启
  
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
            expand: true, // 是否开启
  
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
                expand: true, // 是否开启
  
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
            expand: true, // 是否开启
  
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
            expand: true, // 是否开启
  
          },
          {
            expand: true, // 是否开启
  
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
      },
      {
        expand: true, // 是否开启
  
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
            expand: true, // 是否开启
  
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
                expand: true, // 是否开启
  
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
            expand: true, // 是否开启
  
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
            expand: true, // 是否开启
  
          },
          {
            expand: true, // 是否开启
  
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
      },
      {
        expand: true, // 是否开启
  
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
            expand: true, // 是否开启
  
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
                expand: true, // 是否开启
  
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
            expand: true, // 是否开启
  
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
            expand: true, // 是否开启
  
          },
          {
            expand: true, // 是否开启
  
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
      },
      {
        expand: true, // 是否开启
  
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
            expand: true, // 是否开启
  
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
                expand: true, // 是否开启
  
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
            expand: true, // 是否开启
  
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
            expand: true, // 是否开启
  
          },
          {
            expand: true, // 是否开启
  
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
      },
      {
        expand: true, // 是否开启
  
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
            expand: true, // 是否开启
  
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
                expand: true, // 是否开启
  
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
            expand: true, // 是否开启
  
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
            expand: true, // 是否开启
  
          },
          {
            expand: true, // 是否开启
  
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
    return treeData;
  }, // return  调用接口，同步请求，返回Promice，可直接复制原1.3框架接口请求逻辑  
  // 接口报错提示框
  // window.R3message({
  //   title: '错误',
  //   content: '接口错误信息',
  //   mask: true
  // });
  
  // BCP_CUSTOMER_JFLOW: () => {
    
  //   // 接口报错提示框
    
  //   // return  调用接口，返回整理好的数据，可直接复制原1.3框架接口请求逻辑
  // }
};
