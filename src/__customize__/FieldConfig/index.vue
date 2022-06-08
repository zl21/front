<template>
  <div :class="prefixClass">
    <!-- 头部功能 -->
    <section class="field-page-header">
      <div class="field-page-header-l">
        <arkButton
          class="config-btn"
          @click="saveAndApply"
        >{{$t('fieldConfig.saveAndApply')}}</arkButton>
        <arkButton
          type="fcdefault"
          class="config-btn"
          @click="save"
        >{{$t('fieldConfig.onlySave')}}</arkButton>
        <arkButton
          type="fcdefault"
          class="config-btn"
          @click="createTemplateDialog('saveAs')"
        >{{$t('fieldConfig.saveAs')}}</arkButton>
        <arkButton
          type="fcdefault"
          class="config-btn"
          @click="createTemplateDialog('add')"
        >{{$t('fieldConfig.increase')}}</arkButton>
        <arkButton
          type="fcdefault"
          class="config-btn"
          @click="back"
        >{{$t('fieldConfig.back')}}</arkButton>
        <arkButton
          type="fcdefault"
          @click="handleDelete"
        >{{$t('fieldConfig.delete')}}</arkButton>
      </div>
      <div class="field-page-header-r">
        <span>{{$t('fieldConfig.template')}}：</span>
        <!-- 切换模板 -->
        <Select
          v-model="selectedTemplate"
          style="width:344px"
          @on-change="handleChange"
        >
          <Option
            v-for="item in templateList"
            :value="item.value"
            :key="item.value"
          >{{ item.label }}</Option>
        </Select>
      </div>
    </section>

    <section class="field-page-body">
      <div class="config-wrap">
        <Tabs
          :value="currentTab"
          :animated="false"
        >
          <TabPane
            :label="tab.label"
            :name="index.toString()"
            v-for="(tab, index) in tabList"
            :key="index"
          >
            <div class="config-content">
              <div class="config-panel">
                <div class="fields-wrap">
                  <FieldTree></FieldTree>
                </div>
              </div>
              <div
                class="config-panel"
                v-show="tab.type !== 2"
              >
                <div class="config-title">{{$t('fieldConfig.listField')}}（{{$t('fieldConfig.drag')}}）</div>
                <div class="config-area">
                  <DragPanel v-model="visibleFields"></DragPanel>
                </div>
              </div>
              <div
                class="config-panel"
                v-show="tab.type !== 2"
              >
                <div class="config-title">{{$t('fieldConfig.filterField')}}（{{$t('fieldConfig.drag')}}）</div>
                <div class="config-area">
                  <DragPanel v-model="filterFields"></DragPanel>
                </div>
              </div>
              <div
                class="config-panel"
                v-show="tab.type === 2"
              >
                <div class="config-title">{{$t('fieldConfig.visibleFields')}}</div>
                <div class="config-area">
                  <FoldTree></FoldTree>
                </div>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </section>

  </div>
</template>

<script type="text/ecmascript-6">
import FieldTree from './FieldTree.vue'
import DragPanel from './DragPanel.vue'
import FoldTree from './FoldTree.vue'
import DialogContent from './DialogContent'
import i18n from '../../assets/js/i18n'
import Vue from 'vue'
import { getAllFields } from '../../api/fieldConfig'

const prefixClass = `field-page`;

Vue.component('DialogContent', DialogContent)

export default {
  name: 'FieldPage',

  components: {
    FieldTree,
    DragPanel,
    FoldTree
  },

  data() {
    return {
      prefixClass,
      currentTemplate: 'London',
      selectedTemplate: 'London',
      templateList: [
        {
          value: 'New York',
          label: 'New York'
        },
        {
          value: 'London',
          label: 'London'
        },
      ],
      currentTab: '1',
      visibleFields: [
        {
          value: 'New York',
          enableDrag: true
        },
        {
          value: '带参数金色里程角色登录残局得胜了上传介绍',
          enableDrag: false
        },
        {
          value: 'csdcc',
          enableDrag: true
        }
      ],
      filterFields: [{
        value: 'csdcc',
        enableDrag: true
      }],
      tabList: [
        {
          label: '列表界面配置',
          value: 0,
          type: 1, // 1是列表，2是主表, 3是子表
        },
        {
          label: '单对象界面主表配置',
          value: 1,
          type: 2
        },
        {
          label: '单对象界面子表()配置',
          value: 3,
          type: 3
        },
      ],
      createdTemplateName: ''
    }
  },

  methods: {
    saveAndApply() {
      this.$Modal.fcWarning({
        title: this.$t('tips.warning'),
        content: this.$t('fieldConfig.newTemplate') + '？',
        titleAlign: 'center',
        mask: true,
        showCancel: true,
        onOk: () => {
          this.createTemplateDialog('add')
        }
      })
    },

    save() {
    },

    back() {
      const { fullPath } = this.$route;
      const tableName = this.$route.params.customizedModuleName
      const tableId = this.$route.params.customizedModuleId
      const key = `${tableName}/${tableId}`
      const { keepAliveModuleName } = this.$store.state.global.activeTab;

      if(!this.$router.$R3_history[key]) {
        return
      }
      const url = this.$router.$R3_history[key].fullPath
      this.$store.commit('global/tabCloseAppoint', {
        routeFullPath: fullPath,
        keepAliveModuleName,
        tableName
      });

      this.$store.commit('global/tabOpen', {
        back: true,
        url,
        NToUpperCase: true,
      })
    },

    handleDelete() {
      this.$Modal.fcWarning({
        title: this.$t('tips.warning'),
        content: this.$t('fieldConfig.notDelete') + '？',
        titleAlign: 'center',
        mask: true,
        showCancel: true,
        onOk: () => {
        }
      })

      // this.$Modal.fcWarning({
      //   title: this.$t('tips.warning'),
      //   content: this.$t('fieldConfig.shouldDelete'),
      //   titleAlign: 'center',
      //   mask: true,
      //   showCancel: true,
      //   onOk: () => {
      //   }
      // })
    },

    createTemplateDialog(type) {
      const title = type === 'add' ? this.$t('fieldConfig.createTemplate') : this.$t('fieldConfig.saveAsTemplate')
      this.$Modal.fcSuccess({
        title,
        render: (r) => {
          return r('DialogContent', {
            on: {
              change: (e) => {
                this.createdTemplateName = e.target.value
                console.log("🚀 ~ file: index.vue ~ line 181 ~ save ~ this.createdTemplateName", this.createdTemplateName)
              }
            }
          })
        },
        titleAlign: 'center',
        mask: true,
        showCancel: true,
      })
    },

    handleChange(e) {
      const isSaved = false
      if (this.currentTemplate !== e && !isSaved) {
        this.selectedTemplate = this.currentTemplate
        this.$Modal.fcWarning({
          title: this.$t('tips.warning'),
          content: this.$t('fieldConfig.switchTemplate'),
          titleAlign: 'center',
          mask: true,
        })
      } else {
        this.currentTemplate = e
      }
    },

    getAllFields() {
      console.log(this.$route)
      const tableId = this.$route.params.customizedModuleId
      getAllFields({
        table_id: tableId
      }).then(res => {
        console.log("🚀 ~ file: index.vue ~ line 292 ~ network.post ~ res", res)
        if(res.code === 0) {
        }
      })
    }
  },

  beforeCreate() {
    this.$t = i18n.t.bind(i18n)
  },

  mounted() {
    this.getAllFields()
  }
}
</script>

<style lang="scss" scoped>
@import './index.less';
</style>