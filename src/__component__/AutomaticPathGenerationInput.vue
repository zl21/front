<template>
  <div :class="classes">
    <Input
      v-model="automaticPathGenerationValue"
      placeholder="生成路由..."
      style="width: 200px"
      icon="md-color-wand"
      @on-click="automaticPathGeneration"
    />

    <Dialog
      ref="dialogRef"
      :title="dialogConfig.title"
      :mask="dialogConfig.mask"
      :content-text="dialogConfig.contentText"
      :footer-hide="dialogConfig.footerHide"
      :confirm="dialogConfig.confirm"
      :closable="true"
      :dialog-component-name="dialogComponentName"
      @clearDialogComponentName="clearDialogComponentName"
      @setValue="setValue"
    />
  </div>
</template>
<script>
// 自动生成路径
  import Vue from 'vue';
  import Dialog from './Dialog.vue';
  import AutomaticPathGeneration from './AutomaticPathGeneration.vue';
  import { classFix } from '../constants/global';


export default {
    components: { Dialog },
    data() {
      return {
        automaticPathGenerationValue: '',
        dialogComponentName: null,
        dialogConfig: {
          title: '提示',
          mask: true,
          footerHide: false,
          contentText: '',
          confirm: () => {
          }
        }, // 弹框配置信息

      };
    },
    computed: {
      classes() {
        return [
          `${classFix}AutomaticPathGenerationInput`,
        ];
      },
    },
    methods: {
      setValue(value) {
        this.automaticPathGenerationValue = value;
      },
      clearDialogComponentName() {
        this.dialogComponentName = null;
        //  this.$emit('buttonClick', type, item);
      },
      automaticPathGeneration() {
        this.$refs.dialogRef.open();
        const title = '生成路由';
        this.dialogConfig = {
          title,
        };
        this.dialogConfig.footerHide = true;
        Vue.component('AutomaticPathGeneration', AutomaticPathGeneration);
        this.dialogComponentName = 'AutomaticPathGeneration';
      }
    }
  };
</script>
