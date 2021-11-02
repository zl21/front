<template>
  <div :class="classes">
    <div :class="classGroup">
      <!-- //查找 -->
      <!-- <Poptip
        trigger="hover"
        content="content"
        placement="bottom-start"
      > -->
      <Button
        v-if="dataArray.search"
        type="posdefault"
        @click="btnclick('search')"
        v-text="search"
      />
      <!-- </Poptip> -->

      <Button
        v-show="dataArray.reset"
        id="reset"
        type="fcdefault"
        @click="btnclick('reset')"
        v-text="reset"
      />
      <Button
        v-for="(item, index) in dataArray.buttonGroupShowConfig.buttonGroupShow"
        :id="item.eName"
        :key="item.eName"
        :ref="item.ref"
        type="fcdefault"
        @click="btnclick('fix', item,index)"
        v-text="item.name"
      />

      <!-- 定制按钮 -->
      <template v-for="item in dataArray.waListButtonsConfig.waListButtons">
        <template v-if="item.confirm && item.confirm.includes('supPrompt')">
          <Poptip
            trigger="hover"
            transfer
            :key="item.webid"
            word-wrap
            width="200"
            :content="JSON.parse(item.confirm).supPrompt">
            <Button
              :id="item.eName"
              :ref="item.ref"
              :disabled="item.disabled"
              type="fcdefault"
              @click="btnclick('custom', item)"
              v-text="item.webdesc">
            </Button>
          </Poptip>
        </template>
        <Button
          v-else
          :id="item.eName"
          :key="item.webid"
          :ref="item.ref"
          :disabled="item.disabled"
          type="fcdefault"
          @click="btnclick('custom', item)"
          v-text="item.webdesc"
          >
        </Button>
      </template>

      <Dropdown
        v-for="(group,i) in dataArray.waListButtonsConfig.waListButtonsGroup"
        :key="group.webid"
        trigger="click"
        placement="bottom-start"
        split-button
        type="primary"
        @on-click="choseWaListButton"
      >
        <!-- 按钮有气泡提示 -->
        <template v-if="group.confirm && group.confirm.includes('supPrompt')">
          <Poptip
            trigger="hover"
            transfer
            :key="group.webid"
            word-wrap
            width="200"
            :content="JSON.parse(group.confirm).supPrompt">
            <Button
              type="fcdefault"
            >
              {{ group.webdesc }}
              <Icon type="ios-arrow-down" />
            </Button>
          </Poptip>
        </template>
        <template v-else>
          <Button
            type="fcdefault"
          >
            {{ group.webdesc }}
            <Icon type="ios-arrow-down" />
          </Button>
        </template>

        <DropdownMenu slot="list" class="btn-menu">
          <!-- 按钮菜单有气泡提示 -->
          <template v-for="(item,index) in group.childrens ">
            <Poptip
                v-if="item.confirm && item.confirm.includes('supPrompt')"
                trigger="hover"
                transfer
                :key="item.webid"
                word-wrap
                placement="right"
                width="200"
                :content="JSON.parse(item.confirm).supPrompt">
                <DropdownItem
                  :key="item.webid"
                  :name="item"
                  :disabled="item.disabled"
                >
                  {{ item.webdesc }}
                </DropdownItem>
            </Poptip>
            <DropdownItem
              v-else
              :key="item.webid"
              :name="item"
              :disabled="item.disabled"
            >
              {{ item.webdesc }}
            </DropdownItem>
          </template>
        </DropdownMenu>
      </Dropdown>

      <!-- jflow配置按钮-->
      <Button
        v-for="(item) in dataArray.jflowButton"
        :key="item.button"
        :ref="item"
        type="fcdefault"
        @click="btnclick('extraposition', item)"
        v-text="item.name"
      />


      <Dropdown
        v-if="dataArray.printValue"
        id="print"
        trigger="click"
        placement="bottom-start"
        split-button
        type="primary"
        @on-click="print"
      >
        <Button type="fcdefault">
          {{$t('buttons.print')}}
          <Icon type="ios-arrow-down" />
        </Button>
        <DropdownMenu slot="list">
          <DropdownItem
            v-for="(item,index) of printList"
            :key="item.webid"
            :name="item.webid"
          >
            {{ item.webdesc }}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Button
        v-if="dataArray.actionCollection && !layoutDirection"
        type="fcdefault"
        class="collection"
        @click="btnclick('Collection')"
      >
        <span>
          <i
            v-if="!dataArray.collectiImg"
            class="iconfont iconbj_col"
          />
          <i
            v-else
            class="iconfont iconbj_alrcol"
          />
        </span>
      </Button>
      <Button
        v-show="dataArray.refresh"
        id="refresh"
        type="fcdefault"
        @click="btnclick('refresh')"
        v-text="refresh"
      />

      <Button
        v-if="dataArray.temporaryStorage"
        id="temporaryStorage"
        type="fcdefault"
        @click="btnclick('temporaryStorage')"
        v-text="temporaryStorage"
      />
      <Button
        v-if="dataArray.back"
        id="back"
        type="fcdefault"
        @click="btnclick('back')"
        v-text="back"
      />

      <Dialog
        ref="dialogRef"
        :id-array="idArray"
        :title="dialogConfig.title"
        :mask="dialogConfig.mask"
        :content-text="dialogConfig.contentText"
        :footer-hide="dialogConfig.footerHide"
        :confirm="dialogConfig.confirm"
        :item-id="itemId"
        :closable="true"
        :dialog-component-name="dialogComponentName"
        @clearDialogComponentName="clearDialogComponentName"
        @clearSelectIdArray="clearSelectIdArray"
      />
    </div>
  </div>
