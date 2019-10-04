// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import store from './store/store'
import Axios from 'axios'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VModal from 'vue-js-modal'
import vSelectMenu from 'v-selectmenu'
Vue.use(VModal, { dynamic: true, injectModalsContainer: true })
Vue.use(vSelectMenu, { language: 'en' });
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPencilAlt, faEdit, faTimes, faChevronDown,faCheck, faEllipsisH,faPlus, faUserSecret, faEnvelope, faUser, faNewspaper, faProjectDiagram, faTasks, faCog, faPaperPlane, faImage, faCommentAlt, faCommentDollar, faPenSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faPencilAlt, faTimes,faEdit, faPenSquare, faChevronDown, faCheck, faEllipsisH,faPlus, faUserSecret, faEnvelope, faUser, faNewspaper, faProjectDiagram, faTasks, faCog, faPaperPlane, faImage)
import PrettyCheckbox from 'pretty-checkbox-vue';

Vue.use(PrettyCheckbox);
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(BootstrapVue);

Vue.config.productionTip = false

Vue.prototype.$eventHub = new Vue();
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
