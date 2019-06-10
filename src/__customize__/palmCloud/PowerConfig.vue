<template>
  <div class="powerConfigContainer">
    <div class="buttonGroup">
      <Button
        type="fcdefault"
        class="saveButton"
        @click="saveClick"
      >
        保存
      </Button>
      <Button
        type="fcdefault"
        class="refreshButton"
        @click="refreshClick"
      >
        刷新
      </Button>
    </div>
    <div class="content">
      <div class="menuContainer">
        <div class="menuList">
          <Menu
            v-if="menuShow"
            width="238"
            class="menu"
            :open-names="getOpenNames"
            :active-name="activeName"
          >
            <Submenu
              v-for="(item,index) in menuLists"
              :key="index"
              :name="index"
              :arrowdown="item.childs && item.childs.length > 0"
              class="submenu"
            >
              <template slot="title">
                {{ item.name }}
              </template>
              <MenuItem
                v-for="(temp,j) in item.childs"
                :key="j"
                :name="`${index}-${j}`"
                @click.native="menuItemClick(temp)"
              >
                {{ temp.name }}
              </MenuItem>
            </Submenu>
          </Menu>
        </div>
      </div>
      <div class="treeContainer">
        <div class="inputClass">
          <Input
            v-model="inputValue"
            clearable
            placeholder="请输入用户名"
            @on-change="inputChange"
            @on-enter="inputEnter"
            @on-clear="inputClear"
          />
          <span slot="prepend">检索</span>
          <!--<Icon type="ios-search"></Icon>-->
          <Button
            slot="append"
            class="inputSearchButton"
            icon="ios-search"
            @click="inputSearch"
          />
          </Input>
        </div>
        <div
          v-if="treeShow"
          class="tree"
        >
          <Tree
            ref="tree"
            :data="treeData"
            :query="treeQueryText"
            :query-style="queryStyle"
            show-checkbox
            @on-check-change="treeCheckChange"
          />
        </div>
      </div>
    </div>
    <Spin
      v-show="spinShow"
      fix
    >
      <Icon
        type="ios-loading"
        size="48"
        class="demo-spin-icon-load" 
      />
      <div>Loading</div>
    </Spin>
  </div>
</template>

