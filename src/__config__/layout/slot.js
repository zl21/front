/**
 * name  类型 (是否是名称)
 * type  类型
 */
class SetLayoutDirectionSlot {
    constructor($vm, name, type) {
        // this.$vm = $vm;
        let {
            layoutDirectionSlot
        } = window.ProjectConfig;
        if (layoutDirectionSlot[name]) {
            // 针对当前表明
            if (layoutDirectionSlot[name].tableName) {
                let {
                    tableName
                } = $vm.$route.params;
                // 当前表明    
                let tableNameList = layoutDirectionSlot[name].tableName[tableName];
                if (tableNameList[type]) {
                    this.vm = tableNameList.CollapseComponent;
                }
            } else {
                // 针对全表
                if (layoutDirectionSlot[name][type]) {
                    this.vm = layoutDirectionSlot[name][type];
                }
            }
        }

    }
    init() {
        return this.vm
    }


}

export {
    SetLayoutDirectionSlot
}