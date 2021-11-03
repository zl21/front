
import Vue from 'vue';
// import window.vm.$router.from '../../__config__/router.config';
// import window.vm.$store.from '../../__config__/store.config';
// 图片预览
import PreviewPicture from './index.vue';
import i18n from '../../assets/js/i18n'

export default (array = [], items = {}, index) => {
  const { tableName } = window.vm.$router.currentRoute.params;

  // 判断是否已经存在对应的预览图片
  if ( window.vm.$store.state.global.previewPictureInstance.includes(`${tableName}_${items.field}`)) {
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
      'Modal',
      {
        props: {
          value: true,
          'class-name': `${tableName}_${items.field}`,
          draggable: true,
          title: i18n.t('previewPicture.picturePreview'),
          'z-index': 10001,
          'footer-hide': true,
          closable: true
        },
        on: {
          'on-cancel': () => {
            const arr = JSON.parse(JSON.stringify(window.vm.$store.state.global.previewPictureInstance));
            arr.splice(arr.findIndex(item => item === `${tableName}_${items.field}`), 1);
            window.vm.$store.commit('global/updatePreviewPicture', arr);
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
        }, i18n.t('previewPicture.picturePreview')),
        h(PreviewPicture, {
          props: {
            images: array,
            defaultIndex: index
          }
        })
      ]
    )
  }).$mount('#imgPreview');
  const arr = JSON.parse(JSON.stringify(window.vm.$store.state.global.previewPictureInstance));
  arr.push(`${tableName}_${items.field}`);
  window.vm.$store.commit('global/updatePreviewPicture', arr);
};
