import { stringify } from 'querystring';
import router from '../router.config';

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
      delete: Object.assign({}, { [tableName]: {} }),
      default: {},
      checkedInfo: {},
      changeData: Object.assign({}, state.updateData[tableName] ? state.updateData[tableName].changeData : {}) // 表单修改的值，第二次回显用
    };
  },
  updateMainTabPanelsData(state, data) { // 更新主表tab数据
    const arr = [];
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
        delete: Object.assign({}, { [item.tablename]: {} }),
        default: {},
        checkedInfo: {},
        changeData: Object.assign({}, state.updateData[item.tablename] ? state.updateData[item.tablename].changeData : {}) // 表单修改的值，第二次回显用
      };
      arr.push(obj);
    });
    state.tabPanels = arr;
  },
  updateMainButtonsData({ mainFormInfo }, data) { // 更新主表按钮数据
    // state.mainFormInfo.buttonsData.isShow = true;
    mainFormInfo.buttonsData.data = data;
  },
  updateRefButtonsData(state, data) { // 更新子表按钮数据
    const { componentAttribute } = state.tabPanels[state.tabCurrentIndex];
    componentAttribute.buttonsData.isShow = false;
    componentAttribute.buttonsData.data = data;
  },
  updateFormDataForRefTable(state, data) { // 更新子表表单数据
    const { componentAttribute } = state.tabPanels[state.tabCurrentIndex];
    componentAttribute.formData.isShow = data.inpubobj && data.inpubobj.length > 0;
    componentAttribute.formData.data = data || [];
  },
  updateFormDataForRefshow(state) { // 去除子表缓存
    state.mainFormInfo.formData.isShow = false;
  },
  updateTableListForRefTable(state, data) { // 更新子表列表数据
    const { componentAttribute } = state.tabPanels[state.tabCurrentIndex];
    componentAttribute.tableData.isShow = data.tabth && data.tabth.length > 0;
    componentAttribute.tableData.data = data;
  },
  updateTabCurrentIndex(state, index) { // 更新当前tab的索引
    state.tabCurrentIndex = index;
  },
  updateDefaultData(state, data) {
    state.updateData[data.tableName].default = data.value;
  },
  updateAddData(state, data) {
    state.updateData[data.tableName].add[data.tableName] = Object.assign(state.updateData[data.tableName].add[data.tableName], data.value[data.tableName]);
  },
  updateModifyData(state, data) {
    state.updateData[data.tableName].modify = data.value;
  },
  updateDeleteData(state, data) {
    state.updateData[data.tableName].delete = data.value;
  },
  updateChangeData(state, data) {
    state.updateData[data.tableName].changeData = data.value;
  },
  updateCheckedInfoData(state, data) {
    state.updateData[data.tableName].checkedInfo = data.value;
  },
  updatePanelData(state, data) { // 更新子表面板数据
    const { componentAttribute } = state.tabPanels[state.tabCurrentIndex];
    componentAttribute.panelData.isShow = true;
    componentAttribute.panelData.data = data;
  },

  updateNewMainTableAddSaveData(state, { data, itemName }) { // 主表新增保存返回信息
    console.log('🍓', data.data);
    state.buttonsData.newMainTableSaveData = data.data;
    state.buttonsData.message = data.message;
  },
  updateNewMainTableDeleteData(state, data) { // 删除返回信息
    state.buttonsData.deleteData = data.message;
  },
  changeCopy(state, data) {
    state.copy = data;
  },
  copyDefaultData(state, copyDefaultData) { // 执行按钮复制操作重新给form赋值
    Object.assign(state.mainFormInfo.formData, copyDefaultData);
  },
  savaCopyData(state, copyData) { // 执行按钮复制操作存储form默认值数据
    state.defaultDataForCopy = copyData;
    // state.defaultDataForCopy.data.addcolums.map((item, index) => {
    //   if (item.parentdesc === '日志') {
    //     return state.defaultDataForCopy.data.addcolums.splice(index, 1);
    //   }
    //   return state.defaultDataForCopy; 
    // });
  },
  changeFormDataForCopy(state, { defaultForCopyDatas, tableName }) {
    state.updateData[tableName].add = defaultForCopyDatas;
  },
  updateCopyDataForRealdOnly(state, data) { // 储存接口返回数据作为复制按钮操作的配置信息
    state.copyDataForReadOnly = data;
  },
  updateCopyData(state, tableName) { // form的配置信息按照新增接口返回值
    const copySaveDataForParam = {};
    if (Object.keys(state.defaultDataForCopy).length > 0) {
      state.copyDataForReadOnly.addcolums.forEach((d) => { // 复制按钮操作时江接口请求回来的配置信息赋值给form
        state.defaultDataForCopy.data.addcolums.forEach((item) => {
          d.childs.forEach((c) => {
            item.childs.forEach((b) => {
              if (b.name === c.name) {
                b.readonly = c.readonly;
                if (c.readonly === true) {
                  b.valuedata = '';// 将配置为不可编辑的值置空
                } else if (b.fkdisplay === 'drp' || b.fkdisplay === 'mrp') {
                  copySaveDataForParam[b.colname] = b.refobjid;
                } else {
                  copySaveDataForParam[b.colname] = b.valuedata;
                }
              }
            });
          });
        });
      }); 

      state.updateData[tableName].add[tableName] = copySaveDataForParam;
      state.mainFormInfo.formData = Object.assign({}, state.defaultDataForCopy, state.copyDataForReadOnly);
    }
  },
  emptyChangeData(state, tableName) {
    if (state.updateData[tableName].changeData) {
      state.updateData[tableName].add = {};
      state.updateData[tableName].changeData = {};
    }
  }
};