<script>
  /* eslint-disable no-return-assign */

  import network, { urlSearchParams } from '../../__utils__/network';

  export default {
    data() {
      return {
        activeName: '0-0',
        inputValue: '', // 输入框绑定的值
        treeShow: true, // 是否显示树
        menuModuleId: '', // 当前菜单的下标
        addData: [], // 保存添加的节点
        delData: [], // 保存删除的节点
        modifyData: {}, // 保存修改的数据
        treeQueryText: '', // 模糊搜索的文字
        spinShow: false, // loading 是否显示
        menuShow: false, // 菜单是否显示
        queryStyle: {
          color: '#108EE9'
        },
        saveData: {
          app_type: '',
          corp_table_id: '',
          corp_id: '',
          data: {}
        },
        copyOrgTree: {}, // 原始树数据
        menuLists: [], // 左边菜单数据
        treeData: [], // 树数据
        userPermission: {}, // 权限数据
        userIdIndex: {}, // 人的路径
        dataTree: []
      };
    },
    components: {},
    watch: {},
    computed: {
      getOpenNames() {
        if (this.menuLists.length > 0) {
          return this.menuLists.reduce((acc, cur, idx) => {
            acc.push(idx);
            return acc;
          }, []);
        }
        return [];
      }
    },
    created() {
      this.getTreeAndMenuData();
    },
    mounted() {
    },
    methods: {
      getTreeAndMenuData() {
        this.spinShow = true;
        this.treeData = [];
        this.menuShow = false;
        network.post('/mboscloud-app/p/cs/mbos/corp_org_tree_ctrl/permission_query', urlSearchParams({})).then((res) => {
          this.spinShow = false;
          if (res.data.code === 0) {
            this.copyOrgTree = JSON.parse(JSON.stringify(res.data.data.copyOrgTree));
            this.saveData.app_type = res.data.data.copyOrgTree.app_type;
            this.saveData.corp_table_id = res.data.data.copyOrgTree.id;
            this.saveData.corp_id = res.data.data.copyOrgTree.copy_id;
            this.menuShow = true;
            this.menuLists = res.data.data.menuLists;
            this.menuModuleId = res.data.data.menuLists[0].childs[0].id;
            this.treeData.push(res.data.data.copyOrgTree);
            this.userPermission = res.data.data.userPermission;
            this.userIdIndex = res.data.data.userIdIndex;
            this.treeDefaultSelected({ id: res.data.data.menuLists[0].childs[0].id });
            this.modifyData = {};
            this.addData = [];
            this.delData = [];
            this.saveModifyData();
          }
        }).catch(() => {
          this.spinShow = false;
        });
      }, // 查询树和菜单数据
      saveClick() {
        this.spinShow = true;
        this.saveData.data = this.modifyData;
        network.post('/mboscloud-app/p/cs/mbos/user_view_config_ctrl/permission_save', this.saveData).then((res) => {
          this.spinShow = false;
          if (res.data.code === 0) {
            this.$Message.success({
              content: '保存成功'
            });
            this.modifyData = {};
            this.addData = [];
            this.delData = [];
            this.saveModifyData();
          }
        }).catch(() => {
          this.spinShow = false;
        });
      }, // 保存按钮
      refreshClick() {
        const addArr = this.modifyData[this.menuModuleId].add;
        const delArr = this.modifyData[this.menuModuleId].del;
        if ((addArr && addArr.length > 0) || (delArr && delArr.length > 0)) {
          this.$Modal.fcWarning({
            title: '提示',
            mask: true,
            showCancel: true,
            content: '是否保存修改的数据！',
            onOk: () => {
              this.saveClick();
            },
            onCancel: () => {
              this.getTreeAndMenuData();
            }
          });
        } else {
          this.getTreeAndMenuData();
        }
      },
      menuItemClick(temp) {
        this.treeShow = false;
        setTimeout(() => {
          this.treeShow = true;
          this.menuModuleId = temp.id;
          this.addData = [];
          this.delData = [];
          this.treeData = [];
          const data = JSON.parse(JSON.stringify(this.copyOrgTree));
          this.treeData.push(data);
          if (this.modifyData[this.menuModuleId]) {
            this.addData = this.addData.concat(this.modifyData[this.menuModuleId].add);
            this.delData = this.delData.concat(this.modifyData[this.menuModuleId].del);
          }
          this.treeDefaultSelected(temp);
        }, 100);
      }, // 点击左边的菜单触发
      treeDefaultSelected(temp) {
        this.saveModifyData();
        this.userPermission[temp.id].forEach((item) => {
          if (this.userIdIndex[item] && this.userIdIndex[item].length > 0) {
            if (this.userIdIndex[item].indexOf('|') > -1) {
              const userTowIdArr = this.userIdIndex[item].split('|');
              userTowIdArr.forEach((items) => {
                const indexId = items.substr(0, items.length - 1);
                const indexArr = indexId.split(',');
                let obj = this.treeData[0];
                indexArr.forEach((ite) => {
                  obj = obj.children[ite];
                });
                obj.checked = true;
              });
            } else {
              const indexId = this.userIdIndex[item].substr(0, this.userIdIndex[item].length - 1);
              const indexArr = indexId.split(',');
              let obj = this.treeData[0];
              indexArr.forEach((ite) => {
                obj = obj.children[ite];
              });
              obj.checked = true;
            }
          }
        });
      }, // 树默认选中的方法
      inputSearch() {
        this.treeQueryText = this.inputValue;
        this.getSearchTreeData();
      }, // 搜索icon
      inputEnter() {
        this.getSearchTreeData();
      }, // 输入框回车
      inputClear() {
        this.treeQueryText = this.inputValue;
      }, // 输入框清空
      inputChange() {
        this.treeQueryText = this.inputValue;
      }, // 输入框值改变时触发
      getSearchTreeData() {
        if (this.inputValue === '') {
          network.post('/mboscloud-app/p/cs/mbos/corp_org_tree_ctrl/permission_query', urlSearchParams({})).then((res) => {
            if (res.data.code === 0) {
              this.treeData = [];
              this.treeData.push(res.data.data.copyOrgTree);
              this.treeDefaultSelected({ id: this.menuModuleId });
            }
          });
        } else {
          network.post('/mboscloud-app/p/cs/mbos/corp_org_tree_ctrl/user_dept_query', {
            deptName: this.inputValue
          }).then((res) => {
            // console.log(res);
            if (res.data.code === 0) {
              this.treeData = [];
              this.treeData = res.data.data.byNameArray;
              this.searchTreeSelected();
            }
          });
        }
      }, // 模糊搜索查询数据
      searchTreeSelected() {
        if (this.treeData.length > 0) {
          this.treeData.map((item) => {
            if (item.children && item.children.length > 0) {
              item.children.map((ite) => {
                const findIndex = this.userPermission[this.menuModuleId].findIndex(item => item === ite.id);
                if (findIndex > -1) {
                  ite.checked = true;
                }
              });
            } else {
              item.checked = false;
            }
          });
        }
      },
      treeCheckChange(arr, obj) {
        if (obj.checked) {
          this.getAddData(obj);
        } else {
          this.getDeleteData(obj);
        }
        this.saveModifyData();
      }, // 点击tree上的checkbox触发
      getAddData(data) {
        if (data.children && data.children.length > 0) {
          data.children.forEach((item) => {
            this.getAddData(item);
          });
        } else if (data.children && data.children.length === 0) {
          
        } else {
          const findDelIndex = this.delData.findIndex(item => item === data.id);
          if (findDelIndex > -1) {
            this.delData.splice(findDelIndex, 1);
          } else {
            const findIndex = this.userPermission[this.menuModuleId].findIndex(item => item === data.id); // 权限里边有没有这个id
            if (findIndex === -1) {
              this.addData.push({
                user_id: data.user_id,
                user_table_id: data.id,
                user_name: data.title
              });
            }
          }
          this.userPermission[this.menuModuleId].push(data.id);
        }
      }, // 获取新添加的节点
      getDeleteData(data) {
        if (data.children && data.children.length > 0) {
          data.children.forEach((item) => {
            this.getDeleteData(item);
          });
        } else {
          const findIndex = this.addData.findIndex(item => item.user_table_id === data.id);
          const findUserPermissionIndex = this.userPermission[this.menuModuleId].findIndex(item => item === data.id);
          if (findIndex === -1 && data.id && findUserPermissionIndex !== -1) {
            this.delData.push(data.id);
          } else {
            this.addData.splice(findIndex, 1);
          }
          if (findUserPermissionIndex > -1) {
            this.userPermission[this.menuModuleId].splice(findUserPermissionIndex, 1);
          }
        }
      }, // 获取删除的节点
      saveModifyData() {
        this.modifyData = Object.assign(this.modifyData, { [this.menuModuleId]: { add: this.addData, del: this.delData } });
      }, // 保存修改的数据
    }
  };
