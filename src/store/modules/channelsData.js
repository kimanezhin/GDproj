import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
// import _ from "lodash";

Vue.use(Vuex)
const state = {
    currentChannel: {},
    channels: [],
    chosenPeople: [],
    chosenTags: [],
    name: ""
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
        console.log(context.state.currentChannel)
    },
    UPDATE_CHANNEL(context, payload) {
        Axios.post(context.rootState.dataStorage.URL + '/channels/update', payload, { withCredentials: true })
    },
    CREATE_CHANNEL(context, payload) {
        Axios.post(context.rootState.dataStorage.URL + '/channels/create', payload, { withCredentials: true })
    },
    async GET_ALL_CHANNELS(context) {
        context.state.channels = []
        Axios.post(context.rootState.dataStorage.URL + '/channels', {}, { withCredentials: true }).then((channels) => {
            channels.data.forEach(elem => {
                context.state.channels.push(elem)
            })

            // console.log(context.channels)

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
