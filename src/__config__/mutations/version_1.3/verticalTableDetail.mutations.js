import { stringify } from 'querystring';
import { cpus } from 'os';
import router from '../../router.config';
import { enableJflow, custommizedJflow } from '../../../constants/global';
import getComponentName from '../../../__utils__/getModuleName';

export default {
  updataClickSave(state, func) {
    state.clickSaveFunction = func;
  },
  updataHideTempStorage(state, value) { // 控制单对象界面暂存按钮
    state.isHideTempStorage = value;
  },
  updateObjectForMainTableForm(state, data) { // 更新主表面板数据
    const { tableName, tableId } = router.currentRoute.params;
    state.mainFormInfo.tablename = tableName;
    state.mainFormInfo.tableid = tableId;
    state.mainFormInfo.formData.isShow = data && data.addcolums && data.addcolums.length > 0;
    if (enableJflow() && custommizedJflow() && this.state.global.JflowControlField.length > 0) {
      data.isJflowConfig = true;
      setTimeout(() => {
        this.commit(`${getComponentName()}/updatePanelData`, data);
        // this._mutations[`${getComponentName()}/updatePanelData`][0](data);
      }, 500);
    } else {
      state.mainFormInfo.formData.data = Object.assign({}, data);
    }
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
  updatePanelData(state, data) { // 更新子表面板数据
    if (data.id) {
      state.itemObjId = data.id;
    }
    // state.instanceId = 1;
    if (enableJflow() && custommizedJflow() && this.state.global.JflowControlField.length > 0) { // 加jflow
      // 子表是一对一模式下，且JflowControlField所返回的是当前子表需要修改的信息
      let tableNameFlag = false;
      const JflowControlFieldData = this.state.global.JflowControlField.filter((item) => {
        const { tableId } = router.currentRoute.params;
        if (item.tableId === tableId) {
          if (item.tableId === item.itemTableId && data.isJflowConfig) { // 主表修改字段
            tableNameFlag = true;
            // const b = this.state.global.objreadonlyForJflow.filter(a => a.itemTableName !== item.itemTableName && a.itemTableName !== item.itemTableName);
            
            // if (b.length === 0) { // 去重
            this.state.global.objreadonlyForJflow.push(
              {
                readonly: false,
                itemTableId: Number(item.itemTableId),
                tableId: item.tableId
              }
            );
            // }
           
            item.isJflowConfigMainTable = true;

            return true;
          } if (!data.isJflowConfig && state.tabPanels[data.tabIndex].tableid === Number(item.itemTableId)) { // 子表修改字段
            if (state.tabPanels[data.tabIndex].tabrelation === '1:1') { // 子表为1:1状态或配置中itemTableName=tableName（此时为主表修改字段）
              // const b = this.state.global.objreadonlyForJflow.filter(a => a.itemTableName !== item.itemTableName && a.itemTableName !== item.itemTableName);
              // if (b.length === 0) { // 去重
              this.state.global.objreadonlyForJflow.push(
                {
                  readonly: false,
                  itemTableId: Number(item.itemTableId),
                  tableId: item.tableId
                }
              );
              // }
              return true;
            } 
          }
        } 
      });
      if (JflowControlFieldData[0]) { // 符合jflow控制子表字段配置条件执行以下逻辑
        state.isHideTempStorage = true;


        // let dataArray = [];
        // if (tableNameFlag && data.isJflowConfig) { // 主表
        //   // dataArray = state.mainFormInfo.formData.data.addcolums;
        //   dataArray = data.addcolums;
        // } else { // 子表
        //   dataArray = data.addcolums;
        // }
        if (data.isJflowConfig) { // jflow修改字段配置为主表
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
          
          // 以下为主表jflow自定义按钮显示逻辑
          if (state.mainFormInfo.buttonsData.data.tabwebact && state.mainFormInfo.buttonsData.data.tabwebact.objbutton.length > 0) {
            const objtabbuttons = state.mainFormInfo.buttonsData.data.tabwebact.objbutton;
            const buttonsJflowRes = [];
            if (JflowControlFieldData[0].exeActionButton.length > 0) {
              JflowControlFieldData[0].exeActionButton.forEach((buttonId) => {
                objtabbuttons.forEach((objbutton) => {
                  if (String(buttonId) === String(objbutton.webid)) {
                    buttonsJflowRes.push(objbutton);
                  }
                });
              });
              if (buttonsJflowRes.length > 0) { // jflow exeActionButton配置中包含子表自定义按钮ID
                state.mainFormInfo.buttonsData.data.tabwebact.objbutton = buttonsJflowRes;
              }
            } else { // jflow exeActionButton配置为空时，去除元数据返回的自定义按钮
              state.mainFormInfo.buttonsData.data.tabwebact.objbutton = [];
            }
          }
          // jflowButtons有返回值时，将元数据标准以及刷新按钮去除
          if (JflowControlFieldData[0].jflowButton && JflowControlFieldData[0].jflowButton.length > 0) {
            // 如果jflowButton配置了按钮，则将元数据返回按钮删除，显示jflow按钮
            if (state.mainFormInfo.buttonsData.data.tabcmd && state.mainFormInfo.buttonsData.data.tabcmd.prem && state.mainFormInfo.buttonsData.data.tabcmd.prem.length > 0) {
              state.mainFormInfo.buttonsData.data.tabcmd.prem = state.mainFormInfo.buttonsData.data.tabcmd.prem.map((item, index) => {
                if (JflowControlFieldData[0].readonly.length > 0 && state.mainFormInfo.buttonsData.data.tabcmd.cmds[index] === 'actionMODIFY') { // 如果配置了可编辑字段，则显示保存按钮
                  item = true;
                  return item;
                }
                item = false;
                return item;
              });
            }
            state.mainFormInfo.buttonsData.data.jflowButton = JflowControlFieldData[0].jflowButton;
            state.jflowConfigrefreshButton = true;
          }

          state.mainFormInfo.formData.data = Object.assign({}, data);
          state.mainFormInfo.formData.data.addcolums = addcolumsData;// 主表赋值逻辑
          // 以下为子表赋值逻辑
          // const { componentAttribute } = state.tabPanels[data.tabIndex];
          // componentAttribute.panelData.isShow = true;
          // componentAttribute.panelData.data = data;// 子表赋值逻辑
        } else if (!JflowControlFieldData[0].isJflowConfigMainTable) { // jflow配置为子表
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
          componentAttribute.buttonsData.data.isItemTableVertical = true;// 此字段用于单对象按钮组件控制样式
          if (componentAttribute.buttonsData.data.tabwebact && componentAttribute.buttonsData.data.tabwebact.objtabbutton.length > 0) {
            const objtabbuttons = componentAttribute.buttonsData.data.tabwebact.objtabbutton;
    
            let buttonsJflowRes = [];
            if (JflowControlFieldData[0].exeActionButton.length > 0) {
              JflowControlFieldData[0].exeActionButton.forEach((buttonId) => {
                buttonsJflowRes = objtabbuttons.filter((objtabbutton) => {
                  if (String(buttonId) === String(objtabbutton.webid)) {
                    return objtabbutton;
                  }
                });
              });
              if (buttonsJflowRes.length > 0) { // jflow exeActionButton配置中包含子表自定义按钮ID，则显示
                componentAttribute.buttonsData.data.tabwebact.objbutton = buttonsJflowRes;// 上下结构，1:1面板+单对象按钮组件，自定义类型按钮需放在objbutton可显示
              } 
            } else { // jflow exeActionButton配置为空时，去除元数据返回的自定义按钮
              componentAttribute.buttonsData.data.tabwebact.objbutton = [];
            }
          }
          if (JflowControlFieldData[0].jflowButton && JflowControlFieldData[0].jflowButton.length > 0) {
            // 如果jflowButton配置了按钮，则将元数据返回按钮删除，显示jflow按钮
            if (componentAttribute.buttonsData.data.tabcmd && componentAttribute.buttonsData.data.tabcmd.prem && componentAttribute.buttonsData.data.tabcmd.prem.length > 0) {
              componentAttribute.buttonsData.data.tabcmd.prem = componentAttribute.buttonsData.data.tabcmd.prem.map((item, index) => {
                // if (JflowControlFieldData[0].readonly.length > 0 && componentAttribute.buttonsData.data.tabcmd.cmds[index] === 'actionMODIFY') { // 如果配置了可编辑字段，则显示保存按钮
                //   item = true;
                //   return item;
                // }
                item = false;
                return item;
              });
            }
            componentAttribute.buttonsData.data.backButton = false;// 控制子表按钮返回按钮显示
            componentAttribute.buttonsData.data.jflowButton = JflowControlFieldData[0].jflowButton.filter(jflowButton => jflowButton.button !== 'fresh');
            componentAttribute.buttonsData.isShow = true;// 1:1form组件上显示单对象按钮组件
            state.jflowConfigrefreshButton = true;
          }
          // 以下逻辑为当前jflow配置的为子表时，当前单据其余表按钮展示逻辑
          // 上下结构只有当前配置表展示按钮，其余子表不展示按钮，主表展示刷新/复制/返回
          // 刷新按钮显示jflow返回的刷新
     
          state.mainFormInfo.buttonsData.data.tabcmd.prem = state.mainFormInfo.buttonsData.data.tabcmd.prem.map((item, index) => { // 筛选复制按钮
            if (state.mainFormInfo.buttonsData.data.tabcmd.cmds[index] === 'actionCANCOPY') { // 如果配置了可编辑字段，则显示复制按钮
              item = true;
              return item;
            }
            if (JflowControlFieldData[0].readonly.length > 0 && state.mainFormInfo.buttonsData.data.tabcmd.cmds[index] === 'actionMODIFY') { // 如果配置了可编辑字段，则显示保存按钮
              item = true;
              return item;
            }
            item = false;
            return item;
          });
          state.mainFormInfo.buttonsData.data.tabwebact.objbutton = [];// 将主表自定义按钮置为空
          state.mainFormInfo.buttonsData.data.jflowButton = JflowControlFieldData[0].jflowButton.filter(jflowButton => jflowButton.button === 'fresh');
        } else {
          const { componentAttribute } = state.tabPanels[data.tabIndex];
          componentAttribute.panelData.isShow = true;
          componentAttribute.panelData.data = data;
        }
        
       
        // 处理jflow配置自定义按钮逻辑
      } else if (data.isJflowConfig) {
        state.mainFormInfo.formData.data = Object.assign({}, data);
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
    data.tabcmd.cmds.some((b, i) => {
      if (b === 'actionMODIFY') {
        state.saveInfo = {
          paths: data.tabcmd.paths[i],
          name: 'actionMODIFY',
        };
      }
    });
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
    buttonsData, newButtons, instanceId, tabwebact
  }) { // jflowPlugin按钮逻辑
    if (!custommizedJflow()) {
      state.jflowPluginDataArray = newButtons;
      state.instanceId = instanceId;
      if (instanceId) {
        state.mainFormInfo.buttonsData.data.tabwebact.objbutton = [];
      } else {
        state.mainFormInfo.buttonsData.data.tabwebact = state.defaultButtonData.tabwebact;
      }
      state.mainFormInfo.buttonsData.data.tabcmd.prem = buttonsData;
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
  updatetooltipForItemTableData(state, data) { // 表格操作单条明细失败返回值
    state.tooltipForItemTable = data;
  },
  updateWebConf(state, data) { // 更新主表配置WebConf
    state.WebConf = data;
  },
  updateButtonGetActionData(state, data) {
    state.ExeActionDataForComponent = data;
  },
};
