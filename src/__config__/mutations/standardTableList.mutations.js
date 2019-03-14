export default {
  updateTableData({ ag }, data) {
    ag.datas = data;
  },
  updateTableStatus4css({ ag }, data) {
    ag.status4css = data;
  },

  // 表单
  updateDefaultFormItemsLIsts({ formItems }, data) {
    formItems.defaultFormItemsLIsts = data;
  },
  updateFormData({ formItems }, data) {
    formItems.data = data;
  },
  updateCurrentFormItemsLists({ formItems }, data) {
    formItems.formItemsLIsts = data;
  },

  // 按钮组
  updateButtonsTabcmd({ buttons }, data) {
    buttons.tabcmd = data;
  },
  updateButtonWaListButtons({ buttons }, data) {
    buttons.waListButtons = data;
  },
};
