import store from '../__config__/store.config';
import router from '../__config__/router.config';

const message = {};


message.installed = false;

message.install = ((Vue) => { 
  if (message.installed) return;
  Vue.prototype.$message = {};
  Vue.prototype.$message.error = (data) => {
    if (window.vm && window.vm.$Modal) {
      window.vm.$Modal.fcError({
        mask: true,
        titleAlign: 'center',
        title: '错误',
        // content: formatJsonEmg
        render: h => h('div', {
          style: {
            padding: '10px 20px 0',
            display: 'flex',
            // alignItems: 'center',
            lineHeight: '16px'
          }
        }, [
        
          h('i', {
            props: {
            },
            style: {
              marginRight: '5px',
              display: 'inline-block',
              'font-size': '28px',
              'margin-right': ' 10px',
              'line-height': ' 1',
              padding: ' 10px 0',
              color: 'red'
            },
            class: 'iconfont iconbj_error fcError '
          }),
          h('div', {
            attrs: {
            // rows: 8,
            // readonly: 'readonly',
            },
            domProps: {
            // value: formatJsonEmg,
            },
            style: `width: 80%;
              margin: 1px;
              margin-bottom: -8px;
              box-sizing: border-box;
              padding: 5px;
              resize: none;
              max-height: 100px;
              max-width: 300px;
              overflow: auto;
              `
          }, data)
        ])
      });
    }
    message.installed = true;
  };
});
 

export default message;
