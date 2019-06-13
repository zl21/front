<template>
  <div class="dialog">
    <Complexs-dialog
      :treedata="Tree"
      :loading="loading"
      :tree-loading="tree_loading"   
      ref="dialog"
      :table-loading="tableLoading"
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
  import { Version } from '../constants/global';

  // eslint-disable-next-line import/no-dynamic-require
  const multipleComple = require(`../__config__/actions/version_${Version}/formHttpRequest/compleHttpRequest.js`).default;

  export default {
    name: 'ComplexSelect',
    props: {
      fkobj: {
        type: Object,
        default() {
          return {};
        }
      },
      filter: {
        type: Object,
        default() {
          return {};
        }
      },
      canChinese: {
        type: Boolean,
        default: true
      }// 是否可以模糊搜索中文
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
        treedataInt: [],
        treeSelectData: [],
        loading: false, // z最大loading
        tree_loading: false, // 左边的 的loading
        tableLoading: false, // 中间的 的loading
        componentData: [
          {
            tab: '筛选结果',
            columns: [],
            list: [],
            search: '',
            pageOptions: [10, 20, 50, 100],
            height: 340,
            searchName: '全局检索',
            checked: false
          },
          {
            tab: '查看选中结果',
            columns: [],
            list: [],
            height: 340,
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
          result: [

          ]
        },
        tdData: {
          id: '',
          list: []
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
        this.treeLoading = false;
        this.loading = false;
        this.treedataInt = JSON.parse(JSON.stringify(this.treedata));
      },
      clearTree() {
        const treedata = this.treedataInt.reduce((arr, item) => {
          item.expand = true;
          arr.push(item);
          return arr;
        }, []);
        this.treedata = JSON.parse(JSON.stringify(treedata));
        this.treeSelectData = [];
        this.tree_loading = false;
        this.loading = false;
        this.changeTtree([]);
      },
      treeChecked() {
        // tree_lists 树形结构重新组合
        const self = this;
        this.treedata.forEach((item,index) => {
         this.$refs.dialog.$refs.Tree.handleCheck({ checked: false, nodeKey: this.treedata[`${index}`].nodeKey });
        });
        // ((option) => {
        //   option.checked = false;
        //   option.children.map((item) => {
        //     if ((item.ID.toString()).indexOf(self.HRORG_ID.join(',')) === -1) {
        //       item.checked = true;
        //     } else {
        //       item.checked = false;

        //       return item;
        //     }
        //   });
        //   return option;
        // });

      },
      dateRestructure(data, index, type, name) {
        // 表格数据的 重新组合
        if (!this.akname) {
          this.akname = data.akname || 'ECODE';
        }
          if(name !== 'clear'){
              this.IN = data.ids || [];
                if (index === 1 && type !== 'search') {
                this.resultData.list = JSON.parse(JSON.stringify(this.text.result));
                this.resultData.list.map((item) => {
                  if (item.exclude) {
                    item.exclude = false;
                  } else {
                    item.exclude = true;
                  }
                  item.string = item.screen_string;
                  item.ID = item.id_list;
                  return item;
                });
              this.resultData.total = data.data.total;
          }

        }
        

        this.componentData[index] = Object.assign(this.componentData[index], data.data);

        const header = JSON.parse(data.header);
        this.componentData[0].columns = this.columnsDate(header, 0);
        this.componentData[1].columns = this.columnsDate(header, 1);
        console.log(this.IN,'this.INthis.IN');
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
                    innerHTML: '<span class ="span_action" ><i class="iconfont icon-bj_delete2"></i></span>'
                  },
                  on: {
                    click: () => {
                      const row = this.componentData[1].list[key - 1];
                      this.NOTIN.push(row.ID);
                      this.text.result.push({
                        exclude: false,
                        id_list: row.ID,
                        screen: row.ID,
                        screen_string: this.toStringName(row, this.akname)
                      });
                      this.deleteLi(key - 1, row, 'td');
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
        this.HRORG_STRING = [];
        this.HRORG_ID = Object.keys(data).reduce((item, option) => {
          if (data[option].ID) {
            item.push(data[option].ID);
            this.HRORG_STRING.push(data[option].NAME);
          }
          return item;
        }, []);
      },
      toStringName(row, akname) {
        const aknameArr = akname.split(',');
        const items = aknameArr.reduce((arr, item) => {
          arr.push(row[item]);
          return arr;
        }, []);
        return items.join('');
      },
      changeTtree(obj) {
        
        this.treeId(obj);
        this.treeSelectData = obj;
        if (this.HRORG_ID.length > 0) {
          this.sendMessage.CONDITION = {};
          this.sendMessage.CONDITION[this.AKNAME] = this.HRORG_ID;
        } else {
          this.sendMessage.CONDITION = '';
        }
        this.tableLoading = true;
       
        this.multipleSelectionTable(this.sendMessage, 0);
      },
      clickTab(index) {
        // 点击切换tab
        this.index = index;
      },
      changePage(index) {
        // 点击页面
        if (index === this.sendMessage.PAGENUM) {
          return false;
        }
        this.sendMessage.PAGENUM = index;
        this.multipleSelectionTable(this.sendMessage, this.index);
      },
      changePageSize(index) {
        // 点击显示条数
        if (index === this.sendMessage.PAGESIZE) {
          return false;
        }
        this.sendMessage.PAGESIZE = index;
        this.multipleSelectionTable(this.sendMessage, this.index);
      },
      rowdbclick(row) {
        // 表格双击
        if (this.index === 0) {
          this.clickChoose(row);
          row.string = this.toStringName(row, this.akname);
          this.multipleScreenResultCheck(this.sendMessage, 1);
        }
      },
      rowclick(row) {
        if (this.index === 0) {
          this.clickChoose(row, 'click');
        }
      },
      clickChoose(row, type) {
        // 单击或者双击的选中id
        if (this.checkbox) {
          const checkd = this.verify(this.NOTIN, row.ID);
          if (checkd) {
            if (type === 'click') {
              this.tdData.id = row.ID;
              this.tdData.list[0] = {
                exclude: false,
                id_list: row.ID,
                screen: row.ID,
                screen_string: this.toStringName(row, this.akname)

              };
            } else {
              this.NOTIN.push(row.ID);
              this.text.result.push({
                exclude: false,
                id_list: row.ID,
                screen: row.ID,
                screen_string: this.toStringName(row, this.akname)
              });
            }
          }
        } else {
          const checkdIN = this.verify(this.IN, row.ID);
          if (checkdIN) {
            if (type === 'click') {
              this.tdData.id = row.ID;
              this.tdData.list[0] = {
                exclude: true,
                id_list: row.ID,
                screen: row.ID,
                screen_string: this.toStringName(row, this.akname)

              };
            } else {
              this.IN.push(row.ID);
              this.text.result.push({
                exclude: true,
                id_list: row.ID,
                screen: row.ID,
                screen_string: this.toStringName(row, this.akname)
              });
            }
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
        let str = '';
        if (this.canChinese) {
          str = event.match(/[A-Za-z0-9\u4e00-\u9fa5]*/g);
        } else {
          str = event.match(/[A-Za-z0-9]*/g);
        }
        this.sendMessage.GLOBAL = str[0].trim();
        this.sendMessage.CONDITION = {};
        this.clearIndexPage();
        if( this.index  === 0){
          this.multipleSelectionTable(this.sendMessage, this.index, 'search');
        } else {
          this.multipleScreenResultCheck(this.sendMessage, this.index, 'search');
        }
      },
      clearIndexPage() {
        // 清除页面选中值
        this.sendMessage.PAGESIZE = 50;
        this.sendMessage.PAGENUM = 1;
      },
      checkboxChange(value) {
        this.checkbox = value;
      },
      // eslint-disable-next-line consistent-return
      transfertwo() {
        // console.log(this.treeSelectData.findIndex((item)=>{ return item.nodeKey === 1}));
        this.loading = true;
        //this.sendMessage = 
        if (this.HRORG_ID.length > 0) {
          if (!this.checkbox) {
            this.sendMessage.CONDITION = [];
            this.EXCLUDE = '';
            this.HRORG_ID.forEach((x) => {
              this.sendMessage.CONDITION.push({
                [this.AKNAME]: [x]
              });
            });
            this.text.result.push({
              exclude: true,
              id_list: this.HRORG_ID,
              screen: this.sendMessage.CONDITION,
              screen_string: this.HRORG_STRING.join(',')
            });
            this.multipleScreenResultCheck(this.sendMessage, 1, 'all');
            this.clearTree();
          } else {
            this.EXCLUDE = [];
            this.sendMessage.CONDITION = '';
            this.HRORG_ID.forEach((x) => {
              this.EXCLUDE.push({
                [this.AKNAME]: [x]
              });
            });
            this.text.result.push({
              exclude: false,
              id_list: this.HRORG_ID,
              screen: this.EXCLUDE,
              screen_string: this.HRORG_STRING.join(',')
            });
           
            this.multipleScreenResultCheck(this.sendMessage, 1, 'all');
            this.clearTree();
          }
        } else {
          this.sendMessage.CONDITION = '';
          this.sendMessage.EXCLUDE = '';
          this.clearIndexPage();
          return false;
        }
      },
      transfer() {
        if (this.checkbox) {
          if (this.verify(this.NOTIN, this.tdData.id)) {
            this.NOTIN.push(this.tdData.id);
          }
        } else if (this.verify(this.IN, this.tdData.id)) {
          this.IN.push(this.tdData.id);
        }
        this.text.result.push(this.tdData.list[0]);
        this.multipleScreenResultCheck(this.sendMessage, 1);
      },
      deleteLi(index, row, type) {
        if (type !== 'td') {
          this.text.result.splice(index, 1);
        }
        if (!row.exclude) {
          const indexI = this.IN.findIndex(x => x === row.ID);
          if (indexI !== -1) {
            this.IN.splice(indexI, 1);
          }
        } else {
          const indexI = this.NOTIN.findIndex(x => x === row.ID);
          if (indexI !== -1) {
            this.NOTIN.splice(indexI, 1);
          }
        }
        if (this.text.result.length > 0) {
          this.multipleScreenResultCheck(this.sendMessage, 1);
        } else if (type === 'td') {
          this.multipleScreenResultCheck(this.sendMessage, 1);
        } else {
          this.resultData.total = 0;
          this.text.result = [];
          this.resultData.list = [];
          this.IN = [];
          this.NOTIN = [];
          this.clearIndexPage();
        }
      },
      deleBtn() {
        // 清除全部
        this.resultData.list = [];
        this.text.result = [];
        this.IN = [];
        this.NOTIN = [];
        this.resultData.total = 0;
        this.sendMessage.CONDITION = '';
        this.EXCLUDE = '';
        console.log(this.componentData);
        this.componentData[1].list = [];
        this.clearIndexPage();
      },
      saveBtn(value) {
        if (value.length < 1) {
          this.$Message.info('模板名称不能为空');
          return false;
        }

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
        
        console.log(this.$refs.dialog.$refs.Tree);
        this.treeChecked();
        this.multipleSelectionTable(this.sendMessage, 0);
      },
      multipleSetMultiQuery(obj) {
        multipleComple.multipleSetMultiQuery({
          searchObject: obj,
          serviceId: this.fkobj.serviceId,
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
          serviceId: this.fkobj.serviceId,
          success: (res) => {
            if (res.data.code === 0) {
              this.treeRestructure(res.data);
            }
          }
        });
      },
      multipleSelectionTable(obj, index, name) {
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
          serviceId: this.fkobj.serviceId,
          success: (res) => {
            if (obj.clear !== '1') {
              this.dateRestructure(res.data.data, index, name,'clear');
            }
            this.tableLoading = false;
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
          serviceId: this.fkobj.serviceId,
          success: (res) => {
            this.tableLoading = false;
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
          serviceId: this.fkobj.serviceId,
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
        if (Object.prototype.hasOwnProperty.call(this.filter, 'value')) {
          if (this.filter.text) {
            //  有默认值
            this.text.result = JSON.parse(this.filter.text).result;
          }
          //  有默认值
          this.sendMessage = this.filter.value;
          
          this.multipleScreenResultCheckFiter(this.filter.value, 1);
        }
      }

    },
    activated() {
      console.log('激活');
    },
    mounted() {
      /**/
    },
    created() {
      this.loading = true;
      this.init();
    }


  };
</script>
<style lang="less">
.burgeon--dialog {
    .dialog_center .dialog_p10{
      padding:0px 0 6px 0px
    }
    .burgeon-tabs-bar{
      margin-bottom: 10px
    }
}
</style>
<style lang="less" scoped>
  .burgeon-select-item{
    position: relative;

  }
  .span_action{
    position: relative;
    display: block;
    height: 30px;
    width: 20px;
    margin: 0 auto;
    text-align: center;
  }


  .burgeon--dialog {
    .dialog_center .dialog_p10{
      padding:0px 0 6px 0px
    }
    .burgeon-tabs-bar{
      margin-bottom: 0px
    }
    .right_center {
      ul li{
        position: relative;
        .icon-bj_delete2{
          top:5px;
        }
      }
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
  }
  .burgeon-poptip-body{
      padding: 0px;
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
  }
</style>
