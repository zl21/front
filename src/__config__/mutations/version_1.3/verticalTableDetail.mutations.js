import { stringify } from 'querystring';
import { cpus } from 'os';
import router from '../../router.config';

export default {
  updateObjectForMainTableForm(state, data) { // 更新主表面板数据
    const { tableName, tableId } = router.currentRoute.params;
    state.mainFormInfo.tablename = tableName;
    state.mainFormInfo.tableid = tableId;
    state.mainFormInfo.formData.isShow = data.addcolums && data.addcolums.length > 0;
    state.mainFormInfo.formData.data = Object.assign({}, data);
    state.updateData[tableName] = {
      add: Object.assign({}, { [tableName]: {} }),
      modify: Object.assign({}, { [tableName]: {} }),
      modifyLabel: Object.assign({}, { [tableName]: {} }),
      delete: Object.assign({}, { [tableName]: {} }),
      default: {},
      defaultLabel: {},
      checkedInfo: {},
      changeData: Object.assign({}, state.updateData[tableName] ? state.updateData[tableName].changeData : {}) // 表单修改的值，第二次回显用
    };
  },
  updateMainTabPanelsData(state, data) { // 更新主表tab数据
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
        delete: Object.assign({}, { [item.tablename]: {} }),
        addDefault: Object.assign({}, { [item.tablename]: {} }),
        default: {},
        defaultLabel: {},
        checkedInfo: {},
        changeData: Object.assign({}, state.updateData[item.tablename] ? state.updateData[item.tablename].changeData : {}) // 表单修改的值，第二次回显用
      };
      obj.tableSearchData = {
        selectedValue: '',
        inputValue: ''
      }; // 表格搜索的数据
      arr.push(obj);
    });
    state.tabPanels = arr;
  },
  updateMainButtonsData(state, data) { // 更新主表按钮数据
    // state.mainFormInfo.buttonsData.isShow = true;
    state.defaultButtonData = JSON.parse(JSON.stringify(data));
    if (!state.instanceId) {
      state.mainFormInfo.buttonsData.data = data;
    }
  },
  updateRefButtonsData(state, data) { // 更新子表按钮数据
    const { componentAttribute } = state.tabPanels[data.tabIndex];
    componentAttribute.buttonsData.isShow = false;
    componentAttribute.buttonsData.data = data;
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
    const { componentAttribute } = state.tabPanels[data.tabIndex];
    componentAttribute.tableData.isShow = data.tabth && data.tabth.length > 0;
    componentAttribute.tableData.data = data;
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
  updateChangeData(state, data) {
    if (state.updateData[data.tableName]) {
      state.updateData[data.tableName].changeData = data.value;
    }
  },
  updateCheckedInfoData(state, data) {
    if (state.updateData && state.updateData[data.tableName] && state.updateData[data.tableName].checkedInfo) {
      state.updateData[data.tableName].checkedInfo = data.value;
    }
  },
  updatePanelData(state, data) { // 更新子表面板数据
    const { componentAttribute } = state.tabPanels[data.tabIndex];
    componentAttribute.panelData.isShow = true;
    componentAttribute.panelData.data = data;
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
    // const hidecolunmArray = [];
    state.copyDataForReadOnly.addcolums.forEach((d) => { // 复制按钮操作时江接口请求回来的配置信息赋值给form
      copyDatas.data.addcolums.forEach((item) => {
        if (d.childs) {
          d.childs.forEach((c) => {
            if (item.childs) {
              item.childs.forEach((b) => {
                // if (c.hidecolumn) {
                //   if (c.hidecolumn && c.hidecolumn.refcolumn === b.colname) {
                //     if (c.hidecolumn && c.hidecolumn.refval !== b.valuedata) {
                //       c.valuedata = '';
                //       hidecolunmArray.push(c);
                //     }
                //   }
                // }
                if (b.name === c.name) {
                  b.readonly = c.readonly;
                  // if (hidecolunmArray.length > 0) {
                  //   hidecolunmArray.forEach((hidecolumnItem) => {
                  //     if (b.colname !== hidecolumnItem.colname) {
                  //       if (c.readonly === true) {
                  //         if (c.defval) {
                  //           copySaveDataForParam[b.colname] = c.defval;
                  //         } else {
                  //           b.valuedata = '';// 将配置为不可编辑的值置空
                  //         }
                  //       } else if (b.valuedata) {
                  //         if (b.display === 'doc') {
                  //         } else if (b.fkdisplay === 'drp' || b.fkdisplay === 'mrp' || b.fkdisplay === 'pop' || b.fkdisplay === 'pop') {
                  //           copySaveDataForParam[b.colname] = [{ ID: b.refobjid, Label: b.valuedata }];
                  //         } else if (b.fkdisplay === 'mop') {
                  //           const number = JSON.parse(b.valuedata).lists.result.length;
                  //           copySaveDataForParam[b.colname] = [{ ID: b.valuedata, Label: `已经选中${number}条数据` }];
                  //         } else {
                  //           copySaveDataForParam[b.colname] = b.valuedata;
                  //         }
                  //       }
                  //     }
                  //   });
                  // } else
                  if (c.readonly === true) {
                    if (c.defval) {
                      copySaveDataForParam[b.colname] = c.defval;
                    } else {
                      b.valuedata = '';// 将配置为不可编辑的值置空
                    }
                  } else if (b.valuedata) {
                    if (b.display === 'doc') {
                      copySaveDataForParam[b.colname] = b.valuedata;
                    } else if (b.fkdisplay === 'drp' || b.fkdisplay === 'mrp' || b.fkdisplay === 'pop' || b.fkdisplay === 'pop') {
                      copySaveDataForParam[b.colname] = [{ ID: b.refobjid, Label: b.valuedata }];
                    } else if (b.fkdisplay === 'mop') {
                      const number = JSON.parse(b.valuedata).lists.result.length;
                      copySaveDataForParam[b.colname] = [{ ID: b.valuedata, Label: `已经选中${number}条数据` }];
                    } else {
                      copySaveDataForParam[b.colname] = b.valuedata;
                    }
                  }
                }
              });
            }
          });
        }
      });
    });
    state.updateData[tableName].add = {};
    state.updateData = Object.assign({}, state.updateData);
    const data = Object.assign({}, copyDatas, state.copyDataForReadOnly);

    // data.data.addcolums.forEach((item) => { // 去除配置了clearWhenHidden的
    //   if (item.parentdesc !== '日志') {
    //     item.childs.forEach((itemValue,) => {
    //       item.childs.forEach((childValue) => {
    //         if (itemValue.hidecolumn && itemValue.hidecolumn.refcolumn === childValue.colname) {
    //           // if (itemValue.hidecolumn && itemValue.hidecolumn.refval !== childValue.valuedata) {
    //           //   itemValue.valuedata = '';
    //           //   delete (itemValue.refobjid);
    //           // }
    //         }
    //       });
    //     });
    //   }
    // });
    state.mainFormInfo.formData.data.addcolums = data.data.addcolums;
    state.updateData[tableName].changeData = Object.assign({}, copySaveDataForParam, modifyData);
  },
  changeFormDataForCopy(state, { defaultForCopyDatas, tableName }) {
    state.updateData[tableName].add = defaultForCopyDatas;
  },
  updateTablePageInfo(state, data) { //  更改列表分页数据
    state.tablePageInfo = data;
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

  jflowPlugin(state, {
    buttonsData, newButtons, instanceId
  }) { // jflowPlugin按钮逻辑
    state.jflowPluginDataArray = newButtons;
    state.instanceId = instanceId;
    if (instanceId) {
      state.mainFormInfo.buttonsData.data.tabwebact.objbutton = [];
    } else {
      state.mainFormInfo.buttonsData.data.tabwebact = state.defaultButtonData.tabwebact;
    }
    state.mainFormInfo.buttonsData.data.tabcmd.prem = buttonsData;
  },
  updateRefreshButton(state, value) { // 控制刷新按钮开关
    state.refreshButton = value;
  },
  updateChildTableReadonly(state, value) { // 更新childTableReadonly字段，控制字表可读性
    state.childTableReadonly = value;
  },
  updateWatermarkimg(state, value) { // 修改水印
    state.mainFormInfo.buttonsData.data.watermarkimg = value;
  }
};
