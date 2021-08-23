


import packJson from '../package.json';
import arkBclConfig from '../config/nameConfig.js';
import  arkDropDownSelectFilter from './components/drop-down-select-filter/index.js';
import  arkMopMultiSelect from './components/mop-multi-select/index.js';
import  arkDropMultiSelectFilter from './components/drop-multi-select-filter/index.js';
import  arkWangeditor from './components/wangeditor/index.js';
import  arkDocfile from './components/docfile/index.js';
import  arkImageUpload from './components/image-upload/index.js';
import  arkPreviewPicture from './components/preview-picture/index.js';
import  arkEnumerableInput from './components/enumerable-input/index.js';
import  arkExtensionProperty from './components/extension-property/index.js';
import  arkCommonTableByAgGrid from './components/common-table-by-ag-grid/index.js';


const arkBclCompontent = {
    arkDropDownSelectFilter,
    arkDropMultiSelectFilter,
    arkMopMultiSelect,
    arkWangeditor,
    arkDocfile,
    arkImageUpload,
    arkPreviewPicture,
    arkEnumerableInput,
    arkExtensionProperty,
    arkCommonTableByAgGrid

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
export default {
    name:'ark-bcl',
    version: packJson.version,
    install,
    ...arkBclCompontent
}
