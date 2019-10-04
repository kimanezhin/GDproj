import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
import dataStorage from './dataStorage'
Vue.use(Vuex)

//const m = new Map()

const state = {
    m: new Map()

}

const getters = {
    GET_BY_ID(state) {
        return (id) => {
            return new Promise((resolve, reject) => {
                let response = makeResponse(id)
                resolve(response)
            })

        }
    }
}

const actions = {
    callB(context, payload) {
        return '1'
    }
}

const mutations = {

}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
async function makeResponse(id) {
    return await Axios.post(dataStorage.state.URL +'/users/', [id], { withCredentials: true })
}
function getUser(id, state) {
    return new Promise((resolve, reject) => {
        let t = state.m.get(id);

        if (typeof t !== "undefined") {
            resolve(t)
        }
        reject()
    })

}