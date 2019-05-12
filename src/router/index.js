import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/AccountEnter/Login'
import Feed from '@/components/Feed'
import Acc from './../components/User/User'
import im from '../components/Messages/MessageView.vue'
import VueNativeSock from 'vue-native-websocket'
import Axios from 'axios';
import Dialog from './../components/Messages/DialogWrapper.vue'
import Registration from '../components/AccountEnter/Registration.vue'
import CodeEnter from '../components/AccountEnter/CodeEnter.vue'
Vue.use(VueNativeSock, 'ws://websuck1t.herokuapp.com/posts/all ', {
  connectManually: true,
})
Vue.use(Router)

import dataStorage from '../store/modules/dataStorage'


const ifAuthenticated = (to, from, next) => {
  Axios.post(dataStorage.state.URL + "/posts/last", {
    direction: 'backward',
    limit: 1,
    exclusiveFrom: null,
    request: []
  }, { withCredentials: true }).then(() => {

    next('/feed')
    return
  }).catch(() => {

    next()
  })
}

const ifNotAuthenticated = (to, from, next) => {
  Axios.post(dataStorage.state.URL + "/posts/last", {
    direction: 'backward',
    limit: 1,
    exclusiveFrom: null,
    request: []
  }, { withCredentials: true }).then(() => {
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
      props: true,
      beforeEnter: ifNotAuthenticated
    },
    {
      path: '/im',
      name: 'messages',
      component: im,
      props:true,
      beforeEnter: ifNotAuthenticated

    },
    {
      path: '/dialog/:id',
      name: 'dialog',
      component: Dialog,
      props: true,
      beforeEnter: ifNotAuthenticated
    },
    {
      path: '/registration',
      name: 'Registration',
      component: Registration,
      beforeEnter: ifAuthenticated
    },
    {
      path: '/code',
      name: "CodeEnter",
      component: CodeEnter,
      
    }
  ]
})
