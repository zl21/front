import Notification from './notification.vue';
import Vue from 'vue';

const NotificationConstructor = Vue.extend(Notification);

Notification.newInstance = properties => {
    const _props = properties || {};
    const { id, position='top-right' } = properties;
    const Instance = new NotificationConstructor({
        propsData: _props
        // render (h) {
        //     return h(Notification, {
        //         props: _props
        //     });
        // }
    });
    const component = Instance.$mount();
    document.body.appendChild(component.$el);
    const notification = Instance;
    console.log('this-Notification', this)
    return {
        id,
        position,
        notice (noticeProps) {
            notification.add(noticeProps);
        },
        remove (name) {
            notification.close(name);
        },
        component: notification,
        destroy (element) {
            notification.closeAll();
            setTimeout(function() {
                document.body.removeChild(document.getElementsByClassName(element)[0]);
            }, 500);
        }
    };
};

export default Notification;
