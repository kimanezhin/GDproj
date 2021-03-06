import Vue from 'vue'
import Vuex from 'vuex'
import users from './modules/currentUsers'
import dataStorage from './modules/dataStorage'
import systemData from './modules/systemData'
import auth from './modules/auth'
import draft from './modules/draft'
import channelsData from './modules/channelsData'
import messageData from  './modules/messageData'
Vue.use(Vuex)


export default new Vuex.Store({
   modules:{
    users,
    dataStorage,
    systemData,
    auth,
    draft,
    channelsData,
    messageData
   }
})