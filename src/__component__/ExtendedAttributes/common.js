// 过滤value
export const filterVal = function ($this) {
    if (Array.isArray($this.value)) {
        if ($this.value[0] && $this.value[0].ID) {
            return $this.value[0].ID;
        } else {
            return $this.value[0]
        }
    }
    return $this.value;
}
// 查找实例
export const FindVm = ($this,name) => {
    let panelForm = $this.$_live_getChildComponent(window.vm, 'panelForm');
    // 获取来源值的实例
    let target = $this.$_live_getChildComponent(panelForm, name);
    return target;
}

// 清除字段
export const ClearRefcolValue = ($this,name) => {
    if (Array.isArray(name)) {
        name.forEach((x) => {
            let $vm = FindVm($this,x);
            $vm.value = [];
        })
    } else {
        let $vm = FindVm($this,name);
        $vm.value = [];
    }
}