import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios';
Vue.use(Vuex)

const state = {
    currentScreenWidth: 1000,
    currentScreenHeight:1000
}

const getters = {
    GET_WIDTH(state) {
        return state.currentScreenWidth
    },
    GET_HEIGHT(state){
        return state.currentScreenHeight
    },

}

const actions = {
    SET_SCREEN_WIDTH(context, payload){
        context.commit('SET_SCREEN_WIDTH',payload.width);
    },
    SET_SCREEN_HEIGHT(context, payload){
        context.commit('SET_SCREEN_HEIGHT',payload.height);
    },
    SET_MY_ID(context, payload){
        return new Promise((resolve, reject) => {
            Axios.post(context.rootState.dataStorage.URL+'/authentication/me',{},{withCredentials:true}).then((response) =>{
                localStorage.setItem('myId',response.data)
                resolve();
            })
        })
       
    },
    GET_IMG(context, payload){
        return require("../../../img/" + payload + ".png");
    }
}

const mutations = {
    SET_SCREEN_WIDTH(state, payload){
        state.currentScreenWidth = payload;
        
    },
    SET_SCREEN_HEIGHT(state, payload){
        state.currentScreenHeight = payload;

    },
           
}

export default {
    state,
    getters,
    actions,
    mutations
}