<template>
  <div class="complexBox">
    <Input
      v-model="approves"
      placeholder="请输入"
      icon="ios-funnel-outline"
      disabled
      @on-click="onIconclick"
    />
    <Modal
      v-model="openControl"
      :title="title"
      :mask="true"
      :mask-closable="false"
      :width="932"
      @on-ok="ok"
      @on-cancel="cancel"
    >
      <div class="modalCotent">
        <mutipleSelectPop
          v-if="openControl"
          ref="dialogtest"
          :result-data="resultMessage"
          :is-use="isUse"
          :is-mutiple="true"
          @getResult="getResult"
        />
      </div>
    </Modal>
  </div>
</template>
<script>
  import mutipleSelectPop from './MutipleSelectPop';

  export default {
    name: 'ComplexBox',
    components: { mutipleSelectPop },
    props: {
      title: {
        type: String,
        default: ''
      },
      defaultValue: {
        type: String,
        default: ''
      },
      resultData: {
        type: Object,
        default: () => ({})
      },
      isUse: {
        type: Boolean,
        default: true
      },
      isMutiple: {
        type: Boolean,
        default: true
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        openControl: false,
        approves: '',
        resultObj: {
          total: 0,
          list: []
        },
        result: {
          // 结果备份
          total: 0,
          list: []
        }
      };
    },
    computed: {
      resultMessage() {
        // let data = Object.assign(this.resultObj, this.resultData);
        return this.resultObj;
      }
    },
    methods: {
      onIconclick() {
        if (this.disabled) {
          return;
        }
        this.openControl = true;
        this.isCallInterface = true;
        this.resultObj = this.deepCopy(this.result);
        this.resultObj.total = this.resultObj.list.length;
      },
      getResult(data) {
        // 组件的结果
        this.resultObj = this.deepCopy(data);
      },
      ok() {
        if (this.resultObj.list.length > 0) {
          this.result.list = [];

          // 增加
          // 新增
          this.resultObj.list.map((item) => {
            if (this.result.list.length > 0) {
              // 修改
              const flagIndex = this.result.list.findIndex(inner => (
                item.approve_value === inner.approve_value || item.ID === Number(inner.approve_value)
              ));
              if (flagIndex === -1) {
                // 没有相同的
                this.result.list.push({
                  approve_type: item.approve_type,
                  approve_value: item.approve_value ? item.approve_value : item.ID,
                  approve_value_name: item.string,
                  string: item.string
                });
              }
            } else {
              // 新增
              this.result.list.push({
                approve_type: item.approve_type,
                approve_value: item.approve_value ? item.approve_value : item.ID,
                approve_value_name: item.string,
                string: item.string
              });
            }
          });
        } else {
          // 清空
          this.result.list = [];
        }
        this.result.total = this.result.list.length;
        this.formatString(this.result);
        this.$emit('getTotalResult', this.result);
        this.openControl = false;
        this.isCallInterface = false;
      },
      cancel() {
        this.resultObj = this.deepCopy(this.result);
        // this.$emit("getTotalResult", this.arr);
        this.openControl = false;
        this.isCallInterface = false;
      },
      formatString(data) {
        // input内容显示处理
        this.approves = '';
        if (data.list && data.list.length > 0) {
          data.list.forEach((item) => {
            this.approves += `${item.string},`;
          });
          if (this.approves.length > 0) {
            this.approves = this.approves.substring(0, this.approves.length - 1);
          } else {
            this.approves = '';
          }
        }
      },
      deepCopy(obj) {
        const result = Array.isArray(obj) ? [] : {};
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
              result[key] = this.deepCopy(obj[key]); // 递归复制
            } else {
              result[key] = obj[key];
            }
          }
        }
        return result;
      }
    },
    created() {
      if (this.resultData && Object.keys(this.resultData).length > 0) {
        this.resultObj = this.deepCopy(this.resultData);
        this.result = this.deepCopy(this.resultData);
        this.formatString(this.resultObj);
      }
    }
  };
</script>
