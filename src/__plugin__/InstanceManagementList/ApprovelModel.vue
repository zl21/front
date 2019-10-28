<template>
  <div>
    <Modal
      v-model="modalConfig.control"
      :title="type==='3'?'选择转派人':'审批意见'"
      :mask="true"
      :width="type==='3'?835:520"
      @on-ok="ok"
      @on-cancel="cancel"
    >
      <div
        v-if="type==='0'"
        class="ApprovelModel"
      >
        <!-- 同意 -->
        <Input
          v-model="agreecontent"
          type="textarea"
          :rows="4"
          placeholder="请输入审批意见"
        />
      </div>
      <div
        v-if="type==='1'"
        class="ApprovelModel"
      >
        <!-- 驳回 -->
        <div class="returnWrap">
          <span class="requireStyle">*</span>
          <Select
            v-model="returnOption"
            style="margin-bottom:10px"
            placeholder="请选择审批单驳回至哪个节点"
          >
            <Option
              v-for="item in returnSelection"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </Option>
          </Select>
        </div>
        <Input
          v-model="returnContent"
          type="textarea"
          :rows="4"
          placeholder="请输入审批意见"
        />
      </div>
      <div
        v-if="type==='3'"
        class="ApprovelModel"
      >
        <!-- 转派 -->
        <mutipleSelectPop
          ref="dialogtest"
          :loading="loading"
          :tree-loading="tree_loading"
          :table-loading="tableLoading"
          :treedata="treedata"
          :component-data="componentData"
          :result-data="resultData"
          :is-use="false"
          @on-select-tree="selectTtree"
          @on-change-tree="changeTtree"
          @on-change-page="changePage"
          @on-change-pageSize="changePageSize"
          @on-row-dblclick="rowdbClick"
          @on-row-click="rowClick"
          @on-search="inputsearch"
          @on-transfer="transfer"
          @on-delectli="deleteLi"
          @on-deleBtn="deleBtn"
        />
      </div>
    </Modal>
  </div>
