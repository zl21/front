<template>
  <div class="AutomaticPathGeneration">
    <Form
      :model="formItem"
      :label-width="200"
    >
      <FormItem label="请选择要生成的路由类型">
        <Select
          v-model="formItem.pathTypeModel"
          label-in-value
          @on-change="pathTypeModelChange"
        >
          <Option
            v-for="item in formItem.pathType"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </Option>
        </Select>
      </FormItem>
      <FormItem
        v-if="formItem.pathTypeModel&&formItem.Name"
        :label="formItem.Name"
      >
        <Input
          v-model="formItem.nameValue"
          :placeholder="formItem.nameValuePlaceholder"
        />
      </FormItem>
      <FormItem
        v-if="formItem.pathTypeModel&&formItem.Id"
        :label="formItem.Id"
      >
        <Input
          v-model="formItem.idValue"
        />
      </FormItem>
    
      <FormItem
        v-if="currentInfo.type&&currentInfo.type==='TABLE_DETAIL'"
        label="请选择需要跳转的单对象界面类型:"
      >
        <Select
          v-model="formItem.singleObjectPageValue"
          label-in-value
          @on-change="singleObjectChange"
        >
          <Option
            v-for="item in formItem.singleObjectPageData"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </Option>
        </Select>
      </FormItem>

      <FormItem
        v-if="formItem.singleObjectPageValue==='0'"
        label="明细ID"
      >
        <Input
          v-model="formItem.singleObjectPageItemId"
        /></Input>
      </FormItem>
      <FormItem>
        <Input
          v-model="formItem.path"
          placeholder="path"
          readonly
          disabled
        />
      </FormItem>
    
      <FormItem>
        <Button
          type="primary"
          @click="AutomaticPathGeneration"
        >
          生成path
        </Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
// 自动生成路径
  import {
    CUSTOMIZED_MODULE_PREFIX,
    HORIZONTAL_TABLE_DETAIL_PREFIX,
    STANDARD_TABLE_LIST_PREFIX,
    VERTICAL_TABLE_DETAIL_PREFIX,
    PLUGIN_MODULE_PREFIX,
    LINK_MODULE_PREFIX,
  } from '../constants/global';

  export default {
    name: 'AutomaticPathGeneration',
    watch: {
      'formItem.pathTypeModel': {
        handler() {
          this.formItem.idValue = '';
          this.formItem.nameValue = '';
          this.formItem.path = '';
          this.formItem.idValuePlaceholder = '';
          this.formItem.nameValuePlaceholder = '';
          this.formItem.singleObjectPageValue = '';
          this.formItem.singleObjectPageItemId = '';
        }
      },
      'formItem.singleObjectPageItemId': {
        handler(val) {
          this.currentInfo.itemId = val;
        }
      },
    },
    data() {
      return {
        formItem: {
          idValue: '',
          nameValue: '',
          pathTypeModel: '',
          Id: '',
          Name: '',
          path: '',
          idValuePlaceholder: '',
          nameValuePlaceholder: '',
          singleObjectPageValue: '',
          singleObjectPageItemId: '',
          singleObjectPageData: [
            {
              value: '0',
              label: '跳转指定单对象界面',
            },
            {
              value: '1',
              label: '动态获取列表明细跳转单对象界面',
              itemId: ':itemId'
            }
          ],
          pathType: 
            [{
               value: `${STANDARD_TABLE_LIST_PREFIX}/`,
               label: '标准列表界面',
               tableName: '主表表名:',
               tableId: '主表ID:',
             },
             {
               value: `${HORIZONTAL_TABLE_DETAIL_PREFIX}/`,
               label: '单对象左右结构界面',
               tableName: '主表表名:',
               tableId: '主表ID:',
               type: 'TABLE_DETAIL'
             },
             {
               value: `${VERTICAL_TABLE_DETAIL_PREFIX}/`,
               label: '单对象上下结构界面',
               tableName: '主表表名:',
               tableId: '主表ID:',
               type: 'TABLE_DETAIL'

             },
             {
               value: `${CUSTOMIZED_MODULE_PREFIX}/`,
               label: '定制界面',
               tableName: '定制界面Name:',
               tableId: '定制界面ID:',
             },
             {
               value: `${LINK_MODULE_PREFIX}/`,
               label: '外链界面',
               tableName: '外链界面Name:',
               tableId: '外链界面ID:',
             },
             {
               value: `${PLUGIN_MODULE_PREFIX}/`,
               label: '插件界面',
               tableName: '插件界面Name:',

             },
             {
               value: 'ALL/',
               label: '定制tab页面Name:',
               tableName: '定制tab页面Name:',
             },
            ],
        },
        currentInfo: {
            
        }
       
      };
    },
    computed: {
     
    },
    methods: {
     
      AutomaticPathGeneration() {
        if (this.currentInfo.itemId) {
          this.formItem.path = `${this.currentInfo.value}${this.formItem.nameValue}/${this.formItem.idValue}/${this.currentInfo.itemId}`;
        } else if (this.formItem.idValue) {
          this.formItem.path = `${this.currentInfo.value}${this.formItem.nameValue}/${this.formItem.idValue}`;
        } else {
          this.formItem.path = `${this.currentInfo.value}${this.formItem.nameValue}`;
        }
        this.$emit('setValue', this.formItem.path);
        // this.$emit('closeActionDialog', true);
      },
      singleObjectChange(data) {
        const dataRes = this.formItem.singleObjectPageData.filter(item => item.value === data.value)[0];
        if (this.formItem.singleObjectPageValue === '1') {
          this.currentInfo.itemId = dataRes.itemId;
        } 
      },
      pathTypeModelChange(data) {
        this.currentInfo = this.formItem.pathType.filter(item => item.value === data.value)[0];

        if (data.value === this.currentInfo.value) {
          if (this.currentInfo.tableId) {
            this.formItem.Id = this.currentInfo.tableId;
          }
          if (this.currentInfo.tableName) {
            this.formItem.Name = this.currentInfo.tableName;
          }
        }
      }
    }
  };
</script>
<style lang="less" scoped>
.AutomaticPathGeneration{
    width:1000px;
}
</style>
