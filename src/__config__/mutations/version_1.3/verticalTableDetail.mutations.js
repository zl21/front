import { stringify } from 'querystring';
// import { cpus } from 'os';
import router from '../../router.config';
import { enableOpenNewTab } from '../../../constants/global';


export default {
  updataClickSave(state, func) {
    state.clickSaveFunction = func;
  },
  testUpdataValue(state, func) {
    state.testUpdata = func;
  },
  updataVerifyRequiredInformation(state, func) {
    state.updataVerifyRequiredInformation = func;
  },
  updataHideTempStorage(state, value) { // 控制单对象界面暂存按钮
    state.isHideTempStorage = value;
  },
  updateObjectForMainTableForm(state, data) { // 更新主表面板数据
    const { tableName, tableId } = router.currentRoute.params;
    state.mainFormInfo.tablename = tableName;
    state.mainFormInfo.tableid = tableId;
    state.mainFormInfo.formData.isShow = data && data.addcolums && data.addcolums.length > 0;
    state.mainFormInfo.formData.data = Object.assign({}, data);

    let addValue = {};
    if (enableOpenNewTab() && state.updateData[tableName] && state.updateData[tableName].default) {
      addValue = state.updateData[tableName].default[tableName];
    }
    state.updateData[tableName] = {
      add: Object.assign({}, { [tableName]: addValue }),
      modify: Object.assign({}, { [tableName]: {} }),
      modifyLabel: Object.assign({}, { [tableName]: {} }),
      delete: Object.assign({}, { [tableName]: {} }),
      default: {},
      defaultLabel: {},
      checkedInfo: {},
      changeData: {}
      // Object.assign({}, state.updateData[tableName] ? state.updateData[tableName].changeData : {}) // 表单修改的值，第二次回显用
    };
  },
  updatePanelData(state, data) { // 更新子表面板数据
    if (data.id) {
      state.itemObjId = data.id;
    }
    const { componentAttribute } = state.tabPanels[data.tabIndex];
    componentAttribute.panelData.isShow = true;
    componentAttribute.panelData.data = data;
  },
  updateMainTabPanelsData(state, data, itemTabelPageInfo) { // 更新主表tab数据
    const arr = [];
    data.reftabs.sort((a, b) => a.order - b.order);
    data.reftabs.forEach((item) => {
      const obj = { ...item };
      obj.label = item.tabledesc;
      obj.componentAttribute = {
        buttonsData: {
          isShow: false,
          data: ({})
        },
        formData: {
          isShow: false,
          data: ({})
        },
        panelData: {
          isShow: false,
          data: ({})
        },
        tableData: {
          isShow: false,
          data: ({})
        }
      };
      state.updateData[item.tablename] = {
        add: Object.assign({}, { [item.tablename]: {} }),
        modify: Object.assign({}, { [item.tablename]: {} }),
        modifyLabel: Object.assign({}, { [item.tablename]: {} }),
        itemBeforeLabel: Object.assign({}, { [item.tablename]: {} }), // 子表表格改以前的label
        delete: Object.assign({}, { [item.tablename]: {} }),
        addDefault: Object.assign({}, { [item.tablename]: {} }),
        default: {},
        defaultLabel: {},
        checkedInfo: {},
        changeData: {}
        //  Object.assign({}, state.updateData[item.tablename] ? state.updateData[item.tablename].changeData : {}) // 表单修改的值，第二次回显用
      };
      obj.tableSearchData = {
        selectedValue: '',
        inputValue: ''
      }; // 表格搜索的数据
      obj.tablePageInfo = {
        currentPageIndex: itemTabelPageInfo ? itemTabelPageInfo.currentPageIndex : 1,
        pageSize: itemTabelPageInfo ? itemTabelPageInfo.pageSize : 10
      }; // 表格的页码和每页多少条
      arr.push(obj);
    });
    state.tabPanels = arr;
  },
  updateMainButtonsData(state, data) { // 更新主表按钮数据
    if (data && data.tabcmd && data.tabcmd.cmds) {
      const { itemId } = router.currentRoute.params;
      data.tabcmd.cmds.some((b, i) => {
        if (b === 'actionMODIFY') {
          let index = '';
          if (itemId === 'New') {
            index = 0;
          } else {
            index = i;
          }
          state.saveInfo = {
            paths: data.tabcmd.paths && data.tabcmd.paths.length > 0 ? data.tabcmd.paths[index] : null,
            name: 'actionMODIFY',
            jflowPath: data.tabcmd.jflowpaths && data.tabcmd.jflowpaths.length > 0 ? data.tabcmd.jflowpaths[index] : null,

          };
        }
      });
    }
    // state.mainFormInfo.buttonsData.isShow = true;
    state.defaultButtonData = JSON.parse(JSON.stringify(data));
    if (!state.instanceId) {
      state.mainFormInfo.buttonsData.data = data;
    }
  },
  updateRefButtonsData(state, data) { // 更新子表按钮数据
    const { componentAttribute } = state.tabPanels[data.tabIndex];
    if (data.jflowButton && data.jflowButton.length > 0) {
      componentAttribute.buttonsData.isShow = true;
      componentAttribute.buttonsData.data.isItemTableVertical = true;
      componentAttribute.buttonsData.data = data;
    } else {
      // componentAttribute.buttonsData.isShow = false;
      componentAttribute.buttonsData.data = data;
      // componentAttribute.buttonsData.data.isItemTableVertical = true;
    }
  },
  updateFormDataForRefTable(state, data) { // 更新子表表单数据
    const { componentAttribute } = state.tabPanels[data.tabIndex];
    componentAttribute.formData.isShow = data.inpubobj && data.inpubobj.length > 0;
    componentAttribute.formData.data = data || [];
  },
  updateFormDataForRefshow(state) { // 去除子表缓存
    state.mainFormInfo.formData.isShow = false;
  },
  updateTableListForRefTable(state, data) { // 更新子表列表数据
    const { componentAttribute } = state.tabPanels[data.tabIndex] || {};
    if (componentAttribute) {
      componentAttribute.tableData.isShow = data.tabth && data.tabth.length > 0;
      componentAttribute.tableData.data = data;
    }
  },
  updateTabCurrentIndex(state, index) { // 更新当前tab的索引
    state.tabCurrentIndex = index;
  },
  updateDefaultData(state, data) {
    if (state.updateData && state.updateData[data.tableName] && state.updateData[data.tableName].default) {
      state.updateData[data.tableName].default = data.value;
    }
  },
  updateDefaultLabelData(state, data) {
    if (state.updateData && state.updateData[data.tableName] && state.updateData[data.tableName].defaultLabel) {
      state.updateData[data.tableName].defaultLabel = data.value;
    }
  },
  updateAddData(state, data) {
    if (state.updateData[data.tableName]) {
      if (Object.values(data.value).length === 0) {
        state.updateData[data.tableName].add[data.tableName] = {};
      } else {
        state.updateData[data.tableName].add[data.tableName] = Object.assign({}, state.updateData[data.tableName].add[data.tableName], data.value[data.tableName]);
      }
    }
  },
  seleteAddData(state, data) { // 删除状态里add的空值
    // key,需要删除的key
    // itemName;子表表名
    const { tableName } = router.currentRoute.params;
    if (data.itemName) {
      if(state.updateData[data.itemName].add[data.itemName]){
        delete state.updateData[data.itemName].add[data.itemName][data.key];
      }
    } else if (state.updateData[tableName] && state.updateData[tableName].add && state.updateData[tableName].add[tableName]) {
      delete state.updateData[tableName].add[tableName][data.key];
    }
  },
  updateModifyData(state, data) {
    if (state.updateData[data.tableName]) {
      state.updateData[data.tableName].modify = data.value;
    }
  },
  updateModifyLabelData(state, data) {
    if (state.updateData[data.tableName]) {
      state.updateData[data.tableName].modifyLabel = data.value;
    }
  },
  updateItemBeforeLabelData(state, data) {
    if (state.updateData[data.tableName]) {
      state.updateData[data.tableName].itemBeforeLabel = data.value;
    }
  },
  updateAddDefaultData(state, data) {
    if (state.updateData[data.tableName]) {
      state.updateData[data.tableName].addDefault = data.value;
    }
  },
  updateDeleteData(state, data) {
    if (state.updateData[data.tableName]) {
      if (Object.values(data.value).length === 0) {
        state.updateData[data.tableName].delete[data.tableName] = data.value;
      } else {
        state.updateData[data.tableName].delete = data.value;
      }
    }
  },
  updateLabelData(state, data) { // 清空1.3修改前后的label
    if (state.updateData[data.tableName]) {
      if (Object.values(data.value).length === 0) {
        state.updateData[data.tableName].modifyLabel[data.tableName] = data.value;
        state.updateData[data.tableName].itemBeforeLabel[data.tableName] = data.value;
      } else {
        state.updateData[data.tableName].modifyLabel = data.value;
        state.updateData[data.tableName].itemBeforeLabel = data.value;
      }
    }
  },

  updateChangeData(state, data) {
    if (state.updateData[data.tableName]) {
      state.updateData[data.tableName].changeData = Object.assign(state.updateData[data.tableName].changeData, data.value);
    }
  },
  updateCheckedInfoData(state, data) {
    if (state.updateData && state.updateData[data.tableName] && state.updateData[data.tableName].checkedInfo) {
      state.updateData[data.tableName].checkedInfo = data.value;
    }
  },
 

  updateNewMainTableAddSaveData(state, { data, itemName }) { // 主表新增保存返回信息
    if (data.data) {
      const NewObject = Object.keys(data.data).reduce((newData, key) => {
        if (key === 'objid') {
          const keys = 'objId';
          newData[keys] = data.data[key];
        } else {
          newData[key] = data.data[key];
        }
        // newData = 'objId';
        // newData[objid] = state.buttonsData.newMainTableSaveData[key];
        return newData;
      }, {});
      state.buttonsData.newMainTableSaveData = NewObject;
    }
   
    state.buttonsData.message = data.message;


    // state.buttonsData.newMainTableSaveData = data.data;
    // state.buttonsData.message = data.message;
  },
  updateNewMainTableDeleteData(state, data) { // 删除返回信息
    state.buttonsData.deleteData = data.message;
  },
  changeCopy(state, data) {
    state.copy = data;
  },
 
  savaCopyData(state, { copyDatas, tableName, modifyData }) { // 执行按钮复制操作存储form默认值数据
    const copySaveDataForParam = {};
    state.copyDataForReadOnly.addcolums.forEach((d) => { // 复制按钮操作时江接口请求回来的配置信息赋值给form
      Object.keys(copyDatas).forEach((item) => {
        if (d.childs) {
          d.childs.forEach((c) => {
            if(c.webconf&& c.webconf.formRequest){
              c.webconf.formRequest.copy = true;
            }
            if (item === c.colname) {
              // b.readonly = c.readonly;
              if (c.readonly === true) {
                if (c.defval) { // 处理复制时有不可编辑，且有默认值情况
                  if (JSON.stringify(modifyData) !== '{}') { // 修改新增时不可编辑且有默认值，将修改后的值删除
                    delete (modifyData[c.colname]);
                  }
                  if (c.display === 'select' || c.display === 'check') {
                    copySaveDataForParam[c.colname] = c.defval;
                  } else if (c.fkdisplay === 'drp' || c.fkdisplay === 'mrp' || c.fkdisplay === 'pop' || c.fkdisplay === 'mop') {
                    copySaveDataForParam[c.colname] = [{ ID: c.refobjid, Label: c.defval }];
                  } 
                } else {
                  c.valuedata = '';// 将配置为不可编辑的值置空
                  if (c.fkdisplay === 'drp' || c.fkdisplay === 'mrp' || c.fkdisplay === 'pop' || c.fkdisplay === 'mop') {
                    c.refobjid = '';
                  }
                }
              } else if (copyDatas[item]) {
                if (c.display === 'doc') {
                  c.valuedata = copyDatas[item]
                  copySaveDataForParam[c.colname] = JSON.parse(copyDatas[item]);
                } else if ((c.fkdisplay === 'drp' || c.fkdisplay === 'mrp' || c.fkdisplay === 'pop') && Array.isArray(copyDatas[item])) {
                  c.refobjid = copyDatas[item].map(item => item.ID).join(',');
                  c.valuedata = copyDatas[item].map(item => item.Label).join(',');
                  copySaveDataForParam[c.colname] = [{ ID: copyDatas[item][0].ID, Label: copyDatas[item][0].Label }];
                }else if (c.display === 'OBJ_DATENUMBER') {
                  c.valuedata = copyDatas[item];
                  // c.default = -1;
                  // c.defaultrange = -1;
                  copySaveDataForParam[c.colname] = copyDatas[item].replace(/-/g, '');
                } else if(c.display === 'select') {
                  if(Array.isArray(copyDatas[item])){
                    c.valuedata = copyDatas[item].join(',');
                  }else{
                    c.valuedata = copyDatas[item];
                  }
                }else{
                  // this.$set(c,'valuedata',copyDatas[item])
                  c.valuedata = copyDatas[item]
                  copySaveDataForParam[c.colname] = copyDatas[item];
                }
              }else{
                c.valuedata ='';
                c.refobjid = '';
                c.defval = '';
                copySaveDataForParam[c.colname] = '';
              }
            }
          });
        }  else if (!d.childs) { // 处理hr外面不可编辑字段的默认值逻辑
          const c = d.child;
          if(c.webconf&& c.webconf.formRequest){
            c.webconf.formRequest.copy = true;
          }
          if (item === c.name) {
            // b.readonly = c.readonly;
            if (c.readonly === true) {
              if (c.defval) { // 处理复制时有不可编辑，且有默认值情况
                if (JSON.stringify(modifyData) !== '{}') { // 修改新增时不可编辑且有默认值，将修改后的值删除
                  delete (modifyData[b.colname]);
                }
                if (c.display === 'select' || c.display === 'check') {
                  copySaveDataForParam[b.colname] = c.defval;
                } else if (c.fkdisplay === 'drp' || c.fkdisplay === 'mrp' || c.fkdisplay === 'pop' || c.fkdisplay === 'mop') {
                  copySaveDataForParam[b.colname] = [{ ID: c.refobjid, Label: c.defval }];
                }
              } else {
                c.valuedata = '';// 将配置为不可编辑的值置空
                if (c.fkdisplay === 'drp' || c.fkdisplay === 'mrp' || c.fkdisplay === 'pop' || c.fkdisplay === 'mop') {
                  c.refobjid = '';
                }
              }
            } else if (copyDatas[item]) {

              if (c.display === 'doc') {
                c.valuedata = copyDatas[item]
                copySaveDataForParam[c.colname] = JSON.parse(copyDatas[item]);
              } else if (c.fkdisplay === 'drp' || c.fkdisplay === 'mrp' || c.fkdisplay === 'pop') {
                c.refobjid = copyDatas[item].map(item => item.ID).join(',');
                c.default = copyDatas[item].map(item => item.Label).join(',');
                copySaveDataForParam[c.colname] = [{ ID: copyDatas[item][0].ID, Label: copyDatas[item][0].Label }];
              } else if (c.fkdisplay === 'mop') {
                try {
                  const number = JSON.parse(b.valuedata).lists.result.length;
                  copySaveDataForParam[c.colname] = [{ ID: b.valuedata, Label: `已经选中${number}条数据` }];
                } catch (e) {
                  copySaveDataForParam[c.colname] = c.valuedata;
                }
              } else if (c.display === 'OBJ_DATENUMBER') {
                c.valuedata = copyDatas[item];
                // c.default = -1;
                // c.defaultrange = -1;
                copySaveDataForParam[c.colname] = copyDatas[item].replace(/-/g, '');
              } else if(c.display === 'select') {
                if(Array.isArray(copyDatas[item])){
                  c.valuedata = copyDatas[item].join(',');
                }else{
                  c.valuedata = copyDatas[item];
                }
              }else{
                // this.$set(c,'valuedata',copyDatas[item])
                c.valuedata = copyDatas[item]
                copySaveDataForParam[c.colname] = copyDatas[item];
              }
              // if (c.display === 'doc') {
              //   copySaveDataForParam[b.colname] = JSON.parse(b.valuedata);
              // } else if (c.fkdisplay === 'drp' || c.fkdisplay === 'mrp' || b.fkdisplay === 'pop' || b.fkdisplay === 'pop') { // 外键类型要特殊整合
              //   copySaveDataForParam[b.colname] = [{ ID: b.refobjid, Label: b.valuedata }];
              // } else if (b.fkdisplay === 'mop') {
              //   try {
              //     const number = JSON.parse(b.valuedata).lists.result.length;
              //     copySaveDataForParam[b.colname] = [{ ID: b.valuedata, Label: `已经选中${number}条数据` }];
              //   } catch (e) {
              //     copySaveDataForParam[b.colname] = b.valuedata;
              //   }
              // } else if (c.display === 'OBJ_DATENUMBER') {
              //   copySaveDataForParam[b.colname] = b.valuedata.replace(/-/g, '');
              // } else {
              //   copySaveDataForParam[b.colname] = b.valuedata;// 重组数据添加到add
              // }
            }else{
              c.valuedata ='';
              c.refobjid = '';
              c.defval = '';
              copySaveDataForParam[c.colname] = '';
            }
          }
        }
      });
    });

    state.updateData[tableName].add = {};
    state.updateData = Object.assign({}, state.updateData);
    const data = JSON.parse(JSON.stringify(state.copyDataForReadOnly));

    state.mainFormInfo.formData.data.copy = true;
    state.mainFormInfo.formData.data.addcolums = data.addcolums;
    state.updateData[tableName].changeData = Object.assign({}, copySaveDataForParam, modifyData);
  },
  changeFormDataForCopy(state, { defaultForCopyDatas, tableName }) {
    state.updateData[tableName].add = defaultForCopyDatas;
  },
  // updateTablePageInfo(state, data) { //  更改列表分页数据
  //   state.tablePageInfo = data;
  // },
  updateTablePageInfo(state, data) { //  更改列表分页数据
    const { tablePageInfo } = state.tabPanels[state.tabCurrentIndex];
    tablePageInfo.currentPageIndex = data.currentPageIndex;
    tablePageInfo.pageSize = data.pageSize;
  },
  updateCopyDataForRealdOnly(state, data) { // 储存接口返回数据作为复制按钮操作的配置信息
    state.copyDataForReadOnly = data;
  },
  // updateCopyData(state, tableName) { // form的配置信息按照新增接口返回值
  //   const copySaveDataForParam = {};

  //   if (Object.keys(state.defaultDataForCopy).length > 0) {
  //     state.copyDataForReadOnly.addcolums.forEach((d) => { // 复制按钮操作时江接口请求回来的配置信息赋值给form
  //       state.defaultDataForCopy.data.addcolums.forEach((item) => {
  //         d.childs.forEach((c) => {
  //           item.childs.forEach((b) => {
  //             if (b.name === c.name) {
  //               b.readonly = c.readonly;
  //               if (c.readonly === true) {
  //                 b.valuedata = '';// 将配置为不可编辑的值置空
  //               } else if (b.valuedata) {
  //                 if (b.fkdisplay === 'drp' || b.fkdisplay === 'mrp' || b.fkdisplay === 'mop' || b.fkdisplay === 'pop' || b.fkdisplay === 'pop') {
  //                   copySaveDataForParam[b.colname] = [{ ID: b.refobjid, Label: b.valuedata }];
  //                 } else {
  //                   copySaveDataForParam[b.colname] = b.valuedata;// 重组数据添加到add
  //                 }
  //               }
  //             }
  //           });
  //         });
  //       });
  //     });

  //     // state.updateData[tableName].add[tableName] = copySaveDataForParam;
  //     // state.updateData[tableName].changeData = Object.assign({}, copySaveDataForParam);
  //     // Object.assign(state.defaultDataForCopy.data, state.copyDataForReadOnly);
  //     // state.tabPanels[0].componentAttribute.panelData = state.defaultDataForCopy;


  //     // state.updateData[tableName].add[tableName] = copySaveDataForParam;
  //     state.updateData[tableName].changeData = Object.assign({}, copySaveDataForParam);
  //     Object.assign(state.defaultDataForCopy.data, state.copyDataForReadOnly);
  //     state.mainFormInfo.formData.data = state.defaultDataForCopy;
  //   }
  // },
  emptyChangeData(state, tableName) {
    if (state.updateData[tableName].changeData) {
      state.updateData[tableName].add = {};
      state.updateData[tableName].changeData = {};
    }
  },
  updateSubmitData(state, submitData) { // 提交
    state.buttonsData.submitData = submitData;
  },
  updateUnSubmitData(state, unSubmitData) { // 取消提交
    state.buttonsData.unSubmitData = unSubmitData;
  },
  updateiInvalidData(state, invalidData) { // 作废
    state.buttonsData.invalidData = invalidData;
  },
  updateButtonsExport(state, data) { // 导出
    state.buttonsData.exportdata = data;
  },
  updateObjTabActionSlientConfirm(state, data) { // 动作定义类型接口返回值
    state.objTabActionSlientConfirmData = data;
  },
  updateLinkageForm(state, data) {
    let mappStatus = {};

    const LinkageForm = {};
    if (data.formList && data.formList.length > 0) {
      mappStatus = data.formList.reduce((arry, item) => {
        LinkageForm[item.key] = {
          index: [data.formIndex],
          item
        };
        if (item.srccol) {
          // arry[item.key] = item.srccol;
          arry[item.srccol] = item.key;
        }
        return arry;
      }, {});
      state.LinkageForm = Object.assign(state.LinkageForm, LinkageForm);
      state.mappStatus = Object.assign(state.mappStatus, mappStatus);
    } else {
      state.LinkageForm = {};
      state.mappStatus = {};
    }
  },
  updateTableSearchData(state, data) {
    const { tableSearchData } = state.tabPanels[state.tabCurrentIndex];
    tableSearchData.selectedValue = data.selectedValue;
    tableSearchData.inputValue = data.inputValue;
  }, // 修改单对象表格搜索的值
  // resetFormReadOnlyAttribute(state,) { // 提交成功后重置form的readonly属性，使其全部设置为不可编辑状态
  //   state.mainFormInfo.formData.data.addcolums.forEach((addcolums) => {
  //     addcolums.childs.forEach((expand) => {
  //       expand.readonly = true;
  //     });
  //   });
  // }

  updateRefreshButton(state, value) { // 控制刷新按钮开关
    state.refreshButton = value;
  },
  updateChildTableReadonly(state, value) { // 更新childTableReadonly字段，控制字表可读性
    state.childTableReadonly = value;
  },
  updataGlobalLoading(state, value) { // 更新全局loading
    state.globalLoading = value;
  },
  updatetooltipForItemTableData(state, data) { // 表格操作单条明细失败返回值
    state.tooltipForItemTable = data;
  },
  updateWebConf(state, data) { // 更新主表配置WebConf
    state.WebConf = data;
  },
  updateButtonGetActionData(state, data) {
    state.ExeActionDataForComponent = data;
  },
  isRequestUpdata(state, { tabPanel, index }) {
    let arr = [];
    arr = tabPanel.map(item => item.isRequest);
    if (index === 0) {
      arr[0] = true;
    }
    arr[index] = true;
    const oldRequestData = state.isRequest;
    if (oldRequestData.length > 0) {
      arr.forEach((a, i) => {
        if (arr[i] !== true) {
          arr[i] = oldRequestData[i];
        }
      }); 
    }
    state.isRequest = arr;
  },
  emptyTestData(state) { // 清空TestData
    state.isRequest = [];
  },
  updateScrollPosition(state, scrollPositionValue) { // 更新当前单对象滚动位置
    state.scrollPosition = scrollPositionValue;
  }
};