</template>
<script>

  import { mapState } from 'vuex';
  import Dialog from './Dialog.vue';
  import network from '../__utils__/network';
  import { MODULE_COMPONENT_NAME, INSTANCE_ROUTE_QUERY,layoutDirection, enableHistoryAndFavoriteUI, classFix } from '../constants/global';


  export default {
    name: 'ButtonList',
    inject: [MODULE_COMPONENT_NAME, INSTANCE_ROUTE_QUERY],
    props: {
      // waListButtonsGroup: {
      //   type: Array,
      //   default: () => ([])
      // },
      dataArray: {
        type: Object,
        default: () => ({})
      },
      searchDatas: {// 列表界面筛选值
        type: Object,
        default: () => ({})
      },
      idArray: {
        type: [Array, Object],
        default: () => ({})
      },
      itemId: {// 获取当前子表明细ID
        type: String,
        default: () => ''
      },
    },
    components: {
      Dialog
    },
    beforeDestroy() {
      window.removeEventListener('childTableSaveFile', this.childTableClickSaveFile);
    },
    mounted() {
      if (!this._inactive) {
        window.addEventListener('childTableSaveFile', this.childTableClickSaveFile);
      }
    },
    data() {
      return {
        model4: '',
        dialogComponentName: null,
        dialogConfig: {
          title: this.$t('feedback.alert'),
          mask: true,
          footerHide: false,
          contentText: '',
          confirm: () => {
          }
        }, // 弹框配置信息
        search: this.$t('buttons.search'),
        refresh: this.$t('buttons.refresh'),
        back: this.$t('buttons.back'),
        temporaryStorage: this.$t('buttons.temporaryStorage'),
        reset: this.$t('buttons.reset'),
        errorDialog: false, // 消息弹框
        dialogVisible: false, // 消息提示框
        dialogMessage: '', // 消息提示框显示数据
        layoutDirection: !enableHistoryAndFavoriteUI(), // 如果为true 收藏按钮不显示
        dataConShow: {
          dataConShow: false,
          title: '',
          tabConfig: {},
          fixedcolumns: {},
          reffixedcolumns: {}
        },
        objTableUrl: '', // 判断双击跳转是否是单对象
        errorData: [], // 弹框内容
        printList: [
          // 打印列表
          {
            vuedisplay: 'dialog',
            actiontype: 'url',
            isrefrsh: false,
            webid: 2527,
            webdesc: this.$t('messages.PrintImmediately'),
            webname: 'OutPrint',
            webicon: null,
            action: 'custompage/redirect?print',
            cuscomponent: null,
            ishide: false,
          },
          {
            vuedisplay: 'dialog',
            confirm: `{"isselect":true,"nodesc":"${this.$t('messages.PrintPreviewTip')}"}`,
            actiontype: 'url',
            isrefrsh: false,
            webid: 2530,
            webdesc: this.$t('messages.PrintPreview'),
            webname: 'OutPreview',
            webicon: null,
            action: 'custompage/redirect?preview',
            cuscomponent: 'printPreview',
            ishide: false
          },
          {
            vuedisplay: 'dialog',
            confirm: null,
            actiontype: 'url',
            isrefrsh: false,
            webid: 2533,
            webdesc: this.$t('messages.setTemplate'),
            webname: 'OutSetTemplate',
            webicon: null,
            action: 'custompage/Konad',
            cuscomponent: 'printTemplate',
            ishide: false
          }
        ], // 打印选择列表
        searchData: {
          table: this.$route.params.tableName,
          startIndex: 0,
          range: 10
        },
      };
    },
    computed: {
      ...mapState('global', {
        userInfo: ({ userInfo }) => userInfo,
      }),
      classes() {
        return [
          `${classFix}R3-buttonList`,
        ];
      },
      classGroup () {
        return [
          `${classFix}R3-button-group`,
        ];
      },
    },
    methods: {
      choseWaListButton(data) {
        if(!data.disabled){
          // 激活状态下
          this.btnclick('custom', data);
        }
      },
      childTableClickSaveFile() { // 手动触发保存
        const dom = document.getElementById('actionMODIFY');
        dom.click();
      },
      // dialogComponentSaveSuccess() { // 自定义弹框执行确定按钮操作  暂时不需要保存并打印
      //   setTimeout(() => {
      //     this.print(2530);
      //   }, 1000);
      // },
      clearSelectIdArray() { // 用于关闭打印相关弹框清空标准列表界面选中项
        this.$emit('clearSelectIdArray');
      },
      clearDialogComponentName() {
        this.dialogComponentName = null;
        //  this.$emit('buttonClick', type, item);
      },
      print(id) {
        const { itemId, tableName } = this.$route.params;
        const iFrame = document.getElementById('iframe');
        if (iFrame) {
          document.body.removeChild(iFrame);
        }
        let tab = {};
        let printContent = {};
        this.printList.forEach((item) => {
          if (item.webid === id) {
            tab = item;
          } else if (item.webid === 2530) {
            printContent = item;
          }
        });
        let printIdArray = [] || '';
        if (this[MODULE_COMPONENT_NAME][0] === 'S') { // 只有列表界面需要勾选明细
          printIdArray = this.idArray;
          if (printIdArray.length === 0 && id === 2530) { // 没有勾选且为打印预览
            const data = {
              mask: true,
              title: this.$t('feedback.warning'),
              content: this.$t('messages.PrintPreviewTip')
            };
            this.$Modal.fcWarning(data);
            return;
          } if (printIdArray.length === 0 && id === 2527) { // 直接打印
            const data = {
              mask: true,
              title: this.$t('feedback.warning'),
              content: this.$t('messages.PrintImmediatelyTip')
            };
            this.$Modal.fcWarning(data);
            return;
          }
        } else {
          printIdArray = itemId;
        }

        if (id === 2527 || id === 2530) { // 直接打印
          let src = '';
          this.$R3loading.show(this.loadingName);
          let api = '';
          if (printIdArray.length === 0) { // 直接打印 新增需求，如列表界面不勾选则传参加上筛选值
            api = `/api/rpt/preview?tableName=${this.$route.params.tableName}&objIds=${printIdArray}&userId=${this.userInfo.id}&searchData=${JSON.stringify(this.searchDatas)}`;
          } else {
            api = `/api/rpt/preview?tableName=${this.$route.params.tableName}&objIds=${printIdArray}&userId=${this.userInfo.id}`;
          }

          network.get(api).then((res) => {
            if (res.status === 200) {
              if (this[MODULE_COMPONENT_NAME][0] === 'S') {
                if (id === 2530) {
                  this.$R3loading.hide(this.loadingName);
                  this.objTabActionDialog(tab);
                } else {
                  src = `/api/rpt/preview?tableName=${this.$route.params.tableName}&objIds=${this.idArray}&userId=${this.userInfo.id}`;
                  this.setIframeForPrint(src);
                }
              } else {
                const printId = this.itemId;
                if (id === 2530) {
                  this.$R3loading.hide(this.loadingName);
                  this.objTabActionDialog(tab);
                } else {
                  src = `/api/rpt/preview?tableName=${this.$route.params.tableName}&objIds=${printId}&userId=${this.userInfo.id}`;
                  this.setIframeForPrint(src);
                }
              }
            } else {
              this.$R3loading.hide(this.loadingName);
            }
          }).catch(() => {
            this.$R3loading.hide(this.loadingName);
          });
        } else {
          this.objTabActionDialog(tab);
        }
      },
      setIframeForPrint(printSrc) {
        const { tableName } = this.$route.params;
        const getElement = document.getElementById('iFrame');
        if (getElement) {
          document.body.removeChild(getElement);
        }
        const iFrame = document.createElement('iframe');
        iFrame.src = printSrc;
        iFrame.id = 'iFrame';
        iFrame.style.display = 'none';
        document.body.appendChild(iFrame);
        document.getElementById('iFrame').focus();
        document.getElementById('iFrame').contentWindow.print();
        this.clearSelectIdArray();
        const dom = document.getElementById('iFrame');
        if (dom.attachEvent) {
          dom.attachEvent('onload', () => { // IE
            this.$R3loading.hide(this.loadingName);
          });
        } else {
          dom.onload = () => { // 非IE
            this.$R3loading.hide(this.loadingName);
          };
        }
        // 兼容pos 打印预览
        setTimeout(() => {
        if (!dom.contentWindow.document.body.innerHTML && this.getChromeVersion()<70) {
          this.$R3loading.hide(this.loadingName);
          let newPrint = window.open(printSrc);
              newPrint.onload = () => {
                 newPrint.print();
                  if (newPrint.matchMedia) {   //返回一个新的 MediaQueryList 对象，表示指定的媒体查询字符串解析后的结果。
                   var script = newPrint.document.createElement("script");
                    script.type = "text/javascript";
                    script.appendChild(document.createTextNode(`
                      let mediaList =  window.matchMedia('print');
                      mediaList.addListener(function(){
                        window.close();
                        console.log('打印测试====window');
                      }) 
                    `));
                    newPrint.document.body.appendChild(script);
                  }
              }
        } 
        }, 1000)
      },
      getChromeVersion() {
            var arr = navigator.userAgent.split(' ');
            var chromeVersion = '';
            for(var i=0;i < arr.length;i++){
                if(/chrome/i.test(arr[i]))
                chromeVersion = arr[i]
            }
            if(chromeVersion){
                return Number(chromeVersion.split('/')[1].split('.')[0]);
            } else {
                return false;
            }
      },
      objTabActionDialog(tab) { // 动作定义弹出框
        this.$refs.dialogRef.open();
        const title = tab.webdesc;
        this.dialogConfig = {
          title,
        };
        this.dialogConfig.footerHide = true;
        // Vue.component(filePath, CustomizeModule[filePath].component);
        this.dialogComponentName = tab.cuscomponent;

        // }
      },
      btnclick(type, item) {
        this.$emit('buttonClick', type, item);
      },

    },
    created() {
      this.loadingName = this.$route.meta.moduleName.replace(/\./g, '-');
      // this[MODULE_COMPONENT_NAME] = getComponentName();
    },

  };
</script>
