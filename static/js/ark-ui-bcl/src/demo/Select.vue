<template>
  <div>
    <h5>select选择器</h5>
    <ak-select
      label-in-value
      :options="options"
      @on-change="changeFn"
      @on-clear="clearFn"
    ></ak-select>
  </div>
</template>

<script type="text/ecmascript-6">
import AkSelect from '../components/select'
export default {
  name: '',

  components: {
    AkSelect
  },

  data() {
    return {
      options: {
        placeholder: '请选择事件类型',
        defaultValue: 'request',
        selectOptions: [
          {
            label: '弹框',
            value: 'modal'
          },
          {
            label: '请求',
            value: 'request'
          },
          {
            label: '路由',
            value: 'route'
          }
        ]
      },
    }
  },

  methods: {
    changeFn(value) {
      console.log(value);
    },

    clearFn() {
      console.log('清空');
    }
  }
}
</script>
