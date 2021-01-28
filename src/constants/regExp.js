

const regExp = {

};
// 大写字母
regExp.Capital = /^[A-Z]+$/;
// 字母
regExp.Letter = /^[a-zA-Z]+$/;
// 数字
regExp.Digital = /^(-|\+)?[0-9]*$/;
// 正整数
regExp.Number = /^\d*?$/;

// 小数点后两位正数(用于输入控制)
regExp.float = /^[\+]?\d*?\.?\d{0,2}$/;

// 小数点后四位位
regExp.float4 = /^[\+]?\d*?\.?\d{0,4}$/;

// 不能为空
regExp.notNull = /\S/;

// 手机号验证
regExp.phone = /^1[34578]\d{9}$/;

// 大于0的数,支持小数点后两位(用于判断)
regExp.positiveNumber = /^(?!(0[0-9]{0,}$))(?!(0[.]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/;

// 金额输入控制
regExp.money = /^\d{0,8}(\.[0-9]{0,2})?$/;

// 正负金额输入控制
regExp.negativemoney = /^(\-|\+)?\d{0,8}(\.[0-9]{0,2})?$/;

// 正整数 8位
regExp.amount = /^\d{0,8}?$/;

// 不能输入小写字母
regExp.amount = /^\d{0,8}?$/;


export default regExp;
