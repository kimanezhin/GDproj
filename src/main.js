// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import store from './store/store'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueNativeSock from 'vue-native-websocket'
import ReadMore from 'vue-read-more'
import VModal from 'vue-js-modal'
import vSelectMenu from 'v-selectmenu'
Vue.use(VModal, { dynamic: true, injectModalsContainer: true })
Vue.use(vSelectMenu,{language:'en'});
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faUserSecret, faEnvelope, faUser, faNewspaper, faProjectDiagram, faTasks, faCog, faPaperPlane, faImage } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
 
library.add(faPlus, faUserSecret, faEnvelope, faUser,faNewspaper,faProjectDiagram,faTasks,faCog,faPaperPlane, faImage )
 
Vue.component('font-awesome-icon', FontAwesomeIcon)
 
Vue.use(ReadMore)
Vue.use(VueNativeSock, 'ws://websuck1t.herokuapp.com/', {
  connectionManually: true
})
Vue.use(BootstrapVue);
import Vuex from 'vuex'
Vue.use(Vuex)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
