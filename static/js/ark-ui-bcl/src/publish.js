


import  DropDownSelectFilter from './components/drop-down-select-filter/DropDownSelectFilter.vue';
import  MopMultiSelect from './components/mop-multi-select/MopMultiSelect.vue';
import  DropMultiSelectFilter from './components/drop-multi-select-filter/DropMultiSelectFilter.vue';
import  Wangeditor from './components/wangeditor/Wangeditor.vue';
import  Docfile from './components/docfile/Docfile.vue';
import  ImageUpload from './components/image-upload/ImageUpload.vue';
import  PreviewPicture from './components/preview-picture/PreviewPicture.vue';
import  EnumerableInput from './components/enumerable-input/EnumerableInput.vue';
import  ExtensionProperty from './components/extension-property/ExtensionProperty.vue';
import  CommonTableByAgGrid from './components/common-table-by-ag-grid/CommonTableByAgGrid.vue';

    
const arkBclCompontent = {
    DropDownSelectFilter,
    DropMultiSelectFilter,
    MopMultiSelect,
    Wangeditor,
    Docfile,
    ImageUpload,
    PreviewPicture,
    EnumerableInput,
    ExtensionProperty,
    CommonTableByAgGrid

}
const install = function(Vue, opts = {}) {
    if (install.installed) {
        return;
        }
    //opts.defaultZindex
    Object.keys(arkBclCompontent).forEach(key => {
        Vue.component(`${arkBclConfig.componentsFix}${key}`,  arkBclCompontent[key]);
    });

    


};
const API = {
    install,
    ...arkBclCompontent
};
module.exports.default = module.exports = API;
