import Picker from './base/picker.vue';
import TimePickerPanel from './base/panel.vue';
import { findComponentsDownward, oneOf } from '../../utils/assist';

export default {
    mixins: [Picker],
    components: { TimePickerPanel },
    props: {
        type: {
            validator (value) {
                return oneOf(value, ['monthDay']);
            },
            default: 'monthDay'
        },
    },
    computed: {
        panel(){
            return 'TimePickerPanel';
        }
    },
    watch: {
        visible(visible){
            if (visible) {
                this.$nextTick(() => {
                    const spinners = findComponentsDownward(this, 'TimeSpinner');
                    spinners.forEach(instance => instance.updateScroll());
                });
            }
        }
    }
};
