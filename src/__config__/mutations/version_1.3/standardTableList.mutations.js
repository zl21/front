import { getSessionObject } from '../../../__utils__/sessionStorage';
import router from '../../router.config';
import getComponentName from '../../../__utils__/getModuleName';

export default {
  updataSelectIdArr(state, id) {
    state.selectIdArr.push(id);
  },
  updateFailInfo({ ag }, failInfo) {
    ag.datas.deleteFailInfo = failInfo;
    ag.datas = Object.assign({}, ag.datas);
  },
  updateTableDataWithMerge({ ag }, data) {
    ag.datas.row = data.row;
  },
  updateTableData({
    ag
  }, data) {
    ag.datas = data;
  },
  updateTableStatus4css({
    ag
  }, data) {
    if (data && data.tableurl) {
      ag.tableurl = data.tableurl;
    }
    ag.status4css = data.status4css;
    ag.key_group = data.key_group;
    ag.pinnedColumns = data.webconf && data.webconf.pinnedColumns
  },
  // setAgTableErrorMessage({ ag }, errorData) { // ag iconfont
  //   ag.datas.deleteFailInfo = Object.assign({}, ag.datas.deleteFailInfo, errorData);
  //   console.log( ag.datas.deleteFailInfo )
  // },

  // 表单
  updateDefaultFormItemsLists({ formItems }, {data, indexDB}) {
    const { tableId } = router.currentRoute.params;

    const getSTDefaultQuery = getSessionObject(tableId);
    if (data && data.length > 0 && getSTDefaultQuery && getSTDefaultQuery.length > 0) {
      getSTDefaultQuery.map((c) => {
        data.map((d) => {
          if (Number(c.colid) === Number(d.colid)) {
            d.default = c.defaultValue;
            if (c.display && c.display === 'OBJ_FK') { // 如果是外键类型，需要配置refobjid
              d.refobjid = c.refobjid;
            } else if (c.display && c.display === 'OBJ_DATE') {
              d.daterange = c.defaultValue;
            }
          }
        });
      });
    }

    // 处理indexDB的默认值
    if(indexDB && data && data.length > 0){
      Object.keys(indexDB).map((c) => {
        data.map((d) => {
          if (c === d.colname && indexDB[c]) {
            d.default = indexDB[c];
            if (d.display && d.display === 'OBJ_FK') { // 如果是外键类型，需要配置refobjid
             if(Array.isArray(indexDB[c]) && indexDB[c][0]){
              d.refobjid = indexDB[c][0].ID;
              d.default = indexDB[c][0].Label;
             }
            }
            
            if (d.display && ['OBJ_DATENUMBER','OBJ_DATE'].includes(d.display)) {
              d.daterange = new Date().dateMinus(indexDB[c][1],indexDB[c][0]);
              d.default = new Date().dateMinus(indexDB[c][1],indexDB[c][0]);
            }

            if (d.display && d.display === 'OBJ_SELECT') {
              if(Array.isArray(indexDB[c])){
                d.default = indexDB[c].join(',');
              }else{
                d.default = indexDB[c];
              }
            }
          }
        });
      });
    }
    formItems.defaultFormItemsLists = data;
  },
  updateFormData({
    formItems
  }, data) {
    formItems.data = data;
  },
  updateFormAssignData({
    formItems
  }, data) {
    formItems.data = Object.assign(formItems.data,data);
  },
  updateDefaultSearchFoldnum({ formItems }, data) {
    formItems.searchFoldnum = data;
  },
  updateFormAssignData({
    formItems
  }, data) {
    formItems.data = Object.assign(formItems.data,data);
  },
  // 按钮组
  updataIsBig({ buttons }, value) {
    buttons.isBig = value; // 更新是否为海量表
  },
  updatestopOnRowDoubleClickData({
    buttons
  }, data) {
    buttons.onRowDoubleClick = data;
  },
  updateButtonsTabcmd({
    buttons
  }, data) {
    buttons.tabcmd = data;
  },
  updateButtonWaListButtons({ buttons }, data) { // 获取静默类型的按钮数据
    if (data) {
      data.forEach((item, index) => {
        if (item.ishide) {
          data.splice(index);
        }
        buttons.isrefrsh = item.isrefrsh;
      });
    }

    const parentDatas = [];
    const childrenDatas = [];

    if (data && data.length > 0) {
      data.forEach((item) => {
        if (item.actionid || item.actionid == 0) {
          item.childrens = [];
          parentDatas.push(item);
        } else {
          childrenDatas.push(item);
        }
      }); 
    }
   
    childrenDatas.forEach((d) => {
      parentDatas.forEach((parent) => {
        if (d.webid === parent.webid) {
          d.isFold = true;
          parent.childrens.push(d);
        } 
      });
    });
    const waListButtons = childrenDatas.filter(child => !child.isFold);

    buttons.dataArray.waListButtonsConfig.waListButtons = waListButtons;
    buttons.dataArray.waListButtonsConfig.waListButtonsGroup = parentDatas;// 折叠按钮
  },
  collectTablelist({ buttons }) { // 判断页面加载时收藏按钮状态
    const tableName = this.state.global.activeTab.tableName;
    const favorite = this.state.global.favorite;
    favorite.forEach((element) => {
      if (element.value === tableName) {
        buttons.dataArray.collectiImg = true;
      }
    }); 
  },
  updateDefaultButtonsdatas({
    buttons
  }, data) {
    buttons.isBig = data.isbig; // 是否为海量表
    buttons.isBigStatus = data.isbig; // 是否为海量表
    buttons.isSolr = data.isolr; // 是否获取合计
    buttons.showBigDefaultIcon = data.isbig;
    buttons.tabledesc = buttons.tabcmd.desc;
    buttons.tableId = data.tableid;
    buttons.tableName = data.table;
    // 双击条状判断
    buttons.objTableUrl = data.tableurl;
  },
  setActiveTabActionValue({
    buttons
  }, obj) {
    buttons.activeTabAction = obj;
  },
  updateButtonExeActionData({ buttons }, message) {
    buttons.ExeActionData = message;
  },
  updateButtonGetActionData({ buttons }, data) {
    buttons.ExeActionDataForComponent = data;
  },
  updateButtonSetFavoriteData({ buttons }, data) { // 收藏
    buttons.dataArray.collectiImg = !buttons.dataArray.collectiImg;
    this.state.global.favorite = data.data;
  },
  setPrintValueForButtons({ buttons }, value) { // 控制打印按钮开关
    buttons.dataArray.printValue = value;
  },
  updateDefaultButtonGroupData({ buttons }, data) {
    buttons.dataArray.buttonGroupShowConfig.buttonGroupShow = data;
  },
  onSelectionChangedAssignment({ buttons }, { rowIdArray, rowArray }) {
    if (this._mutations[`${getComponentName()}/filterButtonsForDisable`] && this._mutations[`${getComponentName()}/filterButtonsForDisable`].length && this._mutations[`${getComponentName()}/filterButtonsForDisable`].length > 0) {
      this._mutations[`${getComponentName()}/filterButtonsForDisable`][0](rowArray);
    }
    buttons.selectIdArr = rowIdArray;
    buttons.selectArr = rowArray;
  },
  setImportDialogTitle({ buttons }, value) { // 导出操作
    buttons.importData.importDialog = value;
    buttons.importData.importDialogTitle = this.state.global.activeTab.label;
  },
  closeImportDialog({ buttons }) { // 导出操作
    buttons.importData.importDialog = false;
  },
  updateButtonImportGetUploadParameters({ buttons }, data) { // 获取导入上传参数
    buttons.importParameters = data;
  },
  updateButtonDownloadImportTemplate({ buttons }, data) {
    buttons.importTemplate = data;
  },
  updateButtonDeleteData({ buttons, ag }, data) {
    buttons.batchDeleteData = data;
    ag.datas.deleteFailInfo = data.data;
    ag.datas = Object.assign({}, ag.datas);
  },
  setErrorModalValue({ buttons }, {
    title, contentText, footerHide 
  }) { // 设置error弹窗提示信息
    buttons.dialogConfig = {
      title,
      footerHide,
      contentText,
      mask: true
    };
  },
  setActionDialog({ buttons }, obj) {
    // buttons.actionDialog.queryString = obj.action.split('/')[1];
    buttons.actionDialog.show = true;
    buttons.actionDialog.title = obj.webdesc;
  },
  updateButtonbatchSubmitData({ buttons, ag }, data) { // 批量提交
    buttons.batchSubmitData = data;
    ag.datas.deleteFailInfo = data;
    ag.datas = Object.assign({}, ag.datas);
  },
  updateButtonbatchUnSubmitData({ buttons, ag }, data) { // 批量反提交
    buttons.batchUnSubmitData = data;
    ag.datas.deleteFailInfo = data;
    ag.datas = Object.assign({}, ag.datas);
  },
  batchVoidForButtonsData({ buttons, ag }, data) { // 作废
    buttons.batchVoidForButtonsData = data;
    ag.datas.deleteFailInfo = data;
    ag.datas = Object.assign({}, ag.datas);
  },
  updateUserConfig(state, { userConfig }) {
    // state.hideColumn = userConfig.hideColumn;
    // state.colPosition = userConfig.colPosition;
    // state.fixedColumn = userConfig.fixedColumn;
    // 将控制隐藏列、列顺序、固定列等信息统一由state.userConfigForAgTable控制
    if (userConfig) {
      state.userConfigForAgTable = {
        hideColumn: userConfig.hideColumn,
        colPosition: userConfig.colPosition,
        fixedColumn: userConfig.fixedColumn
      };
    }
  },
  updateAgConfig(state, { key, value }) {
    // e.g: state['hideColumn'] = [];
    // e.g: state['colPosition'] = '';
    // e.g: state['fixedColumn'] = '';
    state.userConfigForAgTable = Object.assign({}, state.userConfigForAgTable, {
      [key]: value
    });
  },
  updateButtonsExport({ buttons }, data) { // 导出
    buttons.exportdata = data;
  },
  updateWebconfCommonTable({ webconf }, data) {
    webconf.commonTable = data.commonTable;
  }, // 修改state中commonTable的值
 
  updateWebconfDynamicRouting({ webconf }, data) {
    webconf.dynamicRouting = data.dynamicRouting;
  }, // 修改state中dynamicRouting的值
  updataWebConf(state, data) {
    state.webConf = data;
  },
  updateTabParam(state, data) { // 更新当前tab参数
    if (data.index) {
      state.ag.filterTableData.multi_tab[data.index].startIndex = data.startIndex;
      state.ag.filterTableData.multi_tab[data.index].range = data.range;
    }
  },
  resetTabParam(state) { // 重置所有tab分页数据
    if (state.ag.tablequery.multi_tab && state.ag.tablequery.multi_tab.length > 0) {
      state.ag.tablequery.multi_tab.map((tab, i) => {
        tab.startIndex = 0;
      });
    }
  },
  updateFilterTableData(state, data) { // 更新filterTableData
    state.ag.tablequery = Object.assign(state.ag.tablequery, data);
  },
  updateFilterButtons(state, data) { // 更新按钮筛选数据
    state.ag.filterButtons = data;
  },
 
  resetButtonsStatus({ buttons }) {
    const waListButtonsConfig = buttons.dataArray.waListButtonsConfig;// 折叠按钮
    const waListButtonsGroup = waListButtonsConfig.waListButtonsGroup;
    const waListButtons = waListButtonsConfig.waListButtons;
    const fun = (data) => {
      if (data && data.length > 0) {
        data.reduce((arr, obj) => {
          if (obj.childrens) {
            obj.childrens.map((c) => {
              if (c.disabled) {
                c.disabled = false;
              }
            });
          } else {
            obj.disabled = false;
          }
          return arr;
        }, []);
      }
    };  
    fun(waListButtonsGroup);
    fun(waListButtons);
  },
  filterButtonsForDisable({ buttons, ag }, rowArray) { // 根据条件过滤按钮disable状态
    this._mutations[`${getComponentName()}/resetButtonsStatus`][0]();
  
    // 整合过滤数据
    let filterButtonsRest = {};
    let filterData = {};
    let colname = '';
    const tabth = ag.datas.tabth && ag.datas.tabth.length ? ag.datas.tabth : [];
    if (ag.filterButtons && ag.filterButtons.length > 0) {
      filterButtonsRest = ag.filterButtons.reduce((arr, obj,) => {
        filterData = obj.filter.reduce((acc, cur) => {
          tabth.forEach((t) => {
            if (Number(t.col_id) === Number(cur.col_id)) {
              colname = t.colname; 
            }
          });
          acc[colname] = cur.match_value;
          acc.actionId = obj.action_id;
          return acc;
        }, {});
        arr.push(filterData);
        return arr;
      }, []);
      
      const filterConditionArr = Object.values(filterButtonsRest)
      let keys = []
      if(filterConditionArr.length > 0) {
        filterConditionArr.forEach(obj => {
          const objKeys = Object.keys(obj)
          objKeys.forEach(key => {
            if(key !== 'actionId' && !keys.includes(key)) {
              keys.push(key)
            }
          })
        })
      }
      const disabledId = [];
      filterConditionArr.reduce((arr, obj) => {
        rowArray.forEach((row) => { // 所有选中行数据
          const conditionNum = [];

          keys.forEach(key => {
            if(row[key] && obj[key]) {
              if (obj[key].split(',').includes(row[key].val)) {
                conditionNum.push(obj.actionId);
              }
            }
          })
          if (Object.keys(obj).length - 1 === conditionNum.length && conditionNum.length > 0) {
            disabledId.push(...conditionNum)
          }

          // Object.keys(row).forEach((rowKey) => {
          //   if (obj.hasOwnProperty(rowKey)) {
          //     if (obj[rowKey].split(',').includes(row[rowKey].val)) {
          //       conditionNum.push(obj.actionId);
          //     }
          //   }
          // });
          // if (Number(Object.keys(obj).length) - 1 === Number(conditionNum.length)) {
          //   buttons.disableButtons = buttons.disableButtons.concat(conditionNum);
          // }
        });
      }, []);

      if (disabledId.length > 0) {
        buttons.disableButtons = buttons.disableButtons.concat([...new Set(disabledId)]);
      }

      // 处理按钮不可编辑逻辑
      const waListButtonsConfig = buttons.dataArray.waListButtonsConfig;// 折叠按钮
      const waListButtonsGroup = waListButtonsConfig.waListButtonsGroup;
      const waListButtons = waListButtonsConfig.waListButtons;
      const buttonsArr = waListButtonsGroup.concat(waListButtons);
      const disableButtonsRes = JSON.parse(JSON.stringify(buttons.disableButtons));
      buttonsArr.reduce((arr, obj) => {
        if (obj.childrens) {
          obj.childrens.map((c) => {
            if (disableButtonsRes.filter(b => Number(b) === Number(c.webid)).length > 0) {
              c.disabled = true;
              console.log(22, c.webdesc);
            } else {
              c.disabled = false;
            }
          });
        } else if (disableButtonsRes.filter(b => Number(b) === Number(obj.webid)).length > 0) {
          console.log(22, obj.webdesc);

          obj.disabled = true;
        } else {
          obj.disabled = false;
        }
        return arr;
      }, []);
    }
  }
  
};
