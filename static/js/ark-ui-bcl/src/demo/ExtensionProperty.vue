<template>
  <div>
    <div class="font-bold">扩展属性组件</div>

    <ExtensionProperty
      :default-data="defaultData"
      @valueChange="valueChange"
      :formInfo="formInfo"
      :table="tableName"
      :network='network'
    ></ExtensionProperty>

    <div>
      展示：<textarea
        :value="defaultData"
        style="width: 800px;height:500px;"
      ></textarea>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import ExtensionProperty from '../components/extension-property'
import Mixin from '../demo/mixin/common.js';
import formInfo from '../mockData/formInfo'
import { http } from '../utils/network'

export default {
  name: '',

  components: {
    ExtensionProperty
  },

  mixins: [Mixin],

  data() {
    return {
      defaultData: '',
      tableName: 'AD_COLUMN', // 需要展示表的扩展属性还是字段的。表的是AD_TABLE，字段是AD_COLUMN
      webConfig: {},
      network:http,
      formInfo
    }
  },

  methods: {
    valueChange(data) {
      this.defaultData = data
    }
  },
}
</script>

<style lang="scss" scoped>
.form-group {
  border: 1px solid #d8d8d8;
  border-radius: 4px;
  padding: 10px 20px;
  margin: 20px 5px;
}
</style>