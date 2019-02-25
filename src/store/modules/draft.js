import Vue from 'vue'
import Vuex from 'vuex'
// import Axios from 'axios'
// import VueNativeSock from "vue-native-websocket";
// import _ from "lodash";
// import currentUsers from './currentUsers'
import { rejects } from 'assert';
import Axios from 'axios';
Vue.use(Vuex)

// Vue.use(Vuex)
const state = {
    currentDraft: '',
    currentId :''
}

const getters = {

}

const actions = {
    SET_DRAFT(context, payload) {
        context.state.currentDraft = payload;
    },
    SEND_POST(context, payload) {
        console.log(context)
        context.commit("CREATE_POST", context.rootState.dataStorage.URL)
        
        // context.commit("PUBLISH", context.rootState.dataStorage.URL)
    }
}

const mutations = {
    CREATE_POST(context, payload) {
        Axios.defaults.headers.post["Content-Type"] = "application/json";
        Axios.post(payload + "/drafts/create",
            [
                {
                    "markdown": context.currentDraft
                }
            ]
            , {
                withCredentials: true
            }
        ).then((response) => {
            context.currentId = response.data
            Axios.post(payload + "/drafts/publish",context.currentId,{withCredentials:true})
            console.log(response.data)
        })
    },
    PUBLISH(context, payload){
       
        
       
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}