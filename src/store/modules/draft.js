import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios';
Vue.use(Vuex)

// Vue.use(Vuex)
const state = {
    currentDraft: '',
    currentId: '',
    tags: []
}

const getters = {

}

const actions = {
    SET_DRAFT(context, payload) {

    },
    SEND_POST(context, payload) {
        context.state.currentDraft = payload[0];
        payload[1] = payload[1].map(x => x.name.slice(1, x.length))
        context.state.tags = payload[1]
        //  context.commit("CREATE_POST", context.rootState.dataStorage.URL)

        context.commit("CREATE_POST", context.rootState.dataStorage.URL)
    }
}

const mutations = {
    CREATE_POST(context, payload) {
        Axios.defaults.headers.post["Content-Type"] = "application/json";
        Axios.post(payload + "/posts/publish",
            {
                body: [
                    {
                        "markdown": context.currentDraft
                    }
                ],
                tags: context.tags
            }
            , {
                withCredentials: true
            }
        ).then(() => {
            // context.currentId = response.data
            // Axios.post(payload + "/drafts/publish",context.currentId,{withCredentials:true})
            // console.log(response.data)
        })
    },
    PUBLISH(context, payload) {



    }
}

export default {
    state,
    getters,
    actions,
    mutations
}