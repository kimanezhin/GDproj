import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
Vue.use(Vuex)
Axios.defaults.headers.post["Content-Type"] = "application/json";
const state = {
    status: ''

}

const getters = {
    isAuthenticated: state => state.status === 'success',
    authStatus: state => state.status,

}

const actions = {
    AUTH_REQUEST(context, user) {
        return new Promise((resolve, reject) => { // The Promise used for router redirect in login
            context.commit('AUTH_REQUEST')
            
            Axios.post(
                context.rootState.dataStorage.URL + "/authenticate",
                {
                    authenticationId: user
                },
                {
                    withCredentials: true
                }
            ).then(resp => {
                context.commit('AUTH_SUCCESS')
                resolve(resp)
            })
                .catch(err => {
                    commit('AUTH_ERROR', err)
                    //   localStorage.removeItem('user-token') // if the request fails, remove any possible user token if possible
                    reject(err)
                })
        })
    }
}

const mutations = {
    AUTH_REQUEST: (state) => {
        state.status = 'loading'
        console.log(state.status)
    },
    AUTH_SUCCESS: (state) => {
        state.status = 'success'
        console.log(state.status)
    },
    AUTH_ERROR: (state) => {
        state.status = 'error'
        console.log(state.status)
    },
}

export default {
    state,
    getters,
    actions,
    mutations
}