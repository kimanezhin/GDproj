import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
import _ from "lodash";

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
    GET_CURRENT_CHANNEL(state) { return state.currentChannel }
}

const actions = {
    DELETE_CHANNEL(context, payload) {
        Axios.post(context.rootState.dataStorage.URL + '/channels/delete', payload, { withCredentials: true }).then(() => {
            context.dispatch('GET_ALL_CHANNELS')
        })
    },
    CHANGE_CHANNEL(context, payload) {
        context.state.currentChannel = {}
        Object.assign(context.state.currentChannel, payload)
    },
    async UPDATE_CHANNEL(context, payload) {
        await Axios.post(context.rootState.dataStorage.URL + '/channels/update', payload, { withCredentials: true }).then(() => {
            context.dispatch('GET_ALL_CHANNELS')
        })
    },
    CREATE_CHANNEL(context, payload) {
        Axios.post(context.rootState.dataStorage.URL + '/channels/create', payload, { withCredentials: true }).then((channelId) => {
            context.dispatch('GET_ALL_CHANNELS')
            // if (localStorage.getItem('currentChannel') == 0) {
                // context.dispatch("CHANGE_CHANNEL", context.state.channels[0])
            // }
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
