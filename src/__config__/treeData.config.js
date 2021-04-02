

import network from '../__utils__/network';
import json from './treeData.json';

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
  // value：框架传入的参数，模糊查询的字符
  SHANGPIN: value => async () => {
    // ....
    const treeData = {
      data: [], // 树结构列表数据
      // name: 'eeee', // 定义查询参数
      query: {// 支持配置多参数
        name: 'NAME', // 参数中的key:需要筛选的字段
        id: 'ID'
      },
      placeholder: '88', // placeholder自定义
      searchData: {// 定义查询接口参数
        table: '1111',
        value: 'value'
      }

    };
    // await network.post('api',)
    //   .then((res) => {
    //     if (res.data.resultCode === 0) {
    //       treeData.data = json.data;
    //     }
    //   });
    treeData.data = json.data;
  
    return treeData;
  }, // return  调用接口，同步请求，返回Promice，可直接复制原1.3框架接口请求逻辑  
  // 接口报错提示框
  // window.R3message({
  //   title: '错误',
  //   content: '接口错误信息',
  //   mask: true
  // });

};