</template>
<script>
  import mutipleSelectPop from './MutipleSelectPop';

  export default {
    name: 'ApprovelModel',
    components: { mutipleSelectPop },
    props: {
      config: {
        type: Object,
        default: () => ({})
      }
    },
    computed: {
      modalConfig() {
        return this.config;
      },
      type() {
        return this.modalConfig.type;
      },
      returnSelection() {
        if (this.modalConfig.selection && this.modalConfig.selection.length > 0) {
          return this.modalConfig.selection.reduce((acc, cur) => {
            const itemobj = Object.assign({}, cur);
            itemobj.value = cur.nodeId;
            itemobj.label = cur.nodeName;
            acc.push(itemobj);
            return acc;
          }, []);
        } 
        return [];
      }
    },
    data() {
      return {
        title: '审批意见',
        agreecontent: '',
        returnOption: '',
        returnContent: '', // 驳回审批意见
        treedata: [],
        loading: false, // z最大loading
        tree_loading: true, // 左边的 的loading
        tableLoading: false, // 中间的 的loading
        componentData: [
          {
            tab: '筛选结果',
            columns: [
              { key: 'NAME', title: '用户名' },
              { key: 'ENAME', title: '用户姓名' }
            ],
            list: [],
            total: 0,
            pageSize: 10,
            pageNum: 1, // 当前页码
            pageOptions: [10, 20, 50, 100],
            height: 300
          }
        ],
        resultData: {}, // 选中结果
        selectRow: {}, // 选中的行
        obj: {} //
      };
    },
    methods: {
      treeTransArray(tree, key) {
        // 数转化为数组
        return tree
          .reduce(function iteration(con, item) {
            con.push(item);
            if (item[key] && item[key].length > 0) { item[key].reduce(iteration, con); }
            return con;
          }, [])
          .map((item) => {
            item[key] = [];
            return item;
          });
      },
      // 表格体数据转化
      transferTbody(data) {
        this.componentData[0].total = data.totalRowCount;
        this.componentData[0].pageOptions = data.selectrange;
        this.componentData[0].list = [];
        data.row.map((item) => {
          const tem = {};
          Object.keys(item).map((inner) => {
            tem[inner] = item[inner].val;
          });
          if (this.APPROVEL_DRIVER_LIST && this.APPROVEL_DRIVER_LIST.length > 0) {
            // 给表格设置默认选中
            this.APPROVEL_DRIVER_LIST.map((inner) => {
              if (tem.ID === inner.approve_value) {
                tem._checked = true;
              }
            });
          }
          this.componentData[0].list.push(tem);
        });
      },
      // 查找用户信息
      findUser(param) {
        this.tableLoading = true;
        this.$network.post('/jflow/p/c/identity/user/list', param).then((res) => {
          this.tableLoading = false;
          const data = res.data;
          if (data.code === 0) {
            this.transferTbody(data.data);
          }
        });
      },
      // 获取树数据
      getTreeData() {
        this.$network.post('/jflow/p/c/identity/org/treeload', {}).then((res) => {
          this.tree_loading = false;
          if (res.data.resultCode === 0) {
            this.treedata = [];
            const newArr = [];
            let root = {};
            if (res.data.data.records.length > 0) {
              res.data.data.records.forEach((item) => {
                const tem = Object.assign(item);
                newArr.push(tem);
                if (
                  item.CP_C_ORGUP_ID === null
                  || item.CP_C_ORGUP_ID === ''
                ) {
                  root = Object.assign(item.CP_C_ORGUP_ID);
                }
              });
              if (Object.keys(root).length < 1) {
                newArr.push({
                  CP_C_ORGUP_ID: null,
                  ECODE: '00001',
                  ENAME: '全部',
                  ID: 'CP_C_HRORG.2',
                  MIXNAME: '[00001]全部',
                  ORGTYPE: 'IN',
                  TYPE: 'CP_C_HRORG_ID'
                });
              }
              this.treedata = this.arrayTransTree(newArr, 'CP_C_ORGUP_ID');
            }
            this.findUser({});
          }
        });
      },
      // 改造树数据的结构
      arrayTransTree(list, key) {
        const parent = [];
        const children = [];
        list.map((item) => {
          item.expand = false;
          item.title = item.ENAME;
          if (item[key] === null || item[key] === '') {
            // 根节点
            parent.push(item);
          } else {
            // 有父节点的
            children.push(item);
          }
        });
        this.translator(parent, children, key);
        return parent;
      },
      translator(parents, children, key) {
        const temp = [];
        children.map((item) => {
          // 对子节点数据进行深复制，这里只支持部分类型的数据深复制，对深复制不了解的童靴可以先去了解下深复制
          const temItem = Object.assign({}, item);
          temp.push(temItem);
        });
        // 遍历父节点数据
        parents.map((parent) => {
          // 遍历子节点数据
          children.map((current, index) => {
            // 此时找到父节点对应的一个子节点
            if (current[key] === parent.ID) {
              // 让当前子节点从temp中移除，temp作为新的子节点数据，这里是为了让递归时，子节点的遍历次数更少，如果父子关系的层级越多，越有利
              temp.splice(index, 1);
              // 让当前子节点作为唯一的父节点，去递归查找其对应的子节点
              this.translator([current], temp, key);
              // 把找到子节点放入父节点的children属性中
              parent.children
                ? parent.children.push(current)
                : (parent.children = [current]);
            }
          });
        });
      },
      selectTtree(val, vm) {
        this.obj = {};
        if (this.val.length > 0) {
          this.saveObj = val[0];
          const self = this;
          let valID = val[0].ID.split('.')[1];
          valID = parseInt(valID);
          if (val[0].CP_C_ORGUP_ID === null) {
            // 根节点
            this.findUser({});
          } else {
            // 当item的TYPE为店仓时
            if (val[0].TYPE === 'CP_C_STORE_ID') {
              this.obj.CP_C_STORE_ID = `in(${valID})`;
            }
            // 当item的TYPE为供应商时
            //  当item的TYPE为组织时
            if (val[0].TYPE === 'CP_C_HRORG_ID') {
              this.$network
                .post('/jflow/p/c/identity/org/treequery', { ID: valID })
                .then((res) => {
                  if (res.data.resultCode === 0) {
                    let HRORG = 'in ('; // 储存键名为CP_C_HRORG_ID对象的ID
                    let STORE = 'in ('; // 储存键名为CP_C_STORE_ID对象的ID
                    if (
                      res.data.data.CP_C_HRORG
                      && res.data.data.CP_C_HRORG.length > 0
                    ) {
                      res.data.data.CP_C_HRORG.forEach((item) => {
                        HRORG += `${item.ID},`; // in 1,2,3,5,6,87,8,6
                      });
                      if (res.data.data.CP_C_HRORG.length > 0) {
                        self.obj.CP_C_HRORG_ID = `${HRORG.substring(0, HRORG.length - 1)})`;
                      }
                    }
                    if (
                      res.data.data.CP_C_STORE
                      && res.data.data.CP_C_STORE.length > 0
                    ) {
                      res.data.data.CP_C_STORE.forEach((item) => {
                        STORE += `${item.ID},`;
                      });
                      if (res.data.data.CP_C_STORE.length > 0) {
                        self.obj.CP_C_STORE_ID = `${STORE.substring(0, STORE.length - 1)})`;
                      }
                    }
                  } else {
                    this.$Modal.fcError({
                      title: '错误提示',
                      content: res.data.resultMsg
                    });
                  }
                });
            }
            setTimeout(() => {
              self.findUser(self.obj);
            });
          }
        }
      },
      changeTtree(selectedData, vm) {},
      changePage(index, vm) {
        this.componentData[0].pageNum = index;
        const param = Object.assign(this.obj, {
          page: index,
          pageSize: this.componentData[0].pageSize
        });
        this.findUser(param);
      },
      changePageSize(index, vm) {
        this.componentData[0].pageSize = index;
        const param = Object.assign(this.obj, {
          page: this.componentData[0].pageNum,
          pageSize: index
        });
        this.findUser(param);
      },
      rowClick(row, index, vm) {
        this.selectRow = Object.assign(this.selectRow, row);
      },
      rowdbClick(row, index) {
        // 双击事件
        const selectObj = Object.assign({}, row);
        selectObj.string = selectObj.ENAME;
        if (this.resultData.list) {
          this.resultData.list = [];
          this.resultData.list.push(selectObj);
        } else {
          this.$set(this.resultData, 'list', [selectObj]);
        }
        this.resultData.total
          ? (this.resultData.total = 1)
          : this.$set(this.resultData, 'total', 1);
        this.componentData[0].list.map((item, i) => {
          item._checked = false;
        });
        this.selectRow = Object.assign({}, row);
      },
      // 搜索
      inputsearch(event, vm) {
        const param = Object.assign(this.obj, {
          page: this.componentData[0].pageNum,
          pageSize: this.componentData[0].pageSize,
          ENAME: event
        });
        this.findUser(param);
      },
      transfer(vm) {
        this.resultData.total
          ? (this.resultData.total = 1)
          : this.$set(this.resultData, 'total', 1);
        const selectObj = Object.assign({}, this.selectRow);
        selectObj.string = selectObj.ENAME;
        if (this.resultData.list) {
          this.resultData.list = [];
          this.resultData.list.push(selectObj);
        } else {
          this.$set(this.resultData, 'list', [selectObj]);
        }
        this.componentData[0].list.map((item) => {
          item._checked = false;
        });
        this.componentData[0].list = this.componentData[0].list.concat([]);
      },
      deleteLi(index, tem) {
        // 删除li
        this.resultData.total = this.resultData.total - 1;
        this.resultData.list.splice(index, 1);
      },
      deleBtn(vm) {
        // 全部清空事件
        this.resultData.total = 0;
        this.resultData.list = [];
      },
      ok() {
        if (this.type === '0') {
          this.Agree(); // 同意
        }
        if (this.type === '1') {
          this.back(); // 驳回
        }
        if (this.type === '3') {
          this.delegate(); // 转派
        }
      },
      cancel() {
        window.jflowPlugin.open({ control: false });
      },
      Agree() {
        const children = document.getElementsByClassName('operate-btn')[0].children;
        for (const child of children) {
          if (child.innerText.trim() !== '同意') {
            child.setAttribute('disabled', 'disabled');
          }
        }
        const param = {};
        param.instanceId = window.jflowPlugin.objInstanceId;
        param.userId = window.jflowPlugin.userInfo.id;
        param.description = this.agreecontent; // 审批意见
        this.$network.post(this.modalConfig.url, param).then((res) => {
          window.jflowPlugin.open({ control: false });
          if (res.data.resultCode === 0) {
            this.$Message.success(res.data.resultMsg);
            this.modalConfig.buttons(window.jflowPlugin.itemId);
          } else {
            this.$Modal.fcWarning({
              title: '警告',
              content: res.data.resultMsg,
              mask: true
            });
          }
        });
      },
      // 驳回
      back() {
        const children = document.getElementsByClassName('operate-btn')[0].children;
        for (const child of children) {
          if (child.innerText.trim() !== '驳回') {
            child.setAttribute('disabled', 'disabled');
          }
        }
        const param = {};
        param.instanceId = window.jflowPlugin.objInstanceId;
        param.userId = window.jflowPlugin.userInfo.id;
        if (this.returnOption === '') {
          this.$Message.warning('驳回节点不能为空');
          window.jflowPlugin.open({ control: false });
          return;
        } 
        param.backId = this.returnOption; // 驳回节点id
      
        param.description = this.returnContent; // 审批意见
        this.$network.post(this.modalConfig.url, param).then((res) => {
          window.jflowPlugin.open({ control: false });
          if (res.data.resultCode === 0) {
            this.$Message.success(res.data.resultMsg);
            this.modalConfig.buttons(window.jflowPlugin.itemId);
          } else {
            this.$Modal.fcWarning({
              title: '警告',
              content: res.data.resultMsg,
              mask: true
            });
          }
        });
      },
      // 转派
      delegate() {
        const children = document.getElementsByClassName('operate-btn')[0].children;
        for (const child of children) {
          if (child.innerText.trim() !== '转派') {
            child.setAttribute('disabled', 'disabled');
          }
        }
        const param = {};
        param.instanceId = window.jflowPlugin.objInstanceId;
        param.userId = window.jflowPlugin.userInfo.id;
        param.delegateId = this.selectRow.ID; // 驳回节点id
        this.$network.post(this.modalConfig.url, param).then((res) => {
          window.jflowPlugin.open({ control: false });
          if (res.data.resultCode === 0) {
            this.$Message.success(res.data.resultMsg);
            this.selectRow = {};
            this.modalConfig.buttons(window.jflowPlugin.itemId);
          } else {
            this.$Modal.fcWarning({
              title: '警告',
              content: res.data.resultMsg,
              mask: true
            });
          }
        });
      }
    },
    created() {
      this.getTreeData();
    }
  };
</script>
<style lang="less" scoped>
.ApprovelModel {
  .returnWrap {
    width: 100%;
    display: flex;
    .requireStyle {
      color: red;
      line-height: 24px;
    }
    .burgeon-select .burgeon-select-single .burgeon-select-default {
      width: calc(100%-10px);
    }
  }
}
</style>
