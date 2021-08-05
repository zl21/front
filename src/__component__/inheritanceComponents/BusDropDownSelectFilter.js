/* eslint-disable func-names */
/* eslint-disable no-prototype-builtins */

/**
 * AttachFilter组件自定义
 */


import { defaultrange } from '../../constants/global';
import { DropDownSelectFilter } from '@syman/ark-ui-bcl';
import DropMethods from '../ExtendedMethods/DropMethods';
import network from '../../__utils__/network';
import { SetPlaceholder } from './setProps';

import {
  setisShowPopTip,
  postData,
  postTableData
} from '../ExtendedAttributes/refcolval.js'

class BusDropDownSelectFilter {
  constructor(item) {
    this.item = item;
    this.Vm = Object.create(DropDownSelectFilter);
    this.mergeProps();
    this.mergeMethods();
  }

  init() {
    return {
      Components: this.Vm,
      props: this.props
    };
  }

  // 合并props
  mergeProps() {

    if (this.item.fkobj && this.item.fkobj.serviceId) {
      // 字段的网关
      this.item.serviceId = this.item.fkobj.serviceId;
    }
    if (this.item.detailType) {
      // 走关联字段查询
      this.item.Query = true;
    } else {
      this.item.Query = false;
    }
    this.propstype = {
      ...this.item,
      item: this.item,
      disabled: this.item.readonly && (this.item.webconf ? !this.item.webconf.ignoreDisableWhenEdit : true),
      hidecolumns: ['id', 'value'],
      enterType: this.item.detailType,
      singleTurn: true,
      blurType: this.item.detailType,
      placeholder: new SetPlaceholder(this.item).init()
    };

    this.props = {
      PropsData: { ...this.propstype },
      Url: {
        autoUrl: `/p/cs/fuzzyquerybyak`,
        tableUrl: `/p/cs/QueryList`
      },
      AutoRequest: {
        colid: this.item.colid,
        fixedcolumns: {}
      },
      TableRequest: {
        isdroplistsearch: true,
        refcolid: this.item.colid,
      },
      EventFun: {
        'on-Outside': ($this) => {
          let value = $this.$parent.value;
          setTimeout(() => {
            if (!Array.isArray(value)) {
              let icon = $this.$el.querySelector('.iconios-close-circle');
              if (icon) {
                icon.click();
              }
            } else {
              $this.$parent.$parent.value = '';
            }
          }, 100);


        }

      },
      http: network
    }
    return
  }

  // 合并methods
  mergeMethods() {
    this.Vm.created = function () {
      this.item = this.PropsData.item;
      this.item.Query = this.PropsData.Query;
      this.activeTab = this.$parent.$parent.activeTab;
      this.PropsData.isShowPopTip = () => {
        if (this.item.refcolval) {
          if (!this.item.webconf) {
            this.item.webconf = {}
          }
          this.item.webconf.refcolval = this.item.refcolval
        }
        return setisShowPopTip(this, this.item.webconf, network)
      }
      if (defaultrange()) {
        this.pageSize = defaultrange();
      }
      this.postTableData = function (url) {
        // 字段联动 表格数据查询
        return new Promise((resolve) => {
          postTableData.call(this, this, url).then((res) => {
            resolve(res)
          });
        })

      };
      this.postData = function (url) {
        // 字段联动 模糊查询数据
        return new Promise((resolve) => {
          postData.call(this, this, url).then((res) => {
            resolve(res)
          });
        })
      };
      if (this.item.detailType) {
        // 外部点击

        //new DropMethods(this.item,this).Outside();
      }

    }

    if (!this.item.detailType) {
      // 回车查询
      new DropMethods(this.item, this.Vm).keydown();
    }





  }


}

export default BusDropDownSelectFilter;
