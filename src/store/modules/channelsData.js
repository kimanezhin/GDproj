import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
// import _ from "lodash";

Vue.use(Vuex)
const state = {
    channels: [],
    chosenPeople: [],
    chosenTags: [],
    name: ""
}

const getters = {
    GET_CHANNELS(state) { return state.channels }
}

const actions = {
    UPDATE_CHANNEL(context, payload) {
        Axios.post(context.rootState.dataStorage.URL + '/channels/update',payload,{withCredentials: true})
    },
    CREATE_CHANNEL(context, payload) {
        Axios.post(context.rootState.dataStorage.URL + '/channels/create',payload,{withCredentials: true})
    },
    async GET_ALL_CHANNELS(context) {
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
