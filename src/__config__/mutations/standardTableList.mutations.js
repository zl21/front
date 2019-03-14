export default {
  updateTableData({ ag }, data) {
    ag.datas = data;
  },
  updateDefaultFormItemsLIsts({ formItems }, data) {
    formItems.defaultFormItemsLIsts = data;
  },
  updateFormData({ formItems }, data) {
    formItems.data = data;
  },
  updateCurrentFormItemsLists({ formItems }, data) {
    formItems.formItemsLIsts = data;
  }
};
