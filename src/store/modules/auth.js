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

    REGISTER_USER(context, payload) {
        return new Promise((resolve, reject) => {
            Axios.post(context.rootState.dataStorage.URL + '/authentication/register', payload, { withCredentials: true })
                .then(() => {
                    resolve('Code send');
                })
                .catch(() => { reject(); })
        })
    },
    GET_FACULTY(context, payload) {
        return new Promise((resolve, reject) => {
            Axios.post(context.rootState.dataStorage.URL + '/faculty/search', JSON.stringify(payload), { withCredentials: true }).then((response) => {
                let arr = response.data.map(x => {
                    return {
                        name: x.name,
                        code: x.url
                    }
                });
                resolve(arr)
            }).catch((err) => {reject(err)})
        })
    },
    VERIFY_CODE(context, payload){
        Axios.post(context.rootState.dataStorage.URL+'/authentication/verify', payload,{withCredentials:true})
        .then(()=>{
            resolve();
        })
        .catch(() =>{
            reject();
        })

    },
    AUTH_REQUEST(context, user) {
        return new Promise((resolve, reject) => {

            // context.commit('AUTH_REQUEST')
            Axios.post(
                context.rootState.dataStorage.URL + "/authentication/login",
                {
                    authenticationEmail: user
                },
                {
                    withCredentials: true
                }
            ).then(resp => {
                resolve(resp.data.userStatus)
                // localStorage.setItem('myId', resp.data)
                // context.commit('AUTH_SUCCESS')
                resolve(resp)
            })
                .catch(err => {
                    // commit('AUTH_ERROR', err)
                    console.error(err)
                    //   localStorage.removeItem('user-token') // if the request fails, remove any possible user token if possible
                    reject(err)
                })
        })
    },
    LOG_OUT(context) {
        return new Promise((resolve, reject) => {
            Axios.post(context.rootState.dataStorage.URL + '/authentication/logout', {}, { withCredentials: true }).then(() => {
                localStorage.removeItem('myId')
                resolve();
            }).catch(() => {
                reject()
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