import Vue from 'vue'
import Vuex from 'vuex'
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
    }
}

const actions = {
    SET_SCREEN_WIDTH(context, payload){
        context.commit('SET_SCREEN_WIDTH',payload.width);
    },
    SET_SCREEN_HEIGHT(context, payload){
        context.commit('SET_SCREEN_HEIGHT',payload.height);
    }
}

const mutations = {
    SET_SCREEN_WIDTH(state, payload){
        state.currentScreenWidth = payload;
        
    },
    SET_SCREEN_HEIGHT(state, payload){
        state.currentScreenHeight = payload;

    }       
}

export default {
    state,
    getters,
    actions,
    mutations
}