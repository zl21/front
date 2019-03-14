<template>
  <div class="StandardTableListRootDiv">
    <buttonGroup :data-array="dataArray" />
    <FormItemComponent
      ref="FormItemComponent"
      :form-item-lists="lists"
      :default-column="4"
      @formDataChange="formDataChange"
    />
    <AgTable
      ref="agTableElement"
      :page-attribute="pageAttribute"
      :datas="ag.datas"
      :on-page-change="onPageChange"
      :on-page-size-change="onPageSizeChange"
    />
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import buttonGroup from './button';
  import AgTable from './StandardTable';
  import FormItemComponent from './FormItemComponent';
  import itemComponent from './itemComponent';
  import { STANDARD_TABLE_COMPONENT_PREFIX } from '../constants/global';

  export default {
    components: {
      buttonGroup,
      AgTable,
      FormItemComponent,
    },
    data() {
      return {
        dataArray: {
          printValue: true,
          waListButtons: [
            {
              action: '/p/c/loadschema',
              actiontype: 'url',
              confirm: null,
              cuscomponent: null,
              ishide: false,
              isrefrsh: false,
              vuedisplay: 'slient',
              webdesc: '重载',
              webicon: null,
              webid: 2221,
              webname: 'loadschema',
            }
          ],
          buttonGroupShow: [

            {
              action: '',
              defbutton: 'S',
              icon: '',
              name: '新增',
              requestUrlPath: '',
            },
            {
              action: '',
              defbutton: 'S',
              icon: '',
              name: '删除',
              requestUrlPath: '',
            },
            {
              action: '',
              defbutton: 'S',
              icon: '',
              name: '批量修改',
              requestUrlPath: '',
            },
            {
              action: '',
              defbutton: 'S',
              icon: '',
              name: '导入',
              requestUrlPath: '',
            },
            {
              action: '',
              defbutton: 'S',
              icon: '',
              name: '导出',
              requestUrlPath: '',
            },
          ],
        },
        searchData: {
          table: this.$route.params.tableName,
          startIndex: 0,
          range: 10
        },
        lists: [
          {
            row: 1,
            col: 1,
            component: itemComponent,
            item: {
              // item 类型
              type: 'input', // 必填!
              // label名称
              title: '商品名称', // 必填!
              // 字段名称
              field: 'goods_name', // 必填!
              // input值
              value: '1',
              props: {
              },
              event: {

              },
              validate: // 校验规则  默认onchage
                {
                  // 动态计算key
                  dynamicforcompute: {
                    // 逻辑运算key
                    refcolumns: ['is_postage', 'cate_id'],
                    // 被计算字段（目标）
                    computecolumn: 'goods_name',
                    // 中间函数
                    express: 'is_postage + cate_id'
                  },
                  // 提示信息
                  tip: '',
                  // 触发方法
                  trigger: ''
                }
            }


          },
          {
            row: 1,
            col: 1,
            // 字段名称
            component: itemComponent,
            item: {
              // item 类型
              type: 'checkbox', // 必填!
              // label名称
              title: '是否包邮', // 必填!
              // 字段名称
              field: 'is_postage', // 必填!
              // input值
              value: false,
              props: {

              },
              validate: {
                hidecolumn: {
                  refcolumn: 'cate_name',
                  refval: '2'
                }
              }
            }
          },
          {
            row: 1,
            col: 1,
            component: itemComponent,
            item: {
              // item 类型
              type: 'select', // 必填!

              // label名称
              title: '产品分类', // 必填!
              // 字段名称
              field: 'cate_id', // 必填!
              // input值
              value: '',
              options: [
                { value: '104', label: '生态蔬菜', disabled: false },
                { value: '105', label: '新鲜水果', disabled: false },
              ],
              props: {
                type: 'datetimerange',
              },
              validate: [ // 校验规则  默认onchage
              ]
            }
          },
          {
            row: 1,
            col: 1,
            component: itemComponent,
            item: {
              // item 类型
              type: 'DropDownSelectFilter', // 必填!
              // label名称
              title: '产品name', // 必填!
              // 字段名称
              field: 'cate_name', // 必填!
              // input值
              value: '',
              props: {

              },
              validate: {
                // // 隐藏字段
                // hidecolumn: {
                //   // 逻辑运算key
                //   refcolumn: ['cate_name'],
                //   // 隐藏条件 value值
                //   refval: '2'
                // }
              }
            }
          }
        ]
      };
    },

    methods: {
      ...mapActions('global', ['updateAccessHistory']),
      getQueryList() {
        const { agTableElement } = this.$refs;
        agTableElement.showAgLoading();
        this.getQueryListForAg(this.searchData);
      },
      onPageChange(page) {
        const { range } = this.searchData;
        this.searchData.startIndex = range * (page - 1);
        this.getQueryList();
      },
      onPageSizeChange(pageSize) {
        this.searchData.startIndex = 0;
        this.searchData.range = pageSize;
        this.getQueryList();
      },
      

      // 表单操作
      formDataChange(data, item) {
        console.log(data, item);
      },
      
    },
    mounted() {
      // 记录模块名
      const { tableName, tableId } = this.$route.params;
      this.moduleStateName = `${STANDARD_TABLE_COMPONENT_PREFIX}.${tableName}.${tableId}`;
      this.getQueryList();
    },
    activated() {
      const { tableId } = this.$route.params;
      this.updateAccessHistory({ type: 'table', id: tableId });
    },
    beforeDestroy() {
      this.$store.unregisterModule(this.moduleStateName);
    }
  };
</script>

<style scoped lang="less">
  .StandardTableListRootDiv {
    width: 100%;
    overflow: auto;
  }
</style>