</script>

<style lang="less">
  .burgeon-spin-fix{
    .demo-spin-icon-load{
      animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
      from { transform: rotate(0deg);}
      50%  { transform: rotate(180deg);}
      to   { transform: rotate(360deg);}
    }
  }
  .powerConfigContainer {
    position: relative;
    height: 100%;
    padding: 10px 0;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    .buttonGroup {
      display: flex;
      .saveButton {
        padding: 6px 8px;
        border-radius:2px;
        font-size:12px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        box-sizing: border-box;
      }
      .refreshButton {
        margin-left: 10px;
        padding: 6px 8px;
        border-radius:2px;
        font-size:12px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        box-sizing: border-box;
      }
    }
    .content {
      flex: 1;
      margin-top: 10px;
      display: flex;
      overflow-y: hidden;
      .menuContainer {
        width: 260px;
        margin-right: 10px;
        border-radius: 6px;
        border: 1px solid rgba(180, 180, 180, 1);
        .menuList {
          height: 100%;
          padding: 10px;
          box-sizing: border-box;
          .menu {
            height: 100%;
            z-index: 1;
            border: 1px solid rgba(220, 222, 226, 1);
            border-right: 0;
            overflow-y: auto;
            .submenu {
              .burgeon-menu-submenu-title {
                padding: 10px 24px;
              }
              .burgeon-menu-item {
                padding: 10px 24px;
              }
            }
          }
        }
      }
      .treeContainer {
        flex: 1;
        border-radius: 6px;
        border: 1px solid rgba(180, 180, 180, 1);
        display: flex;
        flex-direction: column;
        .inputClass {
          width: 240px;
          padding: 10px;
          .burgeon-input-group .burgeon-input {
            box-sizing: border-box;
          }
          .inputSearchButton {
            width: 1px;
            padding-top: 8px;
            display: flex;
            justify-content: center;
          }
        }
        .tree {
          height: 100%;
          overflow-y: auto;
          padding-left: 10px;
          margin-bottom: 10px;
        }
      }
    }
  }
</style>
