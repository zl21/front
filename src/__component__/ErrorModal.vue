  
<template>
  <div class="errorMessage">
    <Modal
      v-model="errorDialog"
      :title="title"
      @on-ok="confirmDialog()"
      @on-cancel="closeDialog()"
    >
      <p
        v-for="(item, index) in errorMessage"
        v-if="errorFlag"
        :key="index"
        v-html="item.content"
      />
      <p
        v-if="!errorFlag"
        v-html="errorMessage.content"
      />
    </Modal>
  </div>
</template>

<script>
  export default {
    props: {
      errorDialog: {
        type: Boolean,
        default: false
      },
      
      errorMessage: {
        type: [Object, Array],        
        default() {
        
        }
      },
      dialogClass: {
        type: String,
        default: ''
      }, // 定义用哪个弹框
      title: {
        type: String,
        default: ''
      },
      // DialogBack: {

      // },
      hiddenButton: {
        type: Boolean,
      },
 

    },
    data() {
      return {
        errorFlag: false
      };
    },
    methods: {
      closeDialog() {
        this.$emit('closeDialog');
      },
      confirmDialog() {
        this.$emit('confirmDialog');
      }
    },
  
  };
</script>
