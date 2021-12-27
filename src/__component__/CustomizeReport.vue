<template>
  <div
    ref="reportContainer"
    class="reportContainer"
    style="width: 100%"
  >
    <div
      class="iframe-container"
      :style="{ marginTop: isCtrl ? '15px' : '5px' }"
    >
      <iframe
        :id="iframeId"
        ref="reportIFrame"
        width="100%"
        :height="iframeHeight"
        frameborder="0"
      />
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  // import DropdownSelectApi from './report/DropdownSelectApi.vue';
  // import SingleDate from './report/SingleDate.vue';
  // import RangeDate from './report/RangeDate.vue';
  // import DropdownSelect from './report/DropdownSelect.vue';
  import network, { urlSearchParams } from '../__utils__/network';


  const allowFilterRowsDefault = 3;

  const FILTER_TYPE = {
    SINGLE_DATE: 'single-date', // 单日期时间选择框
    RANG_DATE: 'range-date', // 时间范围选择框
    DROPDOWN_SELECT: 'dropdown-select', // 下拉选择框，不走api查询
    DROPDOWN_SELECT_API: 'dropdown-select-api', // 下拉选择列表，需要根据参数独立查询api
  };
  // const urlPath = '/p/cs/cxtab';
  const urlPath = '/api/rpt/cxtab'; // 自定义报表升级，地址变更。
  export default {
    data() {
      return {
        POSNAME: '', // pos端获取用户名途径
        POSID: '',
        isCtrl: true, // 默认过滤条件在FC中控制
        initialState: true,
        iframeId: `${Math.round(Math.random() * 1000000000)}-report-iframe`,
        filterText: '',
        allowFilterRows: 100,
        collapseFilter: false,
        reportUrl: '',
        queryParams: {},
        removeAllFkTable: true,
        iframeHeight: 0,
        FILTER_TYPE,
        selects: {}, // 下拉单选、多选枚举类型
        filterItems: [], // 过滤器明细
      };
    },
    computed: {
      ...mapState('global', {
        userInfo: ({ userInfo }) => userInfo,
      })
    },
    components: {
      // 'dropdown-select-api': DropdownSelectApi,
      // 'single-date': SingleDate,
      // 'range-date': RangeDate,
      // 'dropdown-select': DropdownSelect
    },
    methods: {
      // pos端获取用户信息途径
      getPostUser() {
        if (!this.userInfo.name) {
          network.get('/p/cs/hello').then((res) => {
            if (res.data.code === 0) {
              this.POSID = res.data.id;
              this.POSNAME = res.data.name;
            }
          });
        }
      },
      /**
       *当组件不是第一次activated的时候，将本组件的iframe和影子shadowFrame进行切换，以弱化iframe重新加载对用户造成的体验问题。
       */
      toggleIframe() {
        const { reportIFrame } = this.$refs;
        reportIFrame.style.opacity = '0';
        const shadowFrame = document.getElementById(`${this.iframeId}-shadow`);
        if (shadowFrame) {
          shadowFrame.style.display = '';
          shadowFrame.style.opacity = '1';
          shadowFrame.style.top = `${reportIFrame.getBoundingClientRect().top}px`;
          shadowFrame.style.left = `${reportIFrame.getBoundingClientRect().left}px`;
        }
        // 防止DOM事件阻塞，以下操作可保证当前组件的影子Frame正常显示。
        setTimeout(() => {
          shadowFrame.style.display = '';
        }, 100);
      },
      /**
       * @param iframe  需要被clone的iframe
       */
      updateShadowFrame(iframe) {
        const { reportIFrame } = this.$refs;
        if (!document.querySelector('.__shadow_iframe_container__')) {
          const c = document.createElement('div');
          c.classList.add('__shadow_iframe_container__');
          c.style.width = '0';
          c.style.height = '0';
          document.body.appendChild(c);
        }
        const shadowContainer = document.querySelector('.__shadow_iframe_container__');
        shadowContainer.style.position = 'absolute';
        shadowContainer.style.top = '0';
        shadowContainer.style.left = '0';
        document.body.style.overflow = 'hidden'; // 控制body的overflow属性，否则会影响高度计算
        const existFrame = document.getElementById(`${iframe.getAttribute('id')}-shadow`);
        if (existFrame) {
          existFrame.remove();
        }
        iframe.setAttribute('id', `${iframe.getAttribute('id')}-shadow`);
        iframe.setAttribute('src', this.reportUrl);
        iframe.setAttribute('allowfullscreen', true);
        iframe.style.zIndex = '999';
        iframe.style.position = 'absolute';
        iframe.style.width = `${reportIFrame.offsetWidth}px`;
        iframe.style.height = `${reportIFrame.offsetHeight}px`;
        // iframe.style.border = '1px solid black';
        iframe.style.display = 'none';
        shadowContainer.appendChild(iframe);
        this.fixIframeHeight(10); // 自适应
      },
      /**
       * 折叠过滤区域
       */
      doCollapse() {
        this.collapseFilter = !this.collapseFilter;
        if (this.collapseFilter) {
          this.allowFilterRows = 3; // 折叠状态下，只显示3行过滤条件
        } else {
          this.allowFilterRows = 100; // 默认显示100行过滤条件
        }
        if (this.filterItems.length >= (4 * allowFilterRowsDefault)) {
          this.fixIframeHeight(0);
        }
      }, // 折叠过滤条件区域
      /**
       * 根据objid项后台请求本报表的过滤条件列表
       */
      fetchFilter() {
        const self = this;
        const objid = this.$route.params.customizedModuleId;
        const params = new URLSearchParams();
        params.append('param', JSON.stringify({ objid }));
        network.post(`${urlPath}/queryparam`, params).then(
          (res) => {
            const { data } = res.data;
            const { selects, param, isctrl } = data;
            if (isctrl && isctrl === 'Y') {
              // 条件控制在FC中，则更新过滤条件数组
              self.isCtrl = true;
              self.selects = selects;
              self.filterItems = param;
              param.forEach((d) => {
                self.peelFilterType(d);
              });
            } else {
              // 过滤条件不在FC中控制，那么直接查询报表并予以展示。
              self.isCtrl = false;
              const shadowFrame = document.getElementById(`${this.iframeId}-shadow`);
              if (shadowFrame && shadowFrame.getAttribute('src') === '') {
                self.doQuery();
              } else {
                self.toggleIframe();
              }
            }
          },
          (err) => {
            console.error(`${this.$t('messages.filterError')}： ${err.response.data.message}`);
          }
        );
      },


      /**
       * 调整适配iframe的高度问题
       * @param delayTime  延迟时间
       */
      fixIframeHeight(delayTime) {
        const shadowFrame = document.getElementById(`${this.iframeId}-shadow`);
        const { reportIFrame } = this.$refs;
        this.iframeHeight = 0;
        setTimeout(() => {
          if (this.$refs.reportIFrame && this.$refs.reportIFrame.parentNode) {
            const boundingTop = this.$refs.reportIFrame.parentNode.getBoundingClientRect().top;
            const boundingLeft = this.$refs.reportIFrame.parentNode.getBoundingClientRect().left;
            this.iframeHeight = document.body.clientHeight - boundingTop - 5;
            if (shadowFrame) {
              // shadowFrame 重置高度和宽度
              shadowFrame.style.width = `${reportIFrame.parentNode.offsetWidth}px`;
              shadowFrame.style.height = `${this.iframeHeight}px`;
              shadowFrame.style.top = `${boundingTop}px`;
              shadowFrame.style.left = `${boundingLeft}px`;
            }
          }
        }, window.parseInt16(delayTime, 10) || 0);
      },
      /**
       * 根据className隐藏dom
       * @param className
       */
      hideDom(className) {
        document.querySelectorAll(`.${className}`).forEach((e) => {
          e.style.display = 'none';
        });
      },
      /**
       * 更新每个过滤条件对应的用户所选择的值或者默认值
       * @param colname
       * @param value
       */
      updateFilterValue(colname, value) {
        this.queryParams[colname] = value;
        const obj = {};
        Object.keys(this.queryParams).forEach((key) => {
          obj[key] = this.queryParams[key];
        });
        this.queryParams = obj;
      },
      /**
       * 根据用户对过滤条件的选择，向后台查询，并获取url和session_id
       * 添加iframe新参数userid(过滤权限)
       */
      doQuery() {
        const self = this;
        const objid = window.parseInt16(this.$route.params.customizedModuleId, 10);
        const { queryParams } = this;
        const objParams = {};
        Object.keys(queryParams).forEach((key) => {
          if (queryParams[key] && queryParams[key] !== '') {
            objParams[key] = queryParams[key];
          }
        });
        const formDataString = JSON.stringify({ objid, data: objParams });
        const config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        };
        const params = new URLSearchParams();
        params.append('param', formDataString);
        network.post(`${urlPath}/preview`, params, config).then(
          (res) => {
            const { data } = res.data;
             if(window.ProjectConfig.cbs && window.ProjectConfig.cbs.customizeReportCb){
              //  支持外部回调报表路径传参
              self.reportUrl = window.ProjectConfig.cbs.customizeReportCb(data,this.userInfo,self.POSNAME);
             }else{
              self.reportUrl = `${data.url}&session_id=${data.sessionid}&userid=${this.userInfo.name ? this.userInfo.name : self.POSNAME}`;
             }
            const shadowFrame = document.getElementById(`${this.iframeId}-shadow`);
            if (shadowFrame) {
              shadowFrame.setAttribute('src', self.reportUrl);
              shadowFrame.style.display = '';
            }
            self.$refs.reportIFrame.style.opacity = 0;
          },
          (err) => {
            console.error(`${this.$t('customizeReport.errorRequest')}： ${err.response.data.message}`);
          }
        );
      },
      /**
       * 将iframe报表区域全屏显示
       */
      reportFullScreen() {
        this.$refs.reportIFrame.webkitRequestFullScreen();
      },
      /**
       * 针对下拉列表，需要根据每个过滤条件的rp_limitvalue_group_id字段来判断呈现在首部append的内容
       * @param key
       * @returns {Array}
       */
      dealAppendInfo(key) {
        const arr = [];
        const { selects } = this;
        const tmp = [
          {
            description: this.$t('tips.all'),
            value: '-99999'
          },
        ];
        (tmp.concat(selects[key] || [])).forEach((item) => {
          const obj = {
            ECODE: { val: '' },
            ENAME: { val: '' },
            ID: { val: '' }
          };
          obj.ECODE.val = item.value;
          obj.ENAME.val = `${item.description}`;
          obj.ID.val = item.value;
          arr.push(obj);
        });
        return arr;
      },
      removeShadowFrame() {
        const shadowFrame = document.getElementById(`${this.iframeId}-shadow`);
        if (shadowFrame) {
          shadowFrame.remove();
        }
      },
      listenDomResize(dom, callback) {
        const className = '__obj_element_resize_listener_class__';
        const createObjElement = () => {
          const objElement = document.createElement('object');
          objElement.setAttribute('style', 'display: block; position: relative; top: -100000px; left: -100000px; height: 100%; width:100%; overflow: hidden;opacity: 1; pointer-events: none; z-index: -1;');
          objElement.type = 'text/html';
          objElement.data = 'about:blank';
          objElement.classList.add(className);
          if (dom) {
            dom.appendChild(objElement);
          }
          return objElement;
        };
        let objElement = null;
        if (dom) {
          objElement = dom.querySelector(`.${className}`);
        }
        if (!objElement) {
          objElement = createObjElement();
        }
        setTimeout(() => {
          if (objElement && objElement.contentDocument) {
            objElement.contentDocument.defaultView.onresize = function () {
              if (typeof callback === 'function') {
                clearTimeout(this.resizeDelay);
                this.resizeDelay = setTimeout(callback, 50);
              }
            };
          }
        }, 0);
        return objElement;
      }
    },
    beforeMount() {
      this.iframeId = `${this.$route.params.customizedModuleId}-report-iframe`;
    },
    mounted() {
      this.fetchFilter();
      const shadowFrame = document.getElementById(`${this.iframeId}-shadow`);
      if (shadowFrame) {
        this.toggleIframe();
      } else {
        this.updateShadowFrame(this.$refs.reportIFrame.cloneNode());
      }
      this.fixIframeHeight(400);
      document.onclick = () => {
        this.hideDom('__drop_down_content_wrapper__');
      };
      const iFrameDocument = this.$refs.reportIFrame.contentDocument;
      iFrameDocument.onclick = () => {
        this.hideDom('__drop_down_content_wrapper__');
      };
      this.getPostUser();
    },
    activated() {
      if (!this.initialState) {
        this.fixIframeHeight(10);
        this.toggleIframe();
        if (this.isCtrl) {
          // 只有过滤条件在FC控制时，才需要再次请求
          this.fetchFilter();
        }
      }

      // 监听reportContainer resize 事件
      this.listenDomResize(document.querySelector('#content'), () => {
        this.fixIframeHeight(100);
      });
    },
    deactivated() {
      this.initialState = false;
      const shadowFrame = document.getElementById(`${this.iframeId}-shadow`);
      if (shadowFrame) {
        shadowFrame.style.display = 'none';
      }
    },
    beforeDestroy() {
      this.removeShadowFrame();
    // document.querySelector('.__shadow_iframe_container__').childNodes.forEach(d => {
    //   d.style.display = 'none';
    // });
    }
  };
</script>
