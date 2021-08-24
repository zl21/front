<template>
  <div class="description">
    <div style="flex:1">
      <span class="fieldName">
        {{ option.name }} ：
      </span>
      <span class="content">
        {{ option.description }}
      </span>
    </div>
    <div
      style="display: flex; align-items: center;"
      @click="removeOption"
    >
      <Button
        :title="$t('extensionProperty.clearConfig')"
        icon="iconbj_delete"
        type="primary"
        shape="circle"
      />
    </div>
  </div>
</template>

<script>
import i18n from '../../../utils/i18n'

export default {
  name: 'Description',
  props: {
    option: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    clearDomValue() {
      const extentionProperty = document.querySelector('.extentionProperty .middle');
      extentionProperty.querySelectorAll('input,select').forEach((e) => {
        e.value = '';
        if (e.type === 'radio' && e.value === '') {
          e.checked = true;
        } else {
          e.checked = false;
        }
      });
    },
    removeOption() {
      switch (this.option.type) {
        case 'input':
          this.$emit('removeOption', [this.option.key]);
          break;
        case 'radio':
          this.$emit('removeOption', [this.option.key]);
          break;
        case 'object-group':
          this.$emit('removeOption', [this.option.key]);
          break;
        case 'input-group':
          if (this.option.key === '__root__') {
            this.$emit('removeOption', this.option.inputLists.map(d => d.key));
          } else {
            this.$emit('removeOption', [this.option.key]);
          }
          break;
        default:
          this.$emit('removeOption', [this.option.key]);
          break;
      }
      this.clearDomValue();
    }
  },

  beforeCreate() {
    this.$t = i18n.t.bind(i18n)
  },
};
</script>

<style scoped>
</style>
