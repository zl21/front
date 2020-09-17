<template>
  <div class="dialog">
    <Complexs-dialog
      ref="dialog"
      :treedata="Tree"
      :loading="loading"   
      :tree-loading="tree_loading"
      :table-loading="tableLoading"
      :component-data="componentData"
      :result-data="resultData"
      @on-change-tree="changeTtree"
      @on-click-tab="clickTab"
      @on-change-page="changePage"
      @on-change-pageSize="changePageSize"
      @on-row-dblclick="rowdbclick"
      @on-row-click="rowclick"
      @on-change="inputchange"
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

  const multipleComple = () => require(`../__config__/actions/version_${Version()}/formHttpRequest/compleHttpRequest.js`).default;

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
      }, // 是否可以模糊搜索中文
      default: {
        type: Array,
        default() {
          return [];
        }
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
            pageSize: 50,
            total: 0,
            tableprops: {
              tabindex: true,
              ctrlAdd: (obj) => {
                this.listData.list = [];
                this.listData.id = [];
                this.tdData.list = [];
                this.tdData.id = '';
                obj.forEach((item) => {
                  this.listData.list.push({
                    exclude: !this.checkbox,
                    id_list: [item.ID],
                    screen: item.ID,
                    screen_string: this.toStringName(item, this.akname)
                  });
                  this.listData.id.push(item.ID);
                });
              },
              shiftAdd: (obj) => {
                this.listData.list = [];
                this.listData.id = [];
                this.tdData.list = [];
                this.tdData.id = '';
                obj.forEach((item) => {
                  this.listData.list.push({
                    exclude: !this.checkbox,
                    id_list: [item.ID],
                    screen: item.ID,
                    screen_string: this.toStringName(item, this.akname)
                  });
                  this.listData.id.push(item.ID);
                });
              }
            },
            pageNum: 1,
            height: true,
            searchName: '全局检索',
            checked: false
          },
          {
            tab: '查看选中结果',
            columns: [],
            list: [],
            pageSize: 50,
            total: 0,
            pageNum: 1,
            tableprops: {
              tabindex: false,
            },  
            height: true,
            pageOptions: [10, 20, 50, 100],
            search: '',
            searchName: '查询结果'
          }
        ],
        CONDITIONList: [], // 组织树 选中值
        CONDITIONTable: {}, // 组织树 --查询条件 
        sendMessage: {
          CONDITION: [], // 组织树 -- 选中结果查询条件
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
        chooseTreeData: [], // 选中节点
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
          index: -1,
          list: []
        },
        listData: {
          id: [],
          list: [] 
        },
        CONDITIONThis: {}, // 当前的条件
        idslist: [], // 选中所有的id
        expand: [], // 当前打开的
      };
    },
    methods: {
      treeRestructure(data) {
        // tree_lists 树形结构重新组合
        this.AKNAME = data.data.reduce((arr, item) => {
          arr.push(item.AKNAME);
          return arr;
        }, []);
       
        this.treedata = data.data.map((obj, i) => {
          const option = {};
          option.title = obj.NAME;
          option.expand = !!obj.expand;
          option.AKNAME = obj.AKNAME;
          option.children = [...obj.VALUE];
          option.children.forEach((item) => {
            if (typeof item.NAME !== 'string' && item.NAME) {
              item.title = item.NAME.toString();
            } else {
              item.title = item.NAME;
            }
            item.index = i;
            item.AKNAME = obj.AKNAME;
          });
          return option;
        });
        this.treeLoading = false;
        this.loading = false;
        this.treedataInt = JSON.parse(JSON.stringify(this.treedata));
      },
      clearTree() {
        const treedata = this.treedataInt.reduce((arr, item, i) => {
          item.expand = this.treedata[i].expand;
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
        this.treedata.forEach((item, index) => {
          this.$refs.dialog.$refs.Tree.handleCheck({ checked: false, nodeKey: this.treedata[`${index}`].nodeKey });
        });
      },
      dateRestructure(data, index, type, name) {
        // 表格数据的 重新组合
        if (!this.akname) {
          this.akname = data.akname || 'ECODE';
        }
        if (name !== 'clear') {
          if (type !== 'search') {
            // this.IN = data.ids || [];
          }
          if (index === 1 && type !== 'search') {
            const check = !!this.filter.text;
            this.resultData.list = JSON.parse(JSON.stringify(this.text.result));
            this.resultData.list.map((item) => {
              item.ID = item.id_list[0] ? item.id_list[0] : item.id_list;
              return item;
            });
            this.resultData.total = data.data.total;
          }
        }
        if (type !== 'search') {
          this.componentData[index] = Object.assign(this.componentData[index], data.data);
        } else if (index === 1) {
          if (this.resultData.total > 0) {
            this.componentData[index] = Object.assign(this.componentData[index], data.data);
          } else {
            this.componentData[index].list = [];
          }
        } else if (index === 0) {
          this.componentData[index] = Object.assign(this.componentData[index], data.data);
        }

        const header = JSON.parse(data.header);
        this.componentData[0].columns = this.columnsDate(header, 0);
        this.componentData[1].columns = this.columnsDate(header, 1);
        if (data.ids) {
          this.idslist = data.ids.flat();
        }
      },
      columnsDate(columns, index) {
        // 表格头部 数据重组
        return Object.keys(columns).reduce((item, option) => {
          if (option.toUpperCase() === 'ID') {
            item.unshift({
              key: 'ID',
              title: '编号',
              render: (h, params) => h('div',
                                       {
                                         domProps: {
                                           innerHTML: `${(this.componentData[index].pageNum - 1) * this.componentData[index].pageSize + params.index + 1}`
                                         }
                                       })
            });
          } else {
            item.push({
              key: option,
              title: columns[option]
            });
            // if (index === 1 && (Object.keys(columns).length - 2) === key) {
            //   item.push({
            //     title: '操作',
            //     key: 'action',
            //     render: h => h('div', {
            //       domProps: {
            //         innerHTML: '<span class ="span_action" ><i class="iconfont icon-bj_delete2"></i></span>'
            //       },
            //       on: {
            //         click: () => {
            //           const row = this.componentData[1].list[key - 1];
            //           this.NOTIN.push(row.ID);
            //           this.text.result.push({
            //             exclude: true, // 排除
            //             id_list: [row.ID],
            //             screen: row.ID,
            //             screen_string: this.toStringName(row, this.akname)
            //           });
            //           this.deleteLi(key - 1, row, 'td');
            //         }
            //       }
            //     })
            //   });
            // }
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
        const aknameArr = akname.split(',')[0];
        // const items = aknameArr.reduce((arr, item) => {
        //   arr.push(row[item]);
        //   return arr;
        // }, []);
        return row[aknameArr];
      },
      changeTtree(obj) {
        this.treeId(obj);
        this.treeSelectData = obj;
        this.chooseTreeData = obj;
        this.setConDitions('obj');

        this.tableLoading = true;
        this.multipleSelectionTable(this.sendMessage, 0);
      },
      setConDitions(type) {
        //  计算 this.sendMessage.CONDITION
        const ids = {};
        const exids = {};

        this.CONDITIONThis = {};
        // 去除排除后的计算
        if (this.checkbox === false) {
          this.chooseTreeData.forEach((item) => {
            ids[item.AKNAME] = [];
          });
          Object.keys(ids).forEach((item) => {
            ids[item] = this.chooseTreeData.reduce((arr, option) => {
              if (option.AKNAME === item && option.ID) {
                arr.push(option.ID);
              } 
              return arr;
            }, []);
          });
        } else {
          // 排除
          if (type !== 'obj') {
            this.chooseTreeData.forEach((item) => {
              exids[item.AKNAME] = [];
            });
            Object.keys(exids).forEach((item) => {
              exids[item] = this.chooseTreeData.reduce((arr, option) => {
                if (option.AKNAME === item && option.ID) {
                  arr.push(option.ID);
                } 
                return arr;
              }, []);
            });
            this.EXCLUDE.push(exids);
            this.CONDITIONThis = exids;
          }
        }
        if (type === 'obj') {
          this.CONDITIONTable = ids;
        } else {
          if (!Array.isArray(this.sendMessage.CONDITION)) {
            this.sendMessage.CONDITION = [];
          }
          if (this.checkbox === false) {
            this.sendMessage.CONDITION.push(ids);
            const _ids = { ...ids };
            this.CONDITIONThis = { ...ids };
            // _ids.indexI = this.text.result.length;
            this.CONDITIONList.push(_ids);
          } else {
            // console.log(ids);
          }
        }
      },
      clickTab(index) {
        // 点击切换tab
        this.index = index;
      },
      selectId() {
        // 查询条件 所有id
        // const ids = this.CONDITIONList.reduce((arr, item) => {
        //   Object.keys(item).forEach((option) => {
        //     console.log(arr,'arr');
        //     let options = item[option];
        //     arr = arr.concat(options);
        //   });
        //   return arr;
        // }, []);
        // return ids.concat(this.IN);

      },
      changePage(index) {
        // 点击页面
        this.tableLoading = true;
        if (!this.sendMessage.PAGENUM) {
          this.sendMessage.PAGENUM = 1;
        }
        if (index === this.sendMessage.PAGENUM) {
          this.tableLoading = false;
          return false;
        }
        this.componentData[this.index].pageNum = index;
        this.sendMessage.PAGESIZE = this.componentData[this.index].pageSize;
        this.sendMessage.PAGENUM = index;
        if (this.index === 0) {
          this.multipleSelectionTable(this.sendMessage, this.index, 'search');
        } else {
          this.multipleScreenResultCheck(this.sendMessage, this.index, 'search');
        }
        return true;
      },
      changePageSize(index) {
        // 点击显示条数
        if (index === this.sendMessage.PAGESIZE) {
          return false;
        }
        this.componentData[this.index].pageSize = index;
        this.sendMessage.PAGENUM = this.componentData[this.index].pageNum;

        this.sendMessage.PAGESIZE = index;
        if (this.index === 0) {
          this.multipleSelectionTable(this.sendMessage, this.index, 'search');
        } else {
          this.multipleScreenResultCheck(this.sendMessage, this.index, 'search');
        }
        return true;
      },
      rowdbclick(row) {
        // 表格双击
        if (this.index === 0) {
          this.listData.list = [];
          this.listData.id = [];
          this.clickChoose(row, '', 'rowdbclick');
          row.string = this.toStringName(row, this.akname);
          this.componentData[0].list = this.componentData[0].list.concat([]);

          this.multipleScreenResultCheck(this.sendMessage, 1);
        }
      },
      rowclick(row, rowIndex) {
        if (this.index === 0) {
          this.listData.list = [];
          this.listData.id = [];
          this.clickChoose(row, rowIndex, 'click');
        }
      },
      clickChoose(row, rowIndex, type) {
        // 单击或者双击的选中id
        const tip = type !== 'click' ? 'tip' : '';  
        if (this.checkbox) {
          const checkd = this.verify(this.NOTIN, row.ID, tip);
          if (checkd) {
            if (type === 'click') {
              this.tdData.id = row.ID;
              this.tdData.index = rowIndex;
              this.tdData.list[0] = {
                exclude: true,
                id_list: [row.ID],
                screen: row.ID,
                screen_string: this.toStringName(row, this.akname)

              };
            } else {
              this.NOTIN.push(row.ID);
              this.text.result.push({
                exclude: true,
                id_list: [row.ID],
                screen: row.ID,
                screen_string: this.toStringName(row, this.akname)
              });
              this.tdData.id = '';
              this.tdData.list = [];
            }
          }
        } else {
          const checkdIN = this.verify(this.IN, row.ID, tip);
          if (checkdIN) {
            if (type === 'click') {
              this.tdData.id = row.ID;
              this.tdData.index = rowIndex;
              this.tdData.list[0] = {
                exclude: false,
                id_list: [row.ID],
                screen: row.ID,
                screen_string: this.toStringName(row, this.akname)

              };
            } else {
              this.IN.push(row.ID);
              this.text.result.push({
                exclude: false,
                id_list: [row.ID],
                screen: row.ID,
                screen_string: this.toStringName(row, this.akname)
              });
              this.tdData.id = '';
              this.tdData.list = [];
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
      verify(arr, id, type) {
        if (!arr.some(x => x === id)) {
          return true;
        }
        if (type === 'tip') {
          this.$Message.info('该记录已在已选中列表中');
        }
        return false;
      },
      inputchange(event) {
        this.sendMessage.GLOBAL = event.target.value.trim();
      },
      inputsearch(event) {
        let str = '';
        if (this.canChinese) {
          str = event.match(/[A-Za-z0-9\u4e00-\u9fa5]*/g);
        } else {
          str = event.match(/[A-Za-z0-9]*/g);
        }
        this.sendMessage.GLOBAL = str[0].trim();
        this.CONDITIONTable = {};
        this.clearIndexPage();
        if (this.index === 0) {
          this.multipleSelectionTable(this.sendMessage, this.index, 'search');
        } else {
          this.multipleScreenResultCheck(this.sendMessage, this.index, 'search');
        }
      },
      clearIndexPage() {
        // 清除页面选中值
        this.sendMessage.PAGESIZE = 50;
        this.sendMessage.PAGENUM = 1;
        this.componentData[1].list = [];
        this.componentData[1].total = 0;
        this.componentData[1].pageNum = 1;
        this.componentData[1].pageSize = 50;
      },
      checkboxChange(value) {
        this.checkbox = value;
      },
      // eslint-disable-next-line consistent-return
      transfertwo() {
        // console.log(this.treeSelectData.findIndex((item)=>{ return item.nodeKey === 1}));
        // this.sendMessage = 
        if (this.chooseTreeData.length < 1) {
          return false;
        }
        this.setConDitions();

        this.chooseTreeData = [];
        if (this.HRORG_ID.length > 0) {
          this.loading = true;
          if (!this.checkbox) {
            // this.sendMessage.CONDITION = [];
            // Object.keys(this.sendMessage.CONDITION).forEach((item) => {
            //   if (item) {
            //     this.CONDITIONList[item] = this.sendMessage.CONDITION[item];
            //   }
            // });
            // this.EXCLUDE = '';
            this.text.result.push({
              exclude: false,
              id_list: [this.HRORG_ID],
              screen: this.CONDITIONThis,
              screen_string: this.HRORG_STRING.join(',')
            });
            
            this.multipleScreenResultCheck(this.sendMessage, 1, 'all');
            this.clearTree();
          } else {
            // this.EXCLUDE = [];
            // this.CONDITIONThis = {
            //   [this.AKNAME]: []
            // };
            // this.EXCLUDE.push({
            //   [this.AKNAME]: []
            // });
            // this.HRORG_ID.forEach((x) => {
            //   if (this.checkbox) {
            //     this.EXCLUDE[this.EXCLUDE.length - 1][this.AKNAME].push(x);
            //     this.CONDITIONThis[this.AKNAME].push(x);
            //   }
            // });
            this.text.result.push({
              exclude: true,
              id_list: [this.HRORG_ID],
              screen: this.CONDITIONThis,
              screen_string: this.HRORG_STRING.join(',')
            });
           
            this.multipleScreenResultCheck(this.sendMessage, 1, 'all');
            this.clearTree();
          }
        } else {
          this.sendMessage.EXCLUDE = [];
          this.clearIndexPage();
          return false;
        }
      },
      transfer() {
        if (this.tdData.id !== '') {
          this.tdresultdata('tip');
        }
        if (JSON.stringify(this.listData.id) !== '' && JSON.stringify(this.listData.id) !== '[]') {
          this.listtdata('tip');
        }
        // this.$Message.info('请选择');
      },
      listtdata() {
        if (this.checkbox) {
          this.listData.id.forEach((id, i) => {
            const index = this.NOTIN.findIndex(x => x === id);
            if (index === -1) {
              this.NOTIN.push(id);
              this.listData.list[i].exclude = true;
              this.text.result.push(this.listData.list[i]);
            }
          });  
        } else {
          this.listData.id.forEach((id, i) => {
            const eq = this.IN.findIndex(x => x === id);
            if (eq === -1) {
              this.IN.push(id);
              this.listData.list[i].exclude = false;
              this.text.result.push(this.listData.list[i]);
            }
          });
          setTimeout(() => {
            this.componentData[0].list = this.componentData[0].list.concat([]);
          }, 50);
        }
        this.multipleScreenResultCheck(this.sendMessage, 1);

        this.listData.list = [];
        this.listData.id = [];
      },
      tdresultdata(type) {
        if (this.checkbox) {
          if (this.verify(this.NOTIN, this.tdData.id, type)) {
            this.NOTIN.push(this.tdData.id);
            this.tdData.list[0].exclude = true;
          }
        } else if (this.verify(this.IN, this.tdData.id, type)) {
          this.IN.push(this.tdData.id);
          this.tdData.list[0].exclude = false;
        }
        setTimeout(() => {
          this.componentData[0].list = this.componentData[0].list.concat([]);
        }, 100);
        this.text.result.push(this.tdData.list[0]);
        this.multipleScreenResultCheck(this.sendMessage, 1);
        this.tdData.id = '';
        this.tdData.list = [];
      },
      deleteLi(index, row, type) {
        if (type !== 'td') {
          if (Array.isArray(row.ID)) {
            if (row.exclude === false) {
              this.CONDITIONList.forEach((item, i) => {
                if (JSON.stringify(item) === JSON.stringify(row.screen)) {
                  this.CONDITIONList.splice(i, 1);
                  this.sendMessage.CONDITION.splice(i, 1);
                }
              });
            } else {
              this.EXCLUDE.some((item, i) => {
                if (JSON.stringify(item) === JSON.stringify(row.screen)) {
                  this.EXCLUDE.splice(i, 1);
                  // this.sendMessage.EXCLUDE.splice(i, 1);
                }
              });
            }
          }
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
        this.sendMessage.CONDITION = [];
        this.CONDITIONTable = {};
        this.EXCLUDE = [];
        this.componentData[1].list = [];
        this.componentData[1].total = 0;
        this.componentData[1].pageNum = 1;
        this.componentData[1].pageSize = 50;
        this.clearIndexPage();
      },
      savemessage() {
        //   初始化 默认值
        this.sendMessage.TABLENAME = this.sendMessage.reftable;
        const s_value = this.sendMessage;
        s_value.EXCLUDE = this.EXCLUDE;
        s_value.IN = this.IN;
        s_value.NOTIN = this.NOTIN;
        this.text.EXCLUDE = this.EXCLUDE;
        return {
          value: s_value,
          text: JSON.stringify(this.text)
        };
      },
      savObjemessage() {  
        const sendMessage = {
          idArray: [],
          lists: {
            result: this.resultData.list,
          },
          total: this.resultData.total,
          value: {
            CONDITION: this.sendMessage.CONDITION,
            EXCLUDE: this.sendMessage.EXCLUDE,
            GLOBAL: this.sendMessage.GLOBAL,
            IN: this.sendMessage.IN,
            NOTIN: this.sendMessage.NOTIN,
            TABLENAME: this.sendMessage.TABLENAME
          }

        };
        return JSON.stringify(sendMessage);
      },
      setvalueData(obj) {
        const data = obj;
        if (Object.keys(data).length > 1) {
          this.sendMessage = Object.assign(this.sendMessage, data.value);
          this.text.result = data.lists.result;
          this.EXCLUDE = data.value.EXCLUDE;
          this.IN = data.value.IN;
          this.NOTIN = data.value.NOTIN;
          this.resultData.total = data.total;

          this.multipleScreenResultCheck(this.sendMessage, 1, 'result');
        } else {
          this.deleBtn();
        }
      },
      // eslint-disable-next-line consistent-return
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
        this.sendMessage.CONDITION = [];
        this.CONDITIONTable = {};
        this.HRORG_ID = [];
        this.sendMessage.GLOBAL = '';
        this.sendMessage.PAGENUM = 1;
        this.sendMessage.PAGESIZE = 50;
        
        this.treeChecked();
        this.multipleSelectionTable(this.sendMessage, 0);
      },
      multipleSetMultiQuery(obj) {
        multipleComple().multipleSetMultiQuery({
          searchObject: obj,
          serviceId: this.fkobj.serviceId,
          success: (res) => {
            if (res.data.code === 0) {
              this.$Message.success('模板保存成功');
            }
          }
        });
      },
      multipleSelectionTree(obj) {
        multipleComple().multipleSelectionTree({
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
        // 查询表
        multipleComple().multipleSelectionTable({
          searchObject: {
            param: {
              TABLENAME: this.sendMessage.reftable,
              CONDITION: this.CONDITIONTable,
              GLOBAL: obj.GLOBAL,
              PAGENUM: obj.PAGENUM || 1,
              PAGESIZE: obj.PAGESIZE || 10
            }
          },
          serviceId: this.fkobj.serviceId,
          success: (res) => {
            if (obj.clear !== '1') {
              this.dateRestructure(res.data.data, index, name, 'clear');
            }
            this.sendMessage.GLOBAL = '';

            this.tableLoading = false;
          }
        });
      },
      multipleScreenResultCheck(obj, index, type) {
        if (type !== 'all') {
          // obj.CONDITION = '';
        }
        let CONDITION = [];
        if (!Array.isArray(obj.CONDITION)) {
          CONDITION = Object.keys(obj.CONDITION).reduce((arr, item) => {
            arr.push({ [item]: obj.CONDITION[item] });            
            return arr;
          }, []);
        } else {
          CONDITION = obj.CONDITION;
        }
        multipleComple().multipleScreenResultCheck({
          searchObject: {
            param: {
              TABLENAME: this.sendMessage.reftable,
              CONDITION,
              GLOBAL: obj.GLOBAL,
              PAGENUM: this.index === 0 ? 1 : obj.PAGENUM,
              PAGESIZE: this.componentData[1].pageSize,
              EXCLUDE: this.EXCLUDE,
              IN: this.IN,
              NOTIN: this.NOTIN
            }
          },
          serviceId: this.fkobj.serviceId,
          success: (res) => {
            this.tableLoading = false;
            this.sendMessage.GLOBAL = '';
            this.dateRestructure(res.data.data, index, type);
          }
        });
      },
      multipleScreenResultCheckFiter(obj, index, type) {
        this.IN = obj.IN;
        this.NOTIN = obj.NOTIN;
        multipleComple().multipleScreenResultCheck({
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
        this.sendMessage.reftable = this.fkobj.reftable;
        const tableData = Object.assign(this.sendMessage, this.fkobj);
        // tableData.PAGENUM = 1;
        // tableData.PAGESIZE = 50;
        // this.sendMessage = tableData;
        // this.componentData[0].pageSize = 50;
        // this.componentData[0].pageNum = 1;
        // this.componentData[1].pageSize = 50;
        // this.componentData[1].pageNum = 1;
        // this.index = 0;
        
        this.multipleSelectionTable(tableData, 0);
        if (Object.prototype.hasOwnProperty.call(this.filter, 'value')) {
          if (this.filter.text) {
            //  有默认值
            this.text.result = JSON.parse(this.filter.text).result;
          }
          //  有默认值
          this.sendMessage = { ...JSON.parse(JSON.stringify(this.filter.value)) };  
          this.sendMessage.PAGENUM = 1;
          this.sendMessage.PAGESIZE = 50;
          this.CONDITIONList = JSON.parse(JSON.stringify(this.sendMessage.CONDITION));
          this.EXCLUDE = JSON.parse(JSON.stringify(this.sendMessage.EXCLUDE));
          this.sendMessage.TABLENAME = this.fkobj.reftable;
          this.multipleScreenResultCheckFiter(this.sendMessage, 1);
        }
      }

    },
    activated() {
    },
    mounted() {
      this.$refs.dialog.$refs.Table[0].$el.focus();
      /**/
    },
    created() {
      this.loading = true;
      this.init();

      if (this.default) {
        const arr = this.default.reduce((array, current) => {
          array.push({
            ID: current.ID,
            exclude: false,
            id_list: [current.ID],
            screen: current.ID,
            screen_string: current.Label
          });
          this.text.result.push({
            exclude: false,
            id_list: [current.ID],
            screen: current.ID,
            screen_string: current.Label
          });

          this.IN.push(current.ID);
          return array;
        }, []);

        this.resultData.total = this.default.length;

        const lastItem = arr[arr.length - 1];
        if (lastItem.screen_string.indexOf('已经选中') >= 0) {
          arr.pop();
          this.text.result.pop();
          this.IN.pop();
        }

        this.resultData.list = arr;
      }
    }


  };
</script>
<style lang="less">
.ark--dialog {
    .iconbj_delete2{
        cursor: pointer;
        &:hover{
        color: #fff;
        background: #e6502f;
        border-radius: 100%;
        width: 16px;
        height: 16px;
      }
  }
    .dialog_center .dialog_p10{
      padding:0px 0 6px 0px
    }
    .ark-tabs-bar{
      margin-bottom: 10px
    }
    .ark-tabs{
      overflow: visible;
    }
    .dialog_center .dialog_center_bottom{
    margin-top: 10px;
    height: 44px;
    }

    .dialog_center .dialog_center_bottom{
        height: 26px!important;
        line-height: 26px!important;

    }
    .dialog_center .dialog_center_bottom .dialog_center_bottom_fix input{
        height: 26px!important;
        line-height: 26px!important;  
    }
    .dialog_center{
      overflow: hidden;
    }
    .ark--dialog .dialog_center .table{
        height: 345px!important; 
    }
}
  
</style>
<style lang="less" scoped>
  .ark-select-item{
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


  .ark--dialog {
    
    .dialog_center .dialog_p10{
      padding:0px 0 6px 0px
    }
    .ark-tabs-bar{
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
  .ark-poptip-body{
      
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
 .dialog_center .dialog_center_bottom .dialog_center_bottom_fix input{
      height: 26px;
      line-height: 26px;
 }
 .dialog_center .dialog_center_bottom .dialog_center_bottom_fix input{
      height: 26px;
      line-height: 26px;
 }
 .ark--dialog .dialog_center .dialog_center_bottom{
     height: 26px;
      line-height: 26px;
 }

</style>
