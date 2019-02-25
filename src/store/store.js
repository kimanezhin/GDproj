import Vue from 'vue'
import Vuex from 'vuex'
import users from './modules/currentUsers'
import dataStorage from './modules/dataStorage'
import systemData from './modules/systemData'
import auth from './modules/auth'
Vue.use(Vuex)


export default new Vuex.Store({
   modules:{
    users,
    dataStorage,
    systemData,
    auth
   }
})