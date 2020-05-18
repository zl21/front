<template>
  <div class="mainComponent">
    <ApprovelModel
      v-if="modalConfigShow"
      :config="modalConfig"
    />
  </div>
</template>
<script>
  import ApprovelModel from './ApprovelModel';

  export default {
    name: 'MainComponent',
    components: {
      ApprovelModel
    },
    data() {
      return {
        modalConfig: {},
        modalConfigShow: false,
        // 待办列表数据
        todoListsShow: false
      };
    },
    methods: {
      open(option) {
        this.modalConfig.control = option.control;
        if (option.type) {
          this.modalConfig.type = option.type;
        }
        if (option.url) {
          this.modalConfig.url = option.url;
        }
        if (option.instanceId) {
          this.modalConfig.instanceId = option.instanceId;
        }
        if (option.returnOption) {
          this.modalConfig.selection = option.returnOption;
        }
        if (option.buttons) {
          this.modalConfig.buttons = option.buttons;
        }
        if (option.id) {
          this.modalConfig.id = option.id;
        }

        if (option.item) {
          this.modalConfig.item = option.item;
        }
        // this.modalConfig = option
        console.log(option);
        setTimeout(() => {
          this.modalConfigShow = option.control;
        }, 200);
      },
      todoListsFun(option) {
        this.todoListsShow = option;
      }
    }
  };
</script>
<style lang="less" >
.mainComponent {
  * {
    box-sizing: border-box !important;
  }
}
</style>
