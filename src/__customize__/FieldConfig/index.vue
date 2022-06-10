<template>
  <div :class="prefixClass">
    <!-- 头部功能 -->
    <section class="field-page-header">
      <div class="field-page-header-l">
        <arkButton
          class="config-btn"
          @click="saveAndApply"
          v-if="hasTemplate"
        >{{$t('fieldConfig.saveAndApply')}}</arkButton>
        <arkButton
          type="fcdefault"
          class="config-btn"
          @click="save"
          v-if="hasTemplate"
        >{{$t('fieldConfig.onlySave')}}</arkButton>
        <arkButton
          type="fcdefault"
          class="config-btn"
          v-if="hasTemplate"
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
          @click="handleDelete"
          v-if="hasTemplate"
        >{{$t('fieldConfig.delete')}}</arkButton>
        <arkButton
          type="fcdefault"
          class="config-btn"
          @click="refresh"
        >{{$t('buttons.refresh')}}</arkButton>
        <arkButton
          type="fcdefault"
          class="config-btn"
          @click="back"
        >{{$t('fieldConfig.back')}}</arkButton>
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

    <section class="field-page-body" v-if="hasTemplate">
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
                  <FieldTree
                    :data="fieldTreeData"
                    @add-field="handleAddField"
                  ></FieldTree>
                </div>
              </div>
              <div
                class="config-panel"
                v-show="tab.type !== 2"
              >
                <div class="config-title">{{$t('fieldConfig.listField')}}</div>
                <div class="config-area">
                  <DragPanel v-model="visibleFields" enableSort></DragPanel>
                </div>
              </div>
              <div
                class="config-panel"
                v-show="tab.type !== 2"
              >
                <div class="config-title">{{$t('fieldConfig.filterField')}}</div>
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

    <section class="field-no-template" v-else>
      <img src="/static/images/field-config-null.png" alt="">
      <div class="add-tip">
        <span>{{$t('fieldConfig.addTipsOne')}}</span>
        <span class="add-hl" @click="createTemplateDialog('add')">"{{$t('buttons.add')}}"</span>
        <span>{{$t('fieldConfig.addTipsTwo')}}</span>
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
import { getAllFields, getAllTemplate, getTemplateFields, saveFields, applyFields, createTemplate, removeTemplate, getPublicTemplate } from '../../api/fieldConfig'

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
      currentTemplate: '',
      selectedTemplate: '',
      templateList: [],
      currentTab: '0',
      visibleFields: [],
      filterFields: [],
      tabList: [
        {
          label: this.$t('fieldConfig.listConfig'),
          value: 0,
          type: 1, // 1是列表，2是主表, 3是子表
        },
        // {
        //   label: '单对象界面主表配置',
        //   value: 1,
        //   type: 2
        // },
        // {
        //   label: '单对象界面子表()配置',
        //   value: 3,
        //   type: 3
        // },
      ],
      fieldTreeData: [],
      createdTemplateName: '',
      isDefaultTemplate: false,
      hasTemplate: false,
      publicTemplate: false,
    }
  },

  methods: {
    // 点击保存应用按钮
    saveAndApply() {
      const userInfoJson = window.localStorage.getItem('userInfo') || '{}'
      const { isadmin } = JSON.parse(userInfoJson)
      const vm = this
      this.$Modal.fcWarning({
        title: this.$t('feedback.warning'),
        content: this.$t('fieldConfig.newTemplate') + '？',
        titleAlign: 'center',
        mask: true,
        footerHide: true,
        footerTemplate: {
          template:
            `<div>
              <Checkbox v-model="isDefaultTemplate" @on-change="handleChange" v-if="isadmin" style="text-align:left;width: 182px;">${vm.$t('fieldConfig.setDefault')}</Checkbox>
              <Button size="small" type="fcdefault" @click="close">${vm.$t('buttons.cancel')}</Button>
              <Button size="small" type="fcdefault" @click="ok">${vm.$t('buttons.confirm')}</Button>
            </div>`,
          data() {
            return {
              isDefaultTemplate: vm.isDefaultTemplate,
              isadmin: isadmin
            }
          },
          methods: {
            async ok() {
              await vm._applyFields() // 把当前界面数据保存到新模板
              vm.$Message.success(vm.$t('feedback.saveSuccess'))
              vm.isDefaultTemplate = false
              vm.cacheConfig()
              const publicRes = await getPublicTemplate({table_id: vm._tableId})
              if(publicRes.code === 0) {
                vm.publicTemplate = publicRes.data
              }
              console.log("🚀 ~ file: index.vue ~ line 544 ~ _getAllTemplate ~ publicRes", publicRes)
              vm.templateList = vm.templateList.map(item => {
                return {
                  label: vm.publicTemplate === item.value ? item.value + `(${vm.$t('fieldConfig.publicTemplate')})` : item.value,
                  value: item.value
                }
              })
              this.$parent.close()
            },
            close() {
              this.$parent.close();
            },

            handleChange(e) {
              vm.isDefaultTemplate = e
            }
          }

        }
      })
    },

    // 点击仅保存
    async save() {
      await this._saveFields(this.currentTemplate)
      this.cacheConfig()
      this.$Message.success(this.$t('feedback.saveSuccess'))
    },

    // 调用保存修改接口
    async _saveFields(templateName) {
      await saveFields({
        template_name: templateName,
        table_id: this._tableId,
        COLUMN_CONDITIONS: this.filterFields,
        COLUMN_LIST: this.visibleFields
      }).then(res => {
        if (res.code === 0) {
        }
      })
    },

    // 调用保存应用配置api
    async _applyFields() {
      await applyFields({
        template_name: this.currentTemplate,
        table_id: this._tableId,
        COLUMN_CONDITIONS: this.filterFields,
        COLUMN_LIST: this.visibleFields,
        IS_DEFAULT: this.isDefaultTemplate
      }).then(res => {
        if (res.code === 0) {
        }
      })
    },

    back() {
      const isChange = this.isChangeData()
      if (isChange) {
        this.$Modal.fcWarning({
          title: this.$t('feedback.warning'),
          content: this.$t('messages.confirmBack'),
          titleAlign: 'center',
          mask: true,
          showCancel: true,
          onOk: () => {
            this.jump()
          }
        })
        return
      }

      this.jump()
    },

    jump() {
      const { fullPath } = this.$route;
      const tableName = this.$route.params.customizedModuleName
      const tableId = this.$route.params.customizedModuleId
      const key = `${tableName}/${tableId}`
      const { keepAliveModuleName } = this.$store.state.global.activeTab;

      if (!this.$router.$R3_history[key]) {
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

    // 删除
    handleDelete() {
      // this.$Modal.fcWarning({
      //   title: this.$t('feedback.warning'),
      //   content: this.$t('fieldConfig.notDelete') + '？',
      //   titleAlign: 'center',
      //   mask: true,
      //   showCancel: true,
      //   onOk: () => {
      //   }
      // })

      this.$Modal.fcWarning({
        title: this.$t('feedback.warning'),
        content: this.$t('fieldConfig.shouldDelete'),
        titleAlign: 'center',
        mask: true,
        showCancel: true,
        onOk: () => {
          removeTemplate({
            template_name: this.currentTemplate,
            table_id: this._tableId
          }).then(async (res) => {
            if (res.code === 0) {
              this.$Message.success(this.$t('feedback.deleteSuccessfully'))
              await this._getAllTemplate()
              this.resetTemplate()
              await this._getTemplateFields(this.currentTemplate)
            }
          })
        }
      })
    },

    // 打开创建模板名称弹框
    createTemplateDialog(type) {
      const vm = this
      const title = type === 'add' ? this.$t('fieldConfig.createTemplate') : this.$t('fieldConfig.saveAsTemplate')
      this.$Modal.fcSuccess({
        title,
        render: (r) => {
          return r('DialogContent', {
            on: {
              change: (e) => {
                this.createdTemplateName = e.target.value
              },
              enter: (e) => {
                if (!vm.createdTemplateName) {
                  vm.$Message.error(vm.$t('messages.requiredTemplateName'))
                  return
                }
                if (type === 'add') {
                  vm._createTemplate().then(async res => {
                    if (res.code === 0) {
                      await vm._getAllTemplate()
                      await vm._getTemplateFields(vm.createdTemplateName)
                      vm.currentTemplate = vm.createdTemplateName
                      vm.selectedTemplate = vm.createdTemplateName
                      vm.$Message.success(vm.$t('fieldConfig.createSuccess'))
                    }
                  })
                }
                if (type === 'saveAs') {
                  vm._createTemplate().then(async res => {
                    if (res.code === 0) {
                      vm.isDefaultTemplate = false
                      await vm._getAllTemplate()
                      await vm._applyFields() // 把当前界面数据保存到新模板
                      await vm._getTemplateFields(vm.currentTemplate) // 更新界面字段
                      vm.currentTemplate = vm.createdTemplateName
                      vm.selectedTemplate = vm.createdTemplateName
                      vm.$Message.success(vm.$t('feedback.saveSuccess'))
                    }
                  })
                }
              }
            }
          })
        },
        titleAlign: 'center',
        mask: true,
        footerHide: true,
        footerTemplate: {
          template:
            `<div><Button size="small" type="fcdefault" @click="close">${vm.$t('buttons.cancel')}</Button>
                    <Button size="small" type="fcdefault" @click="ok">${vm.$t('buttons.confirm')}</Button></div>`,
          methods: {
            ok() {
              if (!vm.createdTemplateName) {
                vm.$Message.error(vm.$t('messages.requiredTemplateName'))
                return
              }
              if (type === 'add') {
                vm._createTemplate().then(async res => {
                  if (res.code === 0) {
                    await vm._getAllTemplate()
                    await vm._getTemplateFields(vm.createdTemplateName)
                    vm.currentTemplate = vm.createdTemplateName
                    vm.selectedTemplate = vm.createdTemplateName
                    vm.$Message.success(vm.$t('fieldConfig.createSuccess'))
                  }
                })
              }
              if (type === 'saveAs') {
                vm._createTemplate().then(async res => {
                  if (res.code === 0) {
                    vm.isDefaultTemplate = false
                    await vm._getAllTemplate()
                    await vm._applyFields() // 把当前界面数据保存到新模板
                    await vm._getTemplateFields(vm.currentTemplate) // 更新界面字段
                    vm.currentTemplate = vm.createdTemplateName
                    vm.selectedTemplate = vm.createdTemplateName
                    vm.$Message.success(vm.$t('feedback.saveSuccess'))
                  }
                })
              }
              this.$parent.close();
            },
            close() {
              this.$parent.close();
            }
          }
        },
      })
    },

    // 请求新增接口
    async _createTemplate() {
      return await createTemplate({
        template_name: this.createdTemplateName,
        table_id: this._tableId
      }).then(async (res) => {
        if (res.code === 0) {
        }
        return Promise.resolve(res)
      })
    },

    // 判断数据是否修改
    isChangeData() {
      // if(this._filterCache.length !== this.filterFields.length) {
      //   return true
      // }
      // if(this._visibleCache.length !== this.visibleFields.length) {
      //   return true
      // }
      // for(var i = 0; i < this._filterCache.length;i++ ) {
      //   const cacheField = this._filterCache[i]
      //   const field = this.filterFields[i]
      //   if(cacheField.ID !== field.ID) {
      //     console.log(222,cacheField,field)
      //     return true
      //   }
      //   if(cacheField.IS_ORDER !== field.IS_ORDER) {
      //     console.log(333,cacheField,field)
      //     return true
      //   }
      // }

      // for(var i = 0; i < this._visibleCache.length;i++ ) {
      //   const cacheField = this._visibleCache[i]
      //   const field = this.visibleFields[i]
      //   if(cacheField.ID !== field.ID) {
      //     console.log(444,cacheField,field)
      //     return true
      //   }
      //   if(cacheField.IS_ORDER !== field.IS_ORDER) {
      //     console.log(555,cacheField,field)
      //     return true
      //   }
      // }
      // return false
      return JSON.stringify(this._filterCache) !== JSON.stringify(this.filterFields) || JSON.stringify(this._visibleCache) !== JSON.stringify(this.visibleFields)
    },

    // 处理字段树变化
    handleChange(e) {
      if(!e) {
        return
      }
      console.log("🚀 ~ file: index.vue ~ line 288 ~ handleChange ~ e", e)
      const isChange = this.isChangeData()
      if (this.currentTemplate !== e && isChange) {
        this.selectedTemplate = this.currentTemplate
        this.$Modal.fcWarning({
          title: this.$t('feedback.warning'),
          content: this.$t('fieldConfig.switchTemplate'),
          titleAlign: 'center',
          mask: true,
        })
      } else {
        this.currentTemplate = e
        this._getTemplateFields(e)
      }
      // console.log('之前，',this.currentTemplate, this.selectedTemplate)
      // this.currentTemplate = e
      // this._getTemplateFields(e)
    },

    // 获取未添加到配置的字段
    getDiffData(originList, targetList) {
      const diffList = []
      for (let i = 0; i < originList.length; i++) {
        const originField = originList[i]
        const index = targetList.findIndex(item => item.NAME === originField.NAME)
        if (index === -1) {
          diffList.push(originField)
        }
      }
      return targetList.concat(diffList)
    },

    // 添加字段
    handleAddField(type, data) {
      if (type === 1) {
        const diffData = this.getDiffData(data, this.visibleFields)
        this.visibleFields = this.transformToDragData(diffData)
      } else {
        const diffData = this.getDiffData(data, this.filterFields)
        this.filterFields = this.transformToDragData(diffData)
      }

      this.resetTree()
    },

    // 重置树
    resetTree() {
      const newData = this.fieldTreeData[0].children.map(item => {
        return {
          ...item,
          checked: false
        }
      })

      this.fieldTreeData = [
        {
          title: this.$t('fieldConfig.availableFields'),
          expand: true,
          children: newData
        }
      ]
    },

    // 把数据转成拖拽列表数据
    transformToDragData(data) {
      return data.map(item => {
        return {
          ...item,
          value: item.NAME
        }
      })
    },

    // 获取所有模板
    async _getAllTemplate() {
      const res = await getAllTemplate({ table_id: this._tableId })
      if (res.code === 0 && res.data && res.data.length > 0) {
        const publicRes = await getPublicTemplate({table_id: this._tableId})
        if(publicRes.code === 0) {
          this.publicTemplate = publicRes.data
        }
        console.log("🚀 ~ file: index.vue ~ line 544 ~ _getAllTemplate ~ publicRes", publicRes)
        this.templateList = res.data.map(item => {
          return {
            label: this.publicTemplate === item ? item + `(${this.$t('fieldConfig.publicTemplate')})` : item,
            value: item
          }
        })
        this.hasTemplate = true
      } else {
        this.hasTemplate = false
        this.templateList = []
        this.visibleFields = []
        this.filterFields = []
        this.currentTemplate = ''
        this.selectedTemplate = ''
      }
    },

    // 获取模板字段
    async _getTemplateFields(templateName) {
      await getTemplateFields({
        template_name: templateName,
        table_id: this._tableId
      }).then(res => {
        if (res.code === 0) {
          this.filterFields = this.transformToDragData(res.data.COLUMN_CONDITIONS)
          this.visibleFields = this.transformToDragData(res.data.COLUMN_LIST)
          this.cacheConfig()
        }
      })
    },

    // 缓存配置
    cacheConfig() {
      this._visibleCache = JSON.parse(JSON.stringify(this.visibleFields))
      this._filterCache = JSON.parse(JSON.stringify(this.filterFields))
    },

    // 获取表的所有字段
    _getAllFields() {
      getAllFields().then(res => {
        if (res.code === 0) {
          const data = res.data.map(item => {
            return {
              title: item.NAME,
              ...item,
              expand: true
            }
          })
          this.fieldTreeData = [
            {
              title: this.$t('fieldConfig.availableFields'),
              expand: true,
              children: data
            }
          ]
        }
      })
    },

    resetTemplate() {
      if(this.templateList.length > 0) {
        this.currentTemplate = this.templateList[0].value
        this.selectedTemplate = this.templateList[0].value
      }
    },

    async refresh() {
      this._getAllFields()
      this.currentTemplate && await this._getTemplateFields(this.currentTemplate)
    }
  },

  beforeCreate() {
    this.$t = i18n.t.bind(i18n)
  },

  async mounted() {
    this._visibleCache = []
    this._filterCache = []
    const tableId = this.$route.params.customizedModuleId
    this._tableId = tableId
    this._getAllFields()
    await this._getAllTemplate()
    this.resetTemplate()
    this.currentTemplate && await this._getTemplateFields(this.currentTemplate)
  }
}
</script>

<style lang="scss" scoped>
</style>