  
<template>
  <div class="errorMessage">
    <Modal
      v-model="showFlag"
      :title="title"
      @on-ok="confirmDialog()"
      @on-cancel="closeDialog()"
    >
      <p
        v-for="(item, index) in errorMessage"
        :key="index"
        v-html="item.content"
      />
      <p
        v-if="!errorFlag"
        v-html="errorMessage.content"
      />
      <div
        v-if="!hiddenButton"
        slot="footer"
      >
        <Button
          @click.stop="closeDialog(true)"
          @keyup.13.stop="confirmDialog()"
        >
          {{ ChineseDictionary.ENSURE }}
        </Button>
        <Button
          v-if="dialogBack"
          @click.stop="closeDialog()"
        >
          {{ ChineseDictionary.CANCEL }}
        </Button>
      </div>

      <div
        v-if="hiddenButton"
        class="bottom"
      >
        <Button
          v-if="dialogBack"
          @click.stop="closeDialog()"
        >
          {{ ChineseDictionary.ENSURE }}
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import ChineseDictionary from '../assets/js/ChineseDictionary';

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
      dialogBack: {
        type: Boolean,
      },
      hiddenButton: {
        type: Boolean,
      },
      // errorDialogBack: {
      //   type: Boolean,
      //   default: false
      // },
 

    },
    data() {
      return {
        errorFlag: false,
        showFlag: false,
      };
    },
    created() {
      this.ChineseDictionary = ChineseDictionary;
      console.log('🐰', this.dialogBack);
    },
    mounted() {
      if (this.errorDialog) this.showFlag = true;
      else this.showFlag = false;
      if (this.errorMessage instanceof Array) {
        this.errorFlag = true;
      } else {
        this.errorFlag = false;
      }
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
