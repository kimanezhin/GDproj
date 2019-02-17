import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Feed from '@/components/Feed'
import Acc from './../components/User/User'
import VueNativeSock from 'vue-native-websocket'
Vue.use(VueNativeSock, 'ws://websuck1t.herokuapp.com/posts/all ', {
  connectManually: true,
})
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/feed',
      name: 'Feed',
      component: Feed
    },
    {
      path: '/me',
      name: 'acc',
      component: Acc
    }
  ]
})
