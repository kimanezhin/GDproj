import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Feed from '@/components/Feed'
import Acc from './../components/User/User'
import VueNativeSock from 'vue-native-websocket'
import Axios from 'axios';
Vue.use(VueNativeSock, 'ws://websuck1t.herokuapp.com/posts/all ', {
  connectManually: true,
})
Vue.use(Router)
import dataStorage from '../store/modules/dataStorage'

const ifAuthenticated = (to, from, next) => {
  Axios.post(dataStorage.state.URL + "/posts/last", 1, { withCredentials: true }).then(() => {
    next('/feed')
    return
  }).catch(() => {
    next()
  })
}

const ifNotAuthenticated = (to, from, next) => {
  Axios.post(dataStorage.state.URL + "/posts/last", 1, { withCredentials: true }).then(() => {
    next()
    return
  }).catch(() => {
    next('/')
  })
}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login,
      beforeEnter: ifAuthenticated
    },
    {
      path: '/feed',
      name: 'Feed',
      component: Feed,
      beforeEnter: ifNotAuthenticated
    },
    {
      path: '/user/:id',
      name: 'acc',
      component: Acc,
      props:true,
      beforeEnter: ifNotAuthenticated
    }
  ]
})
