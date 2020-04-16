
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
//  externalTreeDatas: { // 树形结构列表配置数据信息入口
//  }


// 注意：返回值中的所有ENAME字段请改为title
export default {
  C_STORE: () => async () => {
    // ....
    const treeData = {
      data: [],
      name: 'ID'
    };
    treeData.data = [
      {
        expand: false, // 是否开启
        title: '测试one',
        TREENO: 2,
        MIXNAME: '[001]ceshi',
        ECODE: '001',
        RIGHTVALUE: 12,
        ID: null,
        LEFTVALUE: 1,
        clickNode: true,
        children: [
          {
            title: '牛',
            TREENO: 2,
            MIXNAME: '[10001]CYX内部组织档案',
            ECODE: '10001',
            RIGHTVALUE: 7,
            ID: null,
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
                ID: null,
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
            ID: null,
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
            ID: null,
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
            ID: null,
            CP_C_ORGUP_ID: 2,
            LEFTVALUE: 10,
            lastChild: true,
            children: []
          }
        ]
      },
      {
        expand: false, // 是否开启
  
        title: 'ceshiTow',
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
                title: '羊',
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
            title: '333',
            TREENO: 2,
            MIXNAME: '[11]11',
            ECODE: '11',
            RIGHTVALUE: 9,
            ID: null,
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
            ID: null,
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
            ID: 666,
            CP_C_ORGUP_ID: 2,
            LEFTVALUE: 10,
            lastChild: true,
            children: []
          }
        ]
      },
      {
        expand: false, // 是否开启
  
        title: 'ceshiThree',
        TREENO: 2,
        MIXNAME: 'ceshiThree',
        ECODE: '001',
        RIGHTVALUE: 12,
        ID: 2,
        LEFTVALUE: 1,
        clickNode: true,
        children: [
          {
            title: '44',
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
                title: '444',
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
      },
      {
        expand: false, // 是否开启
  
        title: 'ceshiFour',
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
                title: '销售部9',
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
      },
     
    ];
    // await 
    // network.post('api',)
    //   .then((res) => {
    //     if (res.data.resultCode === 0) {
    //       treeData.data = [
    //         {
    //           expand: true, // 是否开启
    //           title: 'ceshi',
    //           TREENO: 2,
    //           MIXNAME: '[001]ceshi',
    //           ECODE: '001',
    //           RIGHTVALUE: 12,
    //           ID: 2,
    //           LEFTVALUE: 1,
    //           clickNode: true,
    //           children: [
    //             {
    //               title: 'CYX内部组织档案CYX',
    //               TREENO: 2,
    //               MIXNAME: '[10001]CYX内部组织档案',
    //               ECODE: '10001',
    //               RIGHTVALUE: 7,
    //               ID: 7,
    //               CP_C_ORGUP_ID: 2,
    //               LEFTVALUE: 4,
    //               lastChild: false,
    //               expand: true, // 是否开启
    //             },
    //           ]
    //         }
    //       ];
    //     }
    //   });
  
    return treeData;
  }, // return  调用接口，同步请求，返回Promice，可直接复制原1.3框架接口请求逻辑  
  // 接口报错提示框
  // window.R3message({
  //   title: '错误',
  //   content: '接口错误信息',
  //   mask: true
  // });

};
