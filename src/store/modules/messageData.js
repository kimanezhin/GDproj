import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios';
Vue.use(Vuex)

// Vue.use(Vuex)
const state = {
    users: new Map(),
    messages: [],
    currentDialog: [],

}

const getters = {
    GET_MESSAGES(state) { return state.messages },
    GET_MESSAGE_MAP(state) { return state.users },
    GET_CURRENT_DIALOG(state) { return state.currentDialog }
}

const actions = {

    FIND_USERS(context, payload) {
        
        let id = parseInt(localStorage.getItem('myId'))
        return new Promise((resolve, reject) => {
            Axios.post(context.rootState.dataStorage.URL + '/users/search', JSON.stringify(payload), { withCredentials: true })
                .then((response) => {
                    let users = response.data;

                    users = users.map(x => {
                        if (context.state.currentDialog.data.group && 
                            context.state.currentDialog.data.group.users[x.id]) {
                            return {
                                name: x.firstName + " " + x.lastName,
                                code: x.id,
                                $isDisabled: true
                            }
                        }
                        return {
                            name: x.firstName + " " + x.lastName,
                            code: x.id
                        }
                    })
                    resolve(users)
                })
                .catch((err) => {
                    reject(err);
                })
        })
    },
    GET_USERS(context, payload) {
        return new Promise((resolve, reject) => {
            Axios.post(context.rootState.dataStorage.URL + '/users/', payload, { withCredentials: true }).then((response) => {
                resolve(response.data)
            }).catch((err) => reject(err))
        })
    },

    /*
    Required an object like:
    {
        id:1,
        type:"type"
    }
    */
    GET_DIALOG(context, payload) {
        context.state.currentDialog = JSON.parse(localStorage.getItem('currentDialog'))
        return new Promise((resolve, reject) => {
            Axios.post(context.rootState.dataStorage.URL + '/messages/get/' + payload.type, {
                direction: "forward",
                limit: 20,
                exclusiveFrom: null,
                request: parseInt(payload.id)
            },
                {
                    withCredentials: true
                }).then((response) => {
                    resolve(response.data)
                }).catch((err) => { reject(err) })
        })

    },

    GET_USERCHAT(context, payload) {
        return new Promise((resolve, reject) => {
            let msg = {
                direction: "backward",
                limit: 20,
                exclusiveFrom: null,
                request: payload
            }
            Axios.post(context.rootState.dataStorage.URL + '/messages/get/userChat').then(()=>{
                resolve(response.data);
            })
            .catch(() =>{
                reject();
            })
        })
    },


    SEND_MSG(context, payload) {
        return new Promise((resolve, reject) => {
            Axios.post(context.rootState.dataStorage.URL + '/messages/send', payload, { withCredentials: true }).then(() => {
                resolve();
            }).catch((err) => { reject(err) })
        })
    },

    UPDATE_DIALOG(context, payload) {
        return new Promise((resolve, reject) => {
            Axios.post(context.rootState.dataStorage.URL + '/chats/' + payload.operation + 'GroupChat', payload.data, { withCredentials: true }).then(() => {
                resolve();
            }).catch((err) => { console.error(err) })
        })
    },
    GET_ALL_MESSAGES(context, payload) {
        return new Promise((resolve, reject) => {
            Axios.post(context.rootState.dataStorage.URL + '/chats/getAll', {
                direction: "backward",
                limit: 20,
                exclusiveFrom: payload,
                request: null
            },
                {
                    withCredentials: true
                })
                .then((response) => {
                    if (!payload)
                        context.state.messages = []
                    let tt = (Object.entries(response.data.users));
                    context.commit('SET_MESSAGE_MAP', tt)
                    for (let i of (response.data.response))
                        context.state.messages.push({
                            type: Object.entries(i)[0][0],
                            data: i.groupChat || i.userChat
                        });
                    resolve();
                }).catch((err) => reject())
        })
    },

    LEAVE_CHANNEL(context, payload) {
        return new Promise((resolve, reject) => {
            Axios.post(context.rootState.dataStorage.URL + '/chats/leaveGroupChat', payload, { withCredentials: true }).then(() => {
                resolve();
            }).catch((err) => { reject(err) })
        })
    }

}

const mutations = {
    SET_MESSAGE_MAP(context, payload) {
        context.users = new Map(Array.from(payload).map(x => [parseInt(x[0]), x[1]]))
        localStorage.setItem("myMap", JSON.stringify(context.users))
    },

    ADD_TO_MAP(state, payload) {

        state.users.set(payload[0], payload[1]);
    }

}

export default {
    state,
    getters,
    actions,
    mutations
}