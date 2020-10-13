import { Modal } from 'ark-ui';
import Vue from 'vue';
import router from '../../__config__/router.config';
import store from '../../__config__/store.config';
// 图片预览
import PreviewPicture from './index.vue';

export default (array = [], items = {}, index) => {
  const { tableName } = router.currentRoute.params;

  // 判断是否已经存在对应的预览图片
  if (store.state.global.previewPictureInstance.includes(`${tableName}_${items.field}`)) {
    document.getElementsByClassName(`${tableName}_${items.field}`)[0].getElementsByClassName('ark-modal-header')[0].click();
    return;
  }
  // 获取body并且创建一个新的div节点
  if (!document.getElementById('imgPreview')) {
    const body = document.body;
    const bindPhone = document.createElement('div');
    
    // 给创建的div设置id=message，并且添加到body后
    bindPhone.setAttribute('id', 'imgPreview');
    body.appendChild(bindPhone);
  }

  new Vue({
    render: h => h(
      Modal,
      {
        props: {
          value: true,
          'class-name': `${tableName}_${items.field}`,
          draggable: true,
          title: '图片预览',
          'z-index': 10001,
          'footer-hide': true,
          closable: true
        },
        on: {
          'on-cancel': () => {
            const arr = JSON.parse(JSON.stringify(store.state.global.previewPictureInstance));
            arr.splice(arr.findIndex(item => item === `${tableName}_${items.field}`), 1);
            store.commit('global/updatePreviewPicture', arr);
          }
        }
      }, [
        h('div', {
          slot: 'header',
          style: {
            width: '100%',
            height: '100%',
            display: 'flex',
            'align-items': 'center',
            'justify-content': 'center'
          }
        }, '图片预览'),
        h(PreviewPicture, {
          props: {
            images: array,
            defaultIndex: index
          }
        })
      ]
    )
  }).$mount('#imgPreview');
  const arr = JSON.parse(JSON.stringify(store.state.global.previewPictureInstance));
  arr.push(`${tableName}_${items.field}`);
  store.commit('global/updatePreviewPicture', arr);
};
