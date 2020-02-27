import { stringify } from 'querystring';
import { cpus } from 'os';
import { ComponentResolver } from 'ag-grid/dist/lib/components/framework/componentResolver';
import router from '../../router.config';
import { DispatchEvent } from '../../../__utils__/dispatchEvent';
import { enableJflow } from '../../../constants/global';


export default {
  updateObjectForMainTableForm(state, data) { // 更新主表面板数据
    const { tableName, tableId } = router.currentRoute.params;
    state.mainFormInfo.tablename = tableName;
    state.mainFormInfo.tableid = tableId;
    state.mainFormInfo.formData.isShow = data && data.addcolums && data.addcolums.length > 0;
    state.mainFormInfo.formData.data = Object.assign({}, data);
    state.updateData[tableName] = {
      add: Object.assign({}, { [tableName]: {} }),
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
      obj.tableDefaultFixedcolumns = {}; // 单对象子表表格默认搜索条件
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
    if (Object.values(data.value).length === 0 && state.updateData[data.tableName]) {
      state.updateData[data.tableName].add[data.tableName] = {};
    } else if (state.updateData[data.tableName]) {
      state.updateData[data.tableName].add[data.tableName] = Object.assign({}, state.updateData[data.tableName].add[data.tableName], data.value[data.tableName]);
    }
  },
  seleteAddData(state, data) { // 删除状态里add的空值
    // key,需要删除的key
    // itemName;子表表名
    const { tableName } = router.currentRoute.params;
    if (data.itemName) {
      delete state.updateData[data.itemName].add[data.itemName][data.key];
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
    state.instanceId = '1';
    this.state.global.objreadonlyForJflow = {
      readonly: false,
      itemTableName: ''
    };
    let flag = false;
    if (!enableJflow() && state.instanceId && this.state.global.JflowControlField) { // 加jflow
      // 子表是一对一模式下，且JflowControlField所返回的是当前子表需要修改的信息
      if (state.tabPanels[data.tabIndex].tablename === this.state.global.JflowControlField.itemTableName) {
        if (state.tabPanels[data.tabIndex].tabrelation === '1:1') {
          this.state.global.objreadonlyForJflow = {
            readonly: false,
            itemTableName: this.state.global.JflowControlField.itemTableName
          };
          flag = true;
        } 
      } 
      if (flag) { // 符合jflow控制子表字段配置条件执行以下逻辑
        data.addcolums.reduce((a, c) => {
          const u = [];
          if (c.childs) {
            c.childs.map((d) => {
              if (this.state.global.JflowControlField.isShow.length > 0) { // display有数据，则只展示数据里的字段
                if (this.state.global.JflowControlField.isShow.includes(d.colid)) {
                  if (this.state.global.JflowControlField.readonly.length > 0) {
                    d.readonly = false;
                    u.push(d);
                  } else {
                    d.readonly = true;
                    u.push(d);
                  }
                }
              } else if (this.state.global.JflowControlField.readonly.length > 0) {
                // 未配置jflowisShow字段，则显示全部元数据字段，由readonly控制字段是否可编辑
                if (this.state.global.JflowControlField.readonly.includes(d.colid)) {
                  // 未配置可见字段，只配置了可编辑字段时，所有元数据返回的字段可见，readonly内配置的可编辑
                  d.readonly = false;
                  u.push(d);
                } else { // 不可编辑
                  d.readonly = true;
                  u.push(d);
                }
              } else { // 未配置可编辑字段，则所有元数据字段不可编辑
                d.readonly = true;
                u.push(d);
              }
            });

            c.childs = u;
          } else if (this.state.global.JflowControlField.isShow.length > 0) { // display有数据，则只展示数据里的字段
            if (this.state.global.JflowControlField.isShow.includes(c.colid)) {
              if (this.state.global.JflowControlField.readonly.length > 0) {
                c.child.readonly = true;
                u.push(c.child);
              } 
              u.push(c.child);
            } 
            // });
          } else { // isShow无数据，则显示元数据接口返回所有字段，但当前表为不可编辑状态
            if (this.state.global.JflowControlField.readonly.length > 0) {
              // jflow配置了可编辑字段时，配置的字段可编辑，其余全部为不可编辑状态
              if (this.state.global.JflowControlField.readonly.includes(c.child.colid)) {
                c.child.readonly = false;
                u.push(c.child);
              }
              // jflow未配置可编辑字段时，则元数据所有字段全部不可编辑
              c.child.readonly = true;
              u.push(c.child);
            } 
            // jflow未配置显示字段以及未配置可编辑字段时，则所有元数据字段为不可编辑状态
            c.child.readonly = false;
            u.push(c.child);
          }
          a.push(c);
          return a;
        }, []);
        console.log('🍓', data);

        const { componentAttribute } = state.tabPanels[data.tabIndex];
        componentAttribute.panelData.isShow = true;
        componentAttribute.panelData.data = data;
      } else {
        const { componentAttribute } = state.tabPanels[data.tabIndex];
        componentAttribute.panelData.isShow = true;
        componentAttribute.panelData.data = data;
      }
    } else {
      const { componentAttribute } = state.tabPanels[data.tabIndex];
      componentAttribute.panelData.isShow = true;
      componentAttribute.panelData.data = data;
    }
  },

  updateNewMainTableAddSaveData(state, { data }) { // 主表新增保存返回信息
    state.buttonsData.newMainTableSaveData = data.data;
    state.buttonsData.message = data.message;
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
      copyDatas.data.addcolums.forEach((item) => {
        if (d.childs) {
          d.childs.forEach((c) => {
            if (item.childs) {
              item.childs.forEach((b) => {
                if (b.name === c.name) {
                  b.readonly = c.readonly;
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
                      b.valuedata = '';// 将配置为不可编辑的值置空
                      if (b.fkdisplay === 'drp' || b.fkdisplay === 'mrp' || b.fkdisplay === 'pop' || b.fkdisplay === 'mop') {
                        b.refobjid = '';
                      }
                    }
                  } else if (b.valuedata) {
                    if (b.display === 'doc') {
                      copySaveDataForParam[b.colname] = b.valuedata;
                    } else if (b.fkdisplay === 'drp' || b.fkdisplay === 'mrp' || b.fkdisplay === 'pop') {
                      copySaveDataForParam[b.colname] = [{ ID: b.refobjid, Label: b.valuedata }];
                    } else if (b.fkdisplay === 'mop') {
                      try {
                        const number = JSON.parse(b.valuedata).lists.result.length;
                        copySaveDataForParam[b.colname] = [{ ID: b.valuedata, Label: `已经选中${number}条数据` }];
                      } catch (e) {
                        copySaveDataForParam[b.colname] = b.valuedata;
                      }
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
    state.mainFormInfo.formData.data.copy = true;
    state.mainFormInfo.formData.data.addcolums = data.data.addcolums;
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
    // form 联动校验 存值
    //  LinkageForm.push([...data]);
    // form 联动校验 存值
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
  updateCompositeForm(state, data) {
    // 实例挂载
    const CompositeForm = {};
    if (data && data.name) {
      CompositeForm[data.name] = data.vm;
      state.CompositeForm = CompositeForm;
    } else {
      state.CompositeForm = {};
    }
  },
  updateTableSearchData(state, data) {
    const { tableSearchData } = state.tabPanels[state.tabCurrentIndex];
    tableSearchData.selectedValue = data.selectedValue;
    tableSearchData.inputValue = data.inputValue;
  }, // 修改单对象表格搜索的值
  updateTableFixedcolumns(state, data) {
    // const { tableDefaultFixedcolumns } = state.tabPanels[state.tabCurrentIndex];
    state.tabPanels[state.tabCurrentIndex].tableDefaultFixedcolumns = data;
    // tableDefaultFixedcolumns = data;
  }, // 修改单对象表格默认搜索条件
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
    state.jflowWaterMark = value;
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
  changeFormData(state, data) {
    // [
    //   { colname:'333',
    //   readonly: true   不可编辑，false 可编辑，
    //      isnotnull：true 必填，false 不必填 
    //      display:'none'是不显示}
    // ];
    if (state.mainFormInfo && state.mainFormInfo.formData && state.mainFormInfo.formData.data && state.mainFormInfo.formData.data.addcolums) {
      state.mainFormInfo.formData.data.addcolums.map((a) => {
        a.childs.map((b) => {
          data.map((c) => {
            if (c.colname === b.colname) {
              if (c.readonly) {
                b.readonly = c.readonly;
              }
              if (c.isnotnull) {
                b.isnotnull = c.isnotnull;
              }
              if (c.display) {
                b.display = c.display;
              }
            }
          });
        });
      });
    }
  },
  updateButtonGetActionData(state, data) {
    state.ExeActionDataForComponent = data;
  },
};
