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
        v-if="formItem.pathTypeModel"
        :label="formItem.Id"
      >
        <Input
          v-model="formItem.idValue"
          :placeholder="formItem.idValuePlaceholder"
        /></Input>
      </FormItem>
      <FormItem
        v-if="formItem.pathTypeModel"
        :label="formItem.Name"
      >
        <Input
          v-model="formItem.nameValue"
          :placeholder="formItem.nameValuePlaceholder"
        /></Input>
      </FormItem>
      <FormItem>
        <Input
          v-model="formItem.path"
          placeholder="path"
        /></Input>
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

    data() {
      return {
        formItem: {
          pathTypeModel: '',
          Id: '',
          Name: '',
          path: '',
          idValuePlaceholder: '',
          nameValuePlaceholder: '',
          pathType: 
            [{
               value: `${STANDARD_TABLE_LIST_PREFIX}/`,
               label: '标准列表界面',
               tableName: '主表表名:',
               tableId: '主表ID:',
             },
             {
               value: `${HORIZONTAL_TABLE_DETAIL_PREFIX}/`,
               label: '单对象左右结构界面'
             },
             {
               value: `${VERTICAL_TABLE_DETAIL_PREFIX}/`,
               label: '单对象上下结构界面'
             },
             {
               value: `${CUSTOMIZED_MODULE_PREFIX}/`,
               label: '定制界面'
             },
             {
               value: `${LINK_MODULE_PREFIX}/`,
               label: '外链界面'
             },
             {
               value: `${PLUGIN_MODULE_PREFIX}/`,
               label: '插件界面'
             },
             {
               value: 'ALL/',
               label: '定制tab'
             },
            ],
        },
        currentPathInfo: {
            
        }
       
      };
    },
    methods: {
      AutomaticPathGeneration() {
        this.formItem.path = `${this.currentInfo.value}${this.formItem.nameValue}/${this.formItem.idValue}`;
      },
      pathTypeModelChange(data) {
        this.currentInfo = this.formItem.pathType.filter(item => item.value === data.value)[0];
        if (data.value === '/SYSTEM/TABLE/') {
          this.formItem.Id = this.currentInfo.tableId;
          this.formItem.Name = this.currentInfo.tableName;
        }
      }
    }
  };
</script>
<style lang="less" scoped>
.AutomaticPathGeneration{
    
}
</style>
