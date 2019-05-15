import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
import _ from "lodash";
import { makeRequest } from './dataStorage'

Vue.use(Vuex)
const state = {
    currentChannel: {},
    channels: [],
    chosenPeople: [],
    chosenTags: [],
    name: "",
    lastAdded: ''
}

const getters = {
    GET_CHANNELS(state) { return state.channels },
    GET_CURRENT_CHANNEL(state) { return state.currentChannel },
    isNotLastGetter(state) {return state.isNotLast}
}

const actions = {
    DELETE_CHANNEL(context, payload) {
        Axios.post(context.rootState.dataStorage.URL + '/channels/delete', payload, { withCredentials: true }).then(() => {
            context.dispatch('GET_ALL_CHANNELS')
        })
    },
    CHANGE_CHANNEL(context, payload) {
        return new Promise((resolve, reject) => {
            // context.state.currentChannel = {}
            // Object.assign(context.state.currentChannel, payload)


            /*
                Here is 
                payload[0] - body of request
                payload[1] - id of last post, can be null
            */
            let request = {
                direction: "backward",
                limit: 20,
                exclusiveFrom: null,
                request: payload.id
            }


            if (_.isEqual({}, payload)) {
                context.rootState.dataStorage.posts = []
                context.dispatch('FETCH_DATA').then(() => {
                    resolve();
                }).catch(() => { reject(err) })
            }
            else {

                context.dispatch("UPDATE_POSTS", {
                    type: false,
                    request: request
                })
                .then(() => { resolve() })
                .catch(() => reject())
            }
        })



    },

    UPDATE_POSTS(context, payload) {
        return new Promise((resolve, reject) => {
            if (!payload.type)
                context.rootState.dataStorage.posts = []
            // context.rootState.dataStorage.posts
            let request = payload.request
            Axios.post(context.rootState.dataStorage.URL + '/channels/get', request, { withCredentials: true }).then((response) => {
                let tt = new Map(Object.entries(response.data.users));
                context.commit('SET_MAP', tt)
                
                if (response.data.response.length == 0)
                    context.rootState.dataStorage.isNotLast = false;

                for (var item of response.data.response) {
                    context.commit('UPDATER', item)
                }
                

            })
                .then(() => { resolve(context.rootState.dataStorage.isNotLast) })
                .catch((err) => {
                    console.error(err)
                    reject(err)
                })
        })
    },

    UPDATE_CHANNEL(context, payload) {
        await Axios.post(context.rootState.dataStorage.URL + '/channels/update', payload, { withCredentials: true }).then(() => {
            context.dispatch('GET_ALL_CHANNELS')
        })
    },
    CREATE_CHANNEL(context, payload) {
        return new Promise((resolve, reject) =>{
            Axios.post(context.rootState.dataStorage.URL + '/channels/create', payload, { withCredentials: true }).then((channelId) => {
                context.dispatch('GET_ALL_CHANNELS')
                resolve();
            }).catch((err) => {reject(err)})
        })
    },
    async GET_ALL_CHANNELS(context) {
        context.state.channels = []
        await Axios.post(context.rootState.dataStorage.URL + '/channels', {}, { withCredentials: true }).then((channels) => {
            context.state.channels = []
            channels.data.forEach(elem => {
                context.state.channels.push(elem)
            })

        },
        )
    }
}
const mutations = {

}


export default {
    state,
    getters,
    actions,
    mutations
}
