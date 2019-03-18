

export default {
  updateTableData({ ag }, data) {
    ag.datas = data;
  },
  updateTableStatus4css({ ag }, data) {
    ag.status4css = data;
  },

  // 表单
  updateDefaultFormItemsLists({ formItems }, data) {
    formItems.defaultFormItemsLists = data;
  },
  updateFormData({ formItems }, data) {
    formItems.data = data;
  },

  // 按钮组
  updateButtonsTabcmd({ buttons }, data) {
    buttons.tabcmd = data;
  },
  updateButtonWaListButtons({ buttons }, data) {
    buttons.waListButtons = data;
  },
};
