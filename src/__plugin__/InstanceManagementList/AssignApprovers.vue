// 指派下一节点审批人
<template>
  <div class="AssignApprovers">
    指派下一节点审批人
  </div>
</template>
<script>
  export default {
    name: 'AssignApprovers',
    data() {
      return {
        columns: [
          {
            title: '序号',
            render: (h, params) => h('span', {}, params.index + 1)
          },
          {
            title: '节点名称',
            key: 'name',
            render: (h, params) => h('Checkbox', {
              props: {
                value: params.row.checked,
                disabled: params.row.inevitable === 0
              },
              on: {
                'on-change': (value) => {
                  this.data[params.index].checked = value;
                }
              }
            }, `${params.row.name}${params.row.inevitable === 0 ? '(必经节点)' : ''}`)
          },
          {
            title: '审批人',
            key: 'isnotnull',
            render: (h, params) => h('DropMultiSelectFilter', {
              props: {
                // value: params.row.isnotnull
              },
              on: {
                'on-change': (value) => {
                  // this.configData.modifiableField[params.index].isnotnull = value;
                }
              }
            })
          }
        ],
        data:
          [
            {
              inevitable: 0, // 必经节点
              checked: true,
              name: '审批节点', // 节点名称
              assignArree: 0, // 是否动态指派审批人
              approvelList: [
                {// 审批人信息数组
                  id: 1, // 新增不传，修改传
                  approveType: 0, // 0：自动-发起人部门,1：自动-上一节点审批人部门,2：手动选择部门,3：手动选择角色,4：手动选择人
                  approveValue: '10229', // 审批人id
                  approveValueName: '胡晋'// 审批人的中文名
                }
              ], // 审批人信息
            },
            {
              inevitable: 1, // 必经节点
              checked: false,
              name: '审批节点', // 节点名称
              assignArree: 0, // 是否动态指派审批人
              approvelList: [
                {// 审批人信息数组
                  id: 1, // 新增不传，修改传
                  approveType: 0, // 0：自动-发起人部门,1：自动-上一节点审批人部门,2：手动选择部门,3：手动选择角色,4：手动选择人
                  approveValue: '10229', // 审批人id
                  approveValueName: '胡晋'// 审批人的中文名
                }
              ], // 审批人信息
            }
          ]
      };
    }
  };
</script>
<style lang="less" scoped>
.AssignApprovers{
  
}
</style>
