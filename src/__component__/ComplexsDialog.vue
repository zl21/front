<template>
  <div class="dialog">
    <Complexs-dialog
      :treedata="Tree"
      :component-data="componentData"
      :result-data="resultData"
      @on-change-tree="changeTtree"
      @on-click-tab="clickTab"
      @on-change-page="changePage"
      @on-change-pageSize="changePageSize"
      @on-row-dblclick="rowdbclick"
      @on-row-click="rowclick"
      @on-search="inputsearch"
      @on-checkbox-change="checkboxChange"
      @on-transfer-two="transfertwo"
      @on-transfer="transfer"
      @on-delectli="deleteLi"
      @on-refresh="refreshFun"
      @on-saveBtn="saveBtn"
      @on-deleBtn="deleBtn"
    />
  </div>
</template>

<script>
  import multipleComple from '../constants/compleHttpRequest';


  export default {
    name: 'ComplexSelect',
    props: {
      fkobj: Object,
      default() {
        return {};
      },
      filter: Object,
      default() {
        return {};
      }
    },
    computed: {
      Tree() {
        // console.log(this.treedata,'computed');
        return this.treedata;
      }
    },
    data() {
      return {
        treedata: [], // 左边shu
        componentData: [
          {
            tab: '筛选结果',
            columns: [],
            list: [],
            search: '',
            pageOptions: [10, 20, 50, 100],
            height: 370,
            searchName: '全局检索',
            checked: false
          },
          {
            tab: '查看选中结果',
            columns: [],
            list: [],
            height: 370,
            pageOptions: [10, 20, 50, 100],
            search: '',
            searchName: '查询结果'
          }
        ],
        sendMessage: {
          CONDITION: '', // 组织树
          GLOBAL: '', //  文字查询
          PAGENUM: 1, // 当前页码
          PAGESIZE: 50 // 显示条数
        },
        fkdata: {},
        HRORG_ID: [], // 组织树选中节点
        HRORG_STRING: [],
        AKNAME: '', // CONDITION 下面的拼接条件
        IN: [], // 选中的id
        NOTIN: [], // 点击排除按钮 选中的id
        EXCLUDE: [],
        open: false,
        refresh: false,
        checkbox: false,
        akname: '', // 选中显示的key
        resultData: { // 选中展示列表
          total: 0,
          list: []
        },
        index: 0,
        text: { // 后台 传值
          result: []
        }
      };
    },
    methods: {
      treeRestructure(data) {
        // tree_lists 树形结构重新组合
        this.AKNAME = data.data[0].AKNAME;
        this.treedata = data.data.map((obj) => {
          const option = {};
          option.title = obj.NAME;
          option.expand = !!obj.expand;
          option.children = [...obj.VALUE];
          option.children.forEach((item) => {
            item.title = item.NAME;
          });
          return option;
        });
      },
      treeChecked() {
        // tree_lists 树形结构重新组合
        const self = this;
        this.treedata.map((option) => {
          option.checked = false;
          option.children.map((item) => {
            if ((item.ID.toString()).indexOf(self.HRORG_ID.join(',')) === -1) {
              item.checked = true;
            } else {
              item.checked = false;
              return item;
            }
          });
          return option;
        });
      },
      dateRestructure(data, index, type) {
        // 表格数据的 重新组合
        if (!this.akname) {
          this.akname = data.akname || 'ECODE';
        }

        if (index === 1) {
          this.IN = data.ids || [];
          this.resultData.list = [];
          data.data.list.forEach((item) => {
            // 展示选中内容的key
            item.string = item[this.akname];
            if (type !== 'all') {
              if (this.verifyTem(this.resultData.list, item.ID)) {
                this.resultData.list.push(item);
              }
            }
          });
          // 排除 的
          this.NOTIN.forEach((id) => {
            this.componentData[0].list.forEach((option, key) => {
              if (id === option.ID) {
                option.exclude = true;
                option.string = option[this.akname];
                this.resultData.list.push(option);
              }
            });
          });
          this.resultData.total = data.data.total;
        }

        if (type === 'all') {
          console.log(this.HRORG_STRING);
          if (this.HRORG_STRING.length > 0) {
            this.resultData.list.unshift({
              string: this.HRORG_STRING.join(',')
            });
          }
        }


        this.componentData[index] = Object.assign(this.componentData[index], data.data);

        const header = JSON.parse(data.header);
        this.componentData[0].columns = this.columnsDate(header, 0);
        this.componentData[1].columns = this.columnsDate(header, 1);
      },
      columnsDate(columns, index) {
        // 表格头部 数据重组
        return Object.keys(columns).reduce((item, option, key) => {
          if (option.toUpperCase() === 'ID') {
            item.unshift({
              type: 'index',
              title: '编号'
            });
          } else {
            item.push({
              key: option,
              title: columns[option]
            });
            if (index === 1 && (Object.keys(columns).length - 2) === key) {
              item.push({
                title: '操作',
                key: 'action',
                render: h => h('div', {
                  domProps: {
                    innerHTML: '<i class="iconfont icon-bj_delete2"></i>'
                  },
                  on: {
                    click: () => {
                      this.deleteLi(key, columns);
                    }
                  }
                })
              });
            }
          }
          return item;
        }, []);
      },
      treeId(data) {
        // 获取组织树的选中id
        this.HRORG_ID = Object.keys(data).reduce((item, option) => {
          if (data[option].ID) {
            item.push(data[option].ID);
            this.HRORG_STRING.push(data[option].value);
          }
          return item;
        }, []);
      },
      changeTtree(obj) {
        this.treeId(obj);
        if (this.HRORG_ID.length > 0) {
          this.sendMessage.CONDITION = {};
          this.sendMessage.CONDITION[this.AKNAME] = this.HRORG_ID;
        } else {
          this.sendMessage.CONDITION = '';
        }
        this.multipleSelectionTable(this.sendMessage, 0);
      },
      clickTab(index) {
        // 点击切换tab
        this.index = index;
      },
      changePage(index) {
        // 点击页面
        this.sendMessage.PAGENUM = index;
        this.multipleSelectionTable(this.sendMessage, this.index);
      },
      changePageSize(index) {
        // 点击显示条数
        this.sendMessage.PAGESIZE = index;
        this.multipleSelectionTable(this.sendMessage, this.index);
      },
      rowdbclick(row) {
        // 表格双击
        if (this.index === 0) {
          this.clickChoose(row);
          row.string = row[this.akname];
          this.multipleScreenResultCheck(this.sendMessage, 1);
        }
      },
      rowclick(row) {
        if (this.index === 0) {
          this.clickChoose(row);
        }
      },
      clickChoose(row) {
        // 单击或者双击的选中id
        if (this.checkbox) {
          const checkd = this.verify(this.NOTIN, row.ID);
          if (checkd) {
            this.NOTIN.push(row.ID);
          }
        } else {
          const checkdIN = this.verify(this.IN, row.ID);
          if (checkdIN) {
            this.IN.push(row.ID);
          }
        }
      },
      verifyTem(arr, id) {
        if (!arr.some(x => x.ID === id)) {
          return true;
        }
        return false;
      },
      verify(arr, id) {
        if (!arr.some(x => x === id)) {
          return true;
        }
        this.$Message.info('该记录已在已选中列表中');
        return false;
      },
      inputsearch(event) {
        this.sendMessage.GLOBAL = event.trim();
        this.sendMessage.CONDITION = {};
        this.multipleSelectionTable(this.sendMessage, this.index);
      },
      checkboxChange(value) {
        this.checkbox = value;
      },
      transfertwo() {
        if (this.HRORG_ID.length > 0) {
          this.sendMessage.CONDITION = {};
          this.sendMessage.CONDITION[this.AKNAME] = this.HRORG_ID;
        } else {
          this.sendMessage.CONDITION = '';
        }
        this.multipleScreenResultCheck(this.sendMessage, 1, 'all');
      },
      transfer() {
        this.multipleScreenResultCheck(this.sendMessage, 1);
      },
      deleteLi(index, row) {
        if (!row.exclude) {
          const indexI = (row.ID.toString()).indexOf(this.IN.join(','));
          if (indexI !== -1) {
            this.IN.splice(indexI, 1);
          }
        } else {
          const indexI = (row.ID.toString()).indexOf(this.NOTIN.join(','));
          if (indexI !== -1) {
            this.NOTIN.splice(indexI, 1);
          }
        }
        this.resultData.list.splice(index, 1);
        if (this.resultData.total > 0) {
          this.resultData.total--;
        } else {
          this.resultData.total = 0;
        }
      },
      deleBtn() {
        this.resultData.list = [];
        this.IN = [];
        this.NOTIN = [];
        this.resultData.total = 0;
      },
      saveBtn(value) {
        if (value.length < 1) {
          this.$Message.info('模板名称不能为空');
        }
        this.resultData.list.forEach((item) => {
          if (!item.exclude && item.ID) {
            this.text.result.push({
              exclude: true,
              id_list: [item.ID],
              screen: item.ID,
              screen_string: item.string
            });
          }
        });
        const savemessage = {
          tableid: this.fkobj.reftableid,
          modelname: value,
          multiQuery: {
            value: '',
            text: ''
          }
        };
        this.sendMessage.TABLENAME = this.sendMessage.reftable;
        savemessage.multiQuery.value = this.sendMessage;
        savemessage.multiQuery.value.IN = this.IN;
        savemessage.multiQuery.value.NOTIN = this.NOTIN;
        savemessage.multiQuery.text = JSON.stringify(this.text);
        this.multipleSetMultiQuery(savemessage);
      },
      refreshFun() {
        this.sendMessage.CONDITION = '';
        this.HRORG_ID = [];
        this.sendMessage.GLOBAL = '';
        this.sendMessage.PAGENUM = 1;
        this.sendMessage.PAGESIZE = 50;
        this.treeChecked();
        this.multipleSelectionTable(this.sendMessage, 0);
      },
      multipleSetMultiQuery(obj) {
        multipleComple.multipleSetMultiQuery({
          searchObject: obj,
          success: (res) => {
            if (res.data.code === 0) {
              this.$Message.info('模板保存成功');
            }
          }
        });
      },
      multipleSelectionTree(obj) {
        multipleComple.multipleSelectionTree({
          searchObject: {
            param: {
              TABLENAME: obj.reftable
            }
          },
          success: (res) => {
            this.treeRestructure(res.data);
          }
        });
      },
      multipleSelectionTable(obj, index) {
        multipleComple.multipleSelectionTable({
          searchObject: {
            param: {
              TABLENAME: this.sendMessage.reftable,
              CONDITION: obj.CONDITION,
              GLOBAL: obj.GLOBAL,
              PAGENUM: obj.PAGENUM,
              PAGESIZE: obj.PAGESIZE
            }
          },
          success: (res) => {
            this.dateRestructure(res.data.data, index);
          }
        });
      },
      multipleScreenResultCheck(obj, index, type) {
        if (type !== 'all') {
          obj.CONDITION = '';
        }
        multipleComple.multipleScreenResultCheck({
          searchObject: {
            param: {
              TABLENAME: this.sendMessage.reftable,
              CONDITION: obj.CONDITION,
              GLOBAL: obj.GLOBAL,
              PAGENUM: obj.PAGENUM,
              PAGESIZE: obj.PAGESIZE,
              EXCLUDE: this.EXCLUDE,
              IN: this.IN,
              NOTIN: this.NOTIN
            }
          },
          success: (res) => {
            this.dateRestructure(res.data.data, index, type);
          }
        });
      },
      multipleScreenResultCheckFiter(obj, index, type) {
        this.IN = obj.IN;
        this.NOTIN = obj.NOTIN;
        multipleComple.multipleScreenResultCheck({
          searchObject: {
            param: {
              TABLENAME: obj.TABLENAME,
              CONDITION: obj.CONDITION,
              GLOBAL: obj.GLOBAL,
              PAGENUM: obj.PAGENUM,
              PAGESIZE: obj.PAGESIZE,
              EXCLUDE: obj.EXCLUDE,
              IN: obj.IN,
              NOTIN: obj.NOTIN
            }
          },
          success: (res) => {
            this.dateRestructure(res.data.data, index, type);
          }
        });
      },
      init() {
        this.multipleSelectionTree(this.fkobj);
        const tableData = Object.assign(this.sendMessage, this.fkobj);
        this.sendMessage = tableData;
        this.multipleSelectionTable(tableData, 0);
        if (Object.keys(this.filter).length > 1) {
          this.sendMessage = this.filter;
          this.multipleScreenResultCheckFiter(this.filter, 1);
        }
      }

    },
    activated() {
      console.log('激活');
    },
    mounted() {
      console.log('mounted');
      /**/
    },
    created() {
      this.init();
    }


  };
</script>
<style lang="less">
  .burgeon-select-item{
    position: relative;

  }
  .icon-bj_delete2{
    position: absolute;
    right: 5px;
    top: 7px;
    border-radius: 100%;
    font-size: 14px;
    &:hover {
     background-color: #e6502f;
     color: #f3cec5;
     border: 1px solid #e6502f;
   }
  }
  .burgeon--dialog {
    .right_center {
      ul li{
        position: relative;
        .icon-bj_delete2{
          top:5px;
        }
      }
    }
  }
</style>
