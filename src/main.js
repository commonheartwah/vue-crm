// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.


import Vue from 'vue'

// 饿了么
import ElementUI from 'element-ui'
import '../static/css/index.css'
Vue.use(ElementUI)

//七牛
import Qiniu from 'qiniu-js'

//VueRouter
import VueRouter from 'vue-router'
Vue.use(VueRouter)

//VueVideoPlayer
import VideoPlayer from 'vue-video-player'
Vue.use(VideoPlayer)

//vue-event-calendar
import '../static/css/vueEventCalendar.css'
import vueEventCalendar from 'vue-event-calendar'
Vue.use(vueEventCalendar, {locale: 'en', color:  '#4fc08d'})

// vue-cookie
var VueCookie = require('vue-cookie');
Vue.use(VueCookie);

// axios
import axios from 'axios'
Vue.prototype.$ajax = axios;

// 复制插件
import Clipboard from 'clipboard';

// font-awesome 图标样式
import 'font-awesome/css/font-awesome.min.css'

//vue-clipboard 复制剪切板
import vueClipboard from 'vue-clipboard2'
Vue.use(vueClipboard);

// vue-fancybox 图标矢量放大缩小
// import fancyBox from 'vue-fancybox';

import routes from './routes'
import App from './App'

import Sticky from '../src/components/Sticky'; // 粘性header组件
Vue.component('Sticky', Sticky);

Vue.config.productionTip = false


/* eslint-disable no-new */

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    // 如果是招募计划的话要取寄存在上一个路由里面的page_index值
    if (to.path == "/planList" && from.query.page_index) {
        to.query['page_index'] = from.query.page_index
    }

    let user = VueCookie.get('_uid');
    // console.log(user);
    // 如果用户不存在并且即将跳转的路由不是login 路由就指向login
    if (!user && to.path != '/login') {
        next({ path: '/login' })
    }
    else if (to.path == '/') {
        next({ path: '/CourseList' })
    }
    else {
        next()
    }
})

new Vue({
    el: '#app',
    template: '<App/>',
    components: { App },
    router
})
