import router from '../../router.config';
import { enableJflow, custommizedJflow } from '../../../constants/global';


export default {
  updataClickSave(state, func) {
    state.clickSaveFunction = func;
  },
  testUpdataValue(state, func) {
    state.testUpdata = func;
  },
  updataHideTempStorage(state, value) { // 控制单对象界面暂存按钮
    state.isHideTempStorage = value;
  },
  updateTabPanelsData(state, data) {
    const { tableName, tableId } = router.currentRoute.params;
    const arr = [{
      label: '标签',
      tablename: tableName,
      id: tableId,
      componentAttribute: {
        buttonsData: {
          isShow: true,
          data: state.instanceId ? state.tabPanels[0].componentAttribute.buttonsData.data : data
        },
        formData: {
          isShow: false,
          data: {}
        },
        panelData: {
          isShow: true,
          data: {}
        },
        tableData: {
          isShow: false,
          data: {}
        }
      }
    }];
    data.reftabs.sort((a, b) => a.order - b.order);
    data.reftabs.forEach((item) => {
      const obj = { ...item };
      obj.label = item.tabledesc;
      obj.componentAttribute = {
        buttonsData: {
          isShow: true,
          data: {}
        },
        formData: {
          isShow: false,
          data: {}
        },
        panelData: {
          isShow: false,
          data: {}
        },
        tableData: {
          isShow: false,
          data: {}
        }
      };
      obj.tableSearchData = {
        selectedValue: '',
        inputValue: ''
      }; // 表格搜索的数据
      obj.tablePageInfo = {
        currentPageIndex: 1,
        pageSize: 10
      }; // 表格的页码和每页多少条
      obj.tableDefaultFixedcolumns = {}; // 单对象子表表格默认搜索条件
      arr.push(obj);
    });
    // if (data.type === 'refresh') {
    //   state.updateData[arr[0].tablename] = {
    //     add: Object.assign({}, { [arr[0].tablename]: {} }),
    //     modify: Object.assign({}, { [arr[0].tablename]: {} }),
    //     modifyLabel: Object.assign({}, { [arr[0].tablename]: {} }),
    //     itemBeforeLabel: Object.assign({}, { [arr[0].tablename]: {} }), // 子表表格改以前的label
    //     delete: Object.assign({}, { [arr[0].tablename]: {} }),
    //     addDefault: {},
    //     default: {},
    //     defaultLabel: {},
    //     checkedInfo: {},
    //     changeData: {}
    //     // Object.assign({}, state.updateData[item.tablename] ? state.updateData[item.tablename].changeData : {}) // 表单修改的值，第二次回显用
    //   };
    // } else {
    arr.forEach((item) => {
      state.updateData[item.tablename] = {
        add: Object.assign({}, { [item.tablename]: {} }),
        modify: Object.assign({}, { [item.tablename]: {} }),
        modifyLabel: Object.assign({}, { [item.tablename]: {} }),
        itemBeforeLabel: Object.assign({}, { [item.tablename]: {} }), // 子表表格改以前的label
        delete: Object.assign({}, { [item.tablename]: {} }),
        addDefault: {},
        default: {},
        defaultLabel: {},
        checkedInfo: {},
        changeData: {}
        // Object.assign({}, state.updateData[item.tablename] ? state.updateData[item.tablename].changeData : {}) // 表单修改的值，第二次回显用
      };
    });
    // }

    
    state.tabPanels = arr;
  }, // 更新按钮数据
  updateDefaultButton(state, data) { // 主表
    if (data && data.tabcmd && data.tabcmd.cmds) {
      data.tabcmd.cmds.some((b, i) => {
        if (b === 'actionMODIFY') {
          state.saveInfo = {
            paths: data.tabcmd.paths && data.tabcmd.paths.length > 0 ? data.tabcmd.paths[i] : null,
            name: 'actionMODIFY',
          };
        }
      });
    }
    state.defaultButtonData = data;
  },
  updateButtonsData(state, data) {
    state.defaultButtonData = JSON.parse(JSON.stringify(data));
    if (!state.instanceId) {
      const { componentAttribute } = state.tabPanels[data.tabIndex];
      componentAttribute.buttonsData.isShow = true;
      componentAttribute.buttonsData.data = data;
    }
  }, // 更新按钮数据
  updateButtonsDataForCustomization(state, { tabIndex, isShowValue }) {
    const { componentAttribute } = state.tabPanels[tabIndex];
    componentAttribute.buttonsData.isShow = isShowValue;
  }, // 全定制tab更新按钮数据
  updateFormData(state, data) {
    const { componentAttribute } = state.tabPanels[data.tabIndex];
    if (data.inpubobj) {
      componentAttribute.formData.isShow = true;
    }
    componentAttribute.formData.data = data;
  }, 

  updatePanelData(state, data) { // 更新子表面板数据
    state.itemObjId = data.id;
    if (enableJflow() && custommizedJflow() && this.state.global.JflowControlField.length > 0) { // 加jflow
      // 子表是一对一模式下，且JflowControlField所返回的是当前子表需要修改的信息
      const tabrelation = state.tabPanels.some(item => item.tabrelation === '1:1');

      let isMainTable = false;
      let tableIndex = null;
      let isCustomizedTab = false;
      
      const JflowControlFieldData = this.state.global.JflowControlField.filter((item) => {
        const { tableId } = router.currentRoute.params;
        const isId = state.tabPanels.some(a => (a.tableid || Number(a.id)) === Number(item.itemTableId));
        if (item.tableId === tableId && isId) {
          if (item.tableId === item.itemTableId) { // 子表为1:1状态或配置中itemTableName=tableName（此时为主表修改字段）
            const b = this.state.global.objreadonlyForJflow.filter(a => Number(a.itemTableId) !== Number(item.itemTableId));
            if (b.length === 0) {
              this.state.global.objreadonlyForJflow.push(
                {
                  readonly: false,
                  itemTableId: Number(item.itemTableId),
                  tableId: item.tableId,
                  jflowButton: item.jflowButton
                }
              );
            }
            tableIndex = 0;
            isMainTable = true;
            return true;
          } if (state.tabPanels.some(items => items.tableid === Number(item.itemTableId))) { // 子表
            this.state.global.objreadonlyForJflow.push(
              {
                readonly: false,
                itemTableId: Number(item.itemTableId),
                tableId: item.tableId,
                jflowButton: item.jflowButton
              }
            );
            state.tabPanels.some((items, i) => {
              if (items.tableid === Number(item.itemTableId)) {
                tableIndex = i;
              }
            });
            return true;
          }
        } else if (item.tableId === tableId) {
          isCustomizedTab = true;// jflow配置为子表（子表ID不存在时）
        }
      });
      if (JflowControlFieldData[0]) { // 符合jflow控制子表字段配置条件执行以下逻辑
        state.isHideTempStorage = true;// 隐藏暂存按钮
        // state.tabPanels[tableIndex]={
          
        // }
        if (state.tabPanels[tableIndex] && tableIndex === data.tabIndex) {
          // 处理jflow配置的表（字段以及按钮）
          const addcolumsData = data.addcolums.reduce((a, c) => {
            const u = [];
            if (c.childs) {
              c.childs.map((d) => {
                if (JflowControlFieldData[0].isShow.length > 0) { // display有数据，则只展示数据里的字段
                  if (JflowControlFieldData[0].isShow.includes(String(d.colid))) {
                    if (JflowControlFieldData[0].readonly.length > 0) {
                      if (JflowControlFieldData[0].readonly.includes(String(d.colid))) {
                        d.readonly = false;
                        u.push(d);
                      } else {
                        d.readonly = true;
                        u.push(d);
                      }
                    } else {
                      d.readonly = true;
                      u.push(d);
                    }
                  }
                } else if (JflowControlFieldData[0].readonly.length > 0) {
                  // 未配置jflowisShow字段，则显示全部元数据字段，由readonly控制字段是否可编辑
                  if (JflowControlFieldData[0].readonly.includes(String(d.colid))) {
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
              a.push(c);
            } else if (JflowControlFieldData[0].isShow.length > 0) { // display有数据，则只展示数据里的字段
              if (JflowControlFieldData[0].isShow.includes(String(c.child.colid))) {
                if (JflowControlFieldData[0].readonly.length > 0 && JflowControlFieldData[0].readonly.includes(String(c.child.colid))) {
                  c.child.readonly = false;
                  a.push(c);
                } else {
                  c.child.readonly = true;
                  a.push(c);
                } 
              } 
            } else if (JflowControlFieldData[0].readonly.length > 0) {
              // isShow无数据，则显示元数据接口返回所有字段，但当前表为不可编辑状态
              // jflow配置了可编辑字段时，配置的字段可编辑，其余全部为不可编辑状态
              if (JflowControlFieldData[0].readonly.includes(String(c.child.colid))) {
                c.child.readonly = false;
                a.push(c);
              } else {
                // jflow未配置可编辑字段时，则元数据所有字段全部不可编辑
                c.child.readonly = true;
                a.push(c);
              }
            } else {
              // jflow未配置显示字段以及未配置可编辑字段时，则所有元数据字段为不可编辑状态
              c.child.readonly = true;
              a.push(c);
            }
            return a;
          }, []);
          const { componentAttribute } = state.tabPanels[data.tabIndex];
          componentAttribute.panelData.isShow = true;
          data.addcolums = addcolumsData;
          componentAttribute.panelData.data = data;
          // 处理jflow配置自定义按钮逻辑
          let tabwebactButton = [];
          if (data.tabIndex === 0) { // 主表
            tabwebactButton = 'objbutton';
          } else { // 子表
            tabwebactButton = 'objtabbutton';
          }

          if (componentAttribute.buttonsData.data.tabwebact && componentAttribute.buttonsData.data.tabwebact[tabwebactButton] && componentAttribute.buttonsData.data.tabwebact[tabwebactButton].length > 0) {
            let objtabbuttons = [];
            if (isMainTable) { // 配置的为主表
              objtabbuttons = componentAttribute.buttonsData.data.tabwebact.objbutton;
            } else {
              objtabbuttons = componentAttribute.buttonsData.data.tabwebact.objtabbutton;
            }
            const buttonsJflowRes = [];
            if (JflowControlFieldData[0].exeActionButton.length > 0) {
              JflowControlFieldData[0].exeActionButton.map((buttonId) => {
                objtabbuttons.map((objtabbutton) => {
                  if (String(buttonId) === String(objtabbutton.webid)) {
                    buttonsJflowRes.push(objtabbutton);
                  }
                });
              });
              if (buttonsJflowRes.length > 0) { // jflow exeActionButton配置中包含子表自定义按钮ID，则显示
                componentAttribute.buttonsData.data.tabwebact[tabwebactButton] = buttonsJflowRes;
              } 
            } else { // jflow exeActionButton配置为空时，去除元数据返回的自定义按钮
              componentAttribute.buttonsData.data.tabwebact[tabwebactButton] = [];
            }
          }
          if (JflowControlFieldData[0].jflowButton && JflowControlFieldData[0].jflowButton.length > 0) {
            // 如果jflowButton配置了按钮，则将元数据返回按钮删除，显示jflow按钮
            if (componentAttribute.buttonsData.data.tabcmd && componentAttribute.buttonsData.data.tabcmd.prem && componentAttribute.buttonsData.data.tabcmd.prem.length > 0) {
              componentAttribute.buttonsData.data.tabcmd.prem = componentAttribute.buttonsData.data.tabcmd.prem.map((item, index) => {
                if (JflowControlFieldData[0].readonly.length > 0 && componentAttribute.buttonsData.data.tabcmd.cmds[index] === 'actionMODIFY') { // 如果配置了可编辑字段，则显示保存按钮
                  item = true;
                  return item;
                }
                item = false;
                return item;
              });
            }
            componentAttribute.buttonsData.data.jflowButton = JflowControlFieldData[0].jflowButton;
            state.jflowConfigrefreshButton = true;
          }
        } else {
          // 处理除了jflow配置的表（按钮）
          const { componentAttribute } = state.tabPanels[data.tabIndex];
          componentAttribute.panelData.isShow = true;
          componentAttribute.panelData.data = data;// 渲染表单
          state.tabPanels.map((tab, index) => {
            if (tableIndex !== index) { // 除去当前配置表
              // data.tabIndex === 0 && 
              if (index === 0) { // 处理主表
                state.jflowConfigrefreshButton = true;
                if (tab.componentAttribute.buttonsData.data.tabwebact && tab.componentAttribute.buttonsData.data.tabwebact.objbutton && tab.componentAttribute.buttonsData.data.tabwebact.objbutton.length > 0) {
                  tab.componentAttribute.buttonsData.data.tabwebact.objbutton = [];// 将主表自定义按钮置为空
                }
                if (tab.componentAttribute.buttonsData.data.tabwebact && tab.componentAttribute.buttonsData.data.tabwebact.objbutton && tab.componentAttribute.buttonsData.data.tabwebact.objbutton > 0) { tab.componentAttribute.buttonsData.data.tabwebact.objbutton = []; }// 将主表自定义按钮置为空
                tab.componentAttribute.buttonsData.data.jflowButton = [];// 配置的是子表时，需将主表按钮置为空，只保留复制按钮
                if (JflowControlFieldData[0].jflowButton && JflowControlFieldData[0].jflowButton.length > 0) {
                  // 如果jflowButton配置了按钮，则将元数据返回按钮删除，显示jflow按钮

                  if (tab.componentAttribute.buttonsData.data.tabcmd && tab.componentAttribute.buttonsData.data.tabcmd.prem && tab.componentAttribute.buttonsData.data.tabcmd.prem.length > 0) {
                    tab.componentAttribute.buttonsData.data.tabcmd.prem = tab.componentAttribute.buttonsData.data.tabcmd.prem.map((item, i) => {
                      if (tab.componentAttribute.buttonsData.data.tabcmd.cmds[i] === 'actionCANCOPY') { 
                        item = true;
                        return item;
                      }
                      item = false;
                      return item;
                    });
                  }
                }
              } else { // 处理子表
                setTimeout(() => {
                  if (JflowControlFieldData[0].jflowButton && JflowControlFieldData[0].jflowButton.length > 0) {
                    // 如果jflowButton配置了按钮，则将元数据返回按钮删除，显示jflow按钮
                    if (tab.componentAttribute.buttonsData.data.tabcmd && tab.componentAttribute.buttonsData.data.tabcmd.prem && tab.componentAttribute.buttonsData.data.tabcmd.prem.length > 0) {
                      tab.componentAttribute.buttonsData.data.tabcmd.prem = tab.componentAttribute.buttonsData.data.tabcmd.prem.map((item) => {
                        item = false;
                        return item;
                      });
                    }
                  }
                  if (tab.componentAttribute.buttonsData.data.tabwebact && tab.componentAttribute.buttonsData.data.tabwebact.objtabbutton && tab.componentAttribute.buttonsData.data.tabwebact.objtabbutton.length > 0) {
                    tab.componentAttribute.buttonsData.data.tabwebact.objtabbutton = [];// 将子表表自定义按钮置为空
                  }
                }, 500);
              }
            }
          });
        }
      } else if (isCustomizedTab) {
        // jflow配置子表（子表id不存在时），以下逻辑为控制主表按钮显示逻辑（只显示复制/刷新/返回）
        const { componentAttribute } = state.tabPanels[data.tabIndex];
        componentAttribute.panelData.isShow = true;
        componentAttribute.panelData.data = data;// 渲染表单
        state.tabPanels.map((tab, index) => {
          if (tableIndex !== index) { // 除去当前配置表
            if (index === 0) { // 处理主表
              state.jflowConfigrefreshButton = true;
              if (tab.componentAttribute.buttonsData.data.tabwebact && tab.componentAttribute.buttonsData.data.tabwebact.objbutton && tab.componentAttribute.buttonsData.data.tabwebact.objbutton.length > 0) {
                tab.componentAttribute.buttonsData.data.tabwebact.objbutton = [];// 将主表自定义按钮置为空
              }
              if (tab.componentAttribute.buttonsData.data.tabwebact && tab.componentAttribute.buttonsData.data.tabwebact.objbutton && tab.componentAttribute.buttonsData.data.tabwebact.objbutton > 0) { tab.componentAttribute.buttonsData.data.tabwebact.objbutton = []; }// 将主表自定义按钮置为空
              tab.componentAttribute.buttonsData.data.jflowButton = [];// 配置的是子表时，需将主表按钮置为空，只保留复制按钮
              if (tab.componentAttribute.buttonsData.data.tabcmd && tab.componentAttribute.buttonsData.data.tabcmd.prem && tab.componentAttribute.buttonsData.data.tabcmd.prem.length > 0) {
                tab.componentAttribute.buttonsData.data.tabcmd.prem = tab.componentAttribute.buttonsData.data.tabcmd.prem.map((item, i) => {
                  if (tab.componentAttribute.buttonsData.data.tabcmd.cmds[i] === 'actionCANCOPY') { 
                    item = true;
                    return item;
                  }
                  item = false;
                  return item;
                });
              }
            } else { // 处理子表
              if (tab.componentAttribute.buttonsData.data.tabcmd && tab.componentAttribute.buttonsData.data.tabcmd.prem && tab.componentAttribute.buttonsData.data.tabcmd.prem.length > 0) {
                tab.componentAttribute.buttonsData.data.tabcmd.prem = tab.componentAttribute.buttonsData.data.tabcmd.prem.map((item) => {
                  item = false;
                  return item;
                });
              }
              if (tab.componentAttribute.buttonsData.data.tabwebact && tab.componentAttribute.buttonsData.data.tabwebact.objtabbutton && tab.componentAttribute.buttonsData.data.tabwebact.objtabbutton.length > 0) {
                tab.componentAttribute.buttonsData.data.tabwebact.objtabbutton = [];// 将子表表自定义按钮置为空
              }
            }
          }
        });
      } else {
        state.jflowConfigrefreshButton = false;
        const { componentAttribute } = state.tabPanels[data.tabIndex];
        componentAttribute.panelData.isShow = true;
        componentAttribute.panelData.data = data;
      }
    } else {
      state.jflowConfigrefreshButton = false;

      const { componentAttribute } = state.tabPanels[data.tabIndex];
      componentAttribute.panelData.isShow = true;
      componentAttribute.panelData.data = data;
    }
  }, 
  
  updateTableData(state, data) {
    const { componentAttribute } = state.tabPanels[data.tabIndex];
    componentAttribute.tableData.isShow = true;
    componentAttribute.tableData.data = data;
  }, // 更新表格数据
  updateTabCurrentIndex(state, index) {
    state.tabCurrentIndex = index;
  }, // 更新当前tab的索引
  updateDefaultData(state, data) {
    state.updateData[data.tableName].default = data.value;
  },
  updateDefaultLabelData(state, data) {
    state.updateData[data.tableName].defaultLabel = data.value;
  },
  updateAddData(state, data) {
    if (state.updateData[data.tableName]) {
      if (Object.values(data.value).length === 0) {
        state.updateData[data.tableName].add[data.tableName] = {};
      } else {
        state.updateData[data.tableName].add[data.tableName] = Object.assign(state.updateData[data.tableName].add[data.tableName], data.value[data.tableName]);
      }
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
    data = JSON.parse(JSON.stringify(data));

    if (state.updateData[data.tableName]) {
      state.updateData[data.tableName].changeData = Object.assign(data.value, {});
      state.updateData = Object.assign({}, state.updateData);
    }
  },
  updateCheckedInfoData(state, data) {
    if (state.updateData[data.tableName]) {
      state.updateData[data.tableName].checkedInfo = data.value;
    }
  },
  updateNewMainTableAddSaveData(state, { data, itemName }) { // 主表新增保存返回信息
    state.buttonsData.newMainTableSaveData = data.data;
    state.buttonsData.message = data.message;
  },
  updateNewMainTableDeleteData(state, data) { // 删除返回信息
    state.buttonsData.deleteData = data.message;
  },
  updateFormDataForRefshow(state) { // 去除子表缓存
    const { componentAttribute } = state.tabPanels[state.tabCurrentIndex];
    componentAttribute.formData.isShow = false;
  },
  // updateTablePageInfo(state, data) { //  更改列表分页数据
  //   state.tablePageInfo = data;
  // },
  updateTablePageInfo(state, data) { //  更改列表分页数据
    const { tablePageInfo } = state.tabPanels[state.tabCurrentIndex];
    tablePageInfo.currentPageIndex = data.currentPageIndex;
    tablePageInfo.pageSize = data.pageSize;
  },
  changeCopy(state, data) {
    state.copy = data;
  },
  copyDefaultData(state, { tableName }) { // 执行按钮复制操作重新给form赋值
    // state.tabPanels.forEach((item) => {
    //   if (item.tablename === tableName) {
    state.tabPanels[0].componentAttribute.panelData = Object.assign(state.tabPanels[0].componentAttribute.panelData, state.defaultForCopyData);
    //   }
    // });
  },
  // changeFormDataForCopy(state, { defaultForCopyDatas, tableName }) {
  //   state.updateData[tableName].add = defaultForCopyDatas;
  // },
  savaCopyData(state, { copyDatas, tableName, modifyData }) { // 执行按钮复制操作存储form默认值数据
    // state.defaultDataForCopy = copyData;
    const copySaveDataForParam = {};// 整合changeData所需数据格式
    // const hidecolunmArray = [];
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
                      copySaveDataForParam[b.colname] = JSON.parse(b.valuedata);
                    } else if (b.fkdisplay === 'drp' || b.fkdisplay === 'mrp' || b.fkdisplay === 'pop' || b.fkdisplay === 'pop') { // 外键类型要特殊整合
                      copySaveDataForParam[b.colname] = [{ ID: b.refobjid, Label: b.valuedata }];
                    } else if (b.fkdisplay === 'mop') {
                      try {
                        const number = JSON.parse(b.valuedata).lists.result.length;
                        copySaveDataForParam[b.colname] = [{ ID: b.valuedata, Label: `已经选中${number}条数据` }];
                      } catch (e) {
                        copySaveDataForParam[b.colname] = b.valuedata;
                      }
                    } else {
                      copySaveDataForParam[b.colname] = b.valuedata;// 重组数据添加到add
                    }
                  }
                }
              });
            }
          });
        } else if (!item.childs) { // 处理hr外面不可编辑字段的默认值逻辑
          const b = item.child;
          const c = d.child;
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
                copySaveDataForParam[b.colname] = JSON.parse(b.valuedata);
              } else if (b.fkdisplay === 'drp' || b.fkdisplay === 'mrp' || b.fkdisplay === 'pop' || b.fkdisplay === 'pop') { // 外键类型要特殊整合
                copySaveDataForParam[b.colname] = [{ ID: b.refobjid, Label: b.valuedata }];
              } else if (b.fkdisplay === 'mop') {
                try {
                  const number = JSON.parse(b.valuedata).lists.result.length;
                  copySaveDataForParam[b.colname] = [{ ID: b.valuedata, Label: `已经选中${number}条数据` }];
                } catch (e) {
                  copySaveDataForParam[b.colname] = b.valuedata;
                }
              } else {
                copySaveDataForParam[b.colname] = b.valuedata;// 重组数据添加到add
              }
            }
          }
        }
      });
    });
    state.updateData[tableName].changeData = Object.assign({}, copySaveDataForParam, modifyData);// 用于通过改变changeData触发form抛出值，以便保存时可以拿到add里面的值作为参数
    state.updateData = Object.assign({}, state.updateData);
    state.tabPanels[0].componentAttribute.panelData.data = copyDatas.data;// 替换panelData新增逻辑接口返回数据，将上一界面值重新赋值给form
    state.tabPanels[0].componentAttribute.panelData.data.copy = true;
  },
  emptyChangeData(state, tableName) {
    state.updateData[tableName].changeData = {};
  },
  updateCopyDataForRealdOnly(state, data) {
    state.copyDataForReadOnly = data;
  },
  updateButtonsExport(state, data) { // 导出
    state.buttonsData.exportdata = data;
  },
  updatetooltipForItemTableData(state, data) { // 表格操作单条明细失败返回值
    state.tooltipForItemTable = data;
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
  updateCompositeForm(state, data) {
    // 实例挂载
    const CompositeForm = {};
    if (data && data.name) {
      CompositeForm[data.name] = data.vm;
      state.CompositeForm = Object.assign(state.CompositeForm, CompositeForm);
    } else {
      state.CompositeForm = {};
    }
  },
  updateMaping(state, data) {
    // form 联动校验map 图
    //  获取映射关系
    const temp = Object.keys(data).reduce((a, c) => {
      const f = (key) => {
        if (!data[key]) {
          return [];
        }
        return [data[key]].concat(f(data[key]));
      };
      a[c] = f(c);
      return a;
    }, {});
    return temp;
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
  jflowPlugin(state, {
    buttonsData, newButtons, instanceId, tabwebact
  }) { // jflowPlugin按钮逻辑
    if (!custommizedJflow()) {
      state.jflowPluginDataArray = newButtons;
      state.instanceId = instanceId;
      if (instanceId) {
        state.tabPanels[0].componentAttribute.buttonsData.data.tabwebact.objbutton = [];
      } else {
        state.tabPanels[0].componentAttribute.buttonsData.data.tabwebact = state.defaultButtonData.tabwebact;
      }
      state.tabPanels[0].componentAttribute.buttonsData.data.tabcmd.prem = buttonsData;
    }
  },
  updateRefreshButton(state, value) { // 控制刷新按钮开关
    state.refreshButton = value;
  },
  updateRefreshButtonForJflow(state, value) { // 控制刷新按钮开关
    state.jflowConfigrefreshButton = value;
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
  // testUpdateData(state, itemName) { // 检测数据变化
  //   const { tableName, itemId } = router.currentRoute.params;
  //   if (itemId === 'New') { // 单对象新增界面
  //     const addDataForItemTable = state.updateData[tableName].add[itemName];
  //     const addDataForMainTable = state.updateData[tableName].add[tableName];
  //     if (JSON.stringify(addDataForItemTable) === '{}' && JSON.stringify(addDataForMainTable) === '{}') {
  //       this.state.global.testData = true;
  //     } 
  //   } // 单对象编辑界面
  //   const modifyDataForItemTable = state.updateData[tableName].modify[itemName];
  //   const modifyDataForMainTable = state.updateData[tableName].modify[tableName];

  //   if (JSON.stringify(modifyDataForItemTable) === '{}' && JSON.stringify(modifyDataForMainTable) === '{}') {
  //     debugger;
  //     this.state.global.testData = true;
  //   }
  //   this.state.global.testData = false;
  // },
 
  updateWebConf(state, data) { // 更新主表配置WebConf
    state.WebConf = data;
  },
  updateButtonGetActionData(state, data) {
    state.ExeActionDataForComponent = data;
  },
};
