import ButtonFkDialog from '../view/ButtonFkDialog.vue'
import Md from './md/ButtonFkDialog.md'
import { action } from "@storybook/addon-actions";

import '@syman/ark-ui/dist/styles/bjIconfonts/iconfont.css';

import i18n from "@burgeon/internationalization/i18n"; // 国际化
window.$i18n = i18n;

export default {
	title: 'Basic/ButtonFkDialog',
	component: ButtonFkDialog,
	parameters: {
		notes: Md,
	},
	// argTypes: {
	// backgroundColor: { control: 'color' },
	// size: {
	//   control: { type: 'select' },
	//   options: ['small', 'medium', 'large'],
	// },
	// },
}

const Template = (args, { argTypes }) => ({
	components: { ButtonFkDialog },
	props: Object.keys(argTypes),
	template: '<ButtonFkDialog v-bind="$props" @getFkChooseItem="getFkChooseItem" />',
	methods: {
		getFkChooseItem: action("")
	},
})

export const Default = Template.bind({})
Default.args = {
	layer: false,
	itemdata: { "col": 1, "colid": "1700806532", "colname": "PS_C_PRO_ID", "datelimit": "all", "display": "text", "fkdesc": "系统商品SKU", "fkdisplay": "mop", "inputname": "PS_C_PRO_ID:ECODE", "isfk": true, "isnotnull": false, "isuppercase": true, "length": 65535, "name": "", "readonly": false, "reftable": "PS_C_SKU", "reftableid": 23281, "row": 1, "statsize": -1, "type": "STRING", "valuedata": "", "isOneData": false, "isObject": true, "version": "1.4" },
}