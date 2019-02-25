import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
import VueNativeSock from "vue-native-websocket";
import _ from "lodash";
import currentUsers from './currentUsers'
import { rejects } from 'assert';
const vm = new Vue();
Vue.use(Vuex)






const state = {
    id: '',

    isDataFetched: false,
    messages: ['s'],
    URL: "https://valera-denis.herokuapp.com",
    posts: [
    ],
    channels: [
        {
            id: 1,
            name: "#general",
            thumbnail: "http://lorempixel.com/40/40/people/1"
        },
        {
            id: 2,
            name: "#grudina",
            thumbnail: "http://lorempixel.com/40/40/people/2"
        },
        {
            id: 3,
            name: "#javaHW",
            thumbnail: "http://lorempixel.com/40/40/people/3"
        },
        {
            id: 4,
            name: "#osi",
            thumbnail: "http://lorempixel.com/40/40/4"
        }

    ],
    token: '',
    socket: {
        isConnected: false,
        message: '',
        reconnectError: false,
    },
    columnToAdd: 0
}

const getters = {
    GET_POSTS(state) { return state.posts; },
    GET_TOKEN(state) { return state.token; },
    GET_USER(state, getters, rootstate, rootgetters) { return rootstate.users },
    GET_FULL_NAME: (state) => (id) => { },
    GET_ID(state) { return parseInt(state.id) }

}

const actions = {

    async FETCH_DATA(context) {
        await Axios
            .post(context.state.URL + "/posts/last",
                20
                , {
                    withCredentials: true
                }
            )
            .then(response => {

                let answer = response.data.response;
                
                for (var item of response.data) {
                    
                    makeRequest(item, context);
                }
                context.commit('SET_TOKEN', response.data.token)
                // TODO: change request here
                // for (var i in answer) {

                //     context.commit('PUSH_POST', {
                //         name: '',//this.getters.GET_FULL_NAME(answer[i].postAuthor),//context.dispatch('GET_AUTHOR_NAME', [answer[i].postAuthor, i]),//GET_AUTHOR_NAME(answer[i].postAuthor, i),
                //         postId: answer[i].postId,
                //         postBody: answer[i].postBody,
                //         num: context.state.columnToAdd
                //     })
                //     SET_NAME(context.state, [i, answer[i].postAuthor])
                //     context.state.columnToAdd = context.state.columnToAdd == 0 ? 1 : 0;

                // }
            }).then(() => { context.state.isDataFetched = true; });
    },


    SET_ID(context, payload) {

        context.state.id = payload;
    }


}
const mutations = {
    SET_TOKEN(state, payload) { state.token = payload },
    PUSH_POST(state, payload) {
        state.posts.push({
            name: payload.name,
            postId: payload.postId,
            postBody: payload.postBody,
            num: payload.num
        })
    },
    UNSHIFT_POST(state, payload) { },

    SOCKET_ONOPEN(state, event) {
        state.socket.isConnected = true
        console.log('onOpen')
    },
    SOCKET_ONCLOSE(state, event) {
        state.socket.isConnected = false
    },
    SOCKET_ONERROR(state, event) {
        let self = this

        console.log('onError')
        let socketURL =
            "ws://websuck1t.herokuapp.com/posts/subscribe/" +
            state.token;
        vm.$connect(socketURL, { store: self });
    },
    // default handler called for all methods
    SOCKET_ONMESSAGE(state, message) {


        if (state.socket.message != message) {

            let objToDelete = JSON.parse(message.data).response.deleted;
            for (var i in objToDelete) {
                state.posts.splice(_.findIndex(this.state.posts, { postId: objToDelete[i] }), 1);//TODO DELETE

            }
            let objToAdd = JSON.parse(message.data).response.added;

            if (typeof JSON.parse(message.data).token == "number") {
                state.token = JSON.parse(message.data).token

            }
            for (var i in objToAdd) {
                Axios
                    .get("https://websuck1t.herokuapp.com/posts/" + objToAdd[i])
                    .then(response => {

                        state.posts.unshift({ //TODO ADD
                            name: '', // this.actions.GET_AUTHOR_NAME('','') ,
                            //  name: "ss",
                            postId: response.data.postId,
                            postBody: response.data.postBody,
                            num: state.columnToAdd
                        });
                        SET_NAME(state, [i, response.data.postAuthor])

                    });
                state.columnToAdd = state.columnToAdd == 0 ? 1 : 0;
            }


            state.socket.message = message;
        }
        //  state.message = message





    },
    // mutations for reconnect methods
    [WebSocket.WS_RECONNECT](state, count) {
        console.log('on reconnect')

    },
    [WebSocket.WS_RECONNECT_ERROR](state) {
        console.log('on reconnect error')
        state.socket.reconnectError = true
    }
}
async function makeRequest(item, context) {
    try {
        // Axios.get("http://websuck1t.herokuapp.com/posts/" + item).then(response => {
        //  console.log(response.data)
        SET_NAME(context.state, item.authorId).then((name) => {
            context.state.columnToAdd = context.state.columnToAdd == 0 ? 1 : 0;
            context.commit('PUSH_POST', {
                name: name.data[0].firstName + " " + name.data[0].secondName,
                postId: item.id,
                postBody: item.body[0].markdown,
                num: context.state.columnToAdd
            });
        })
    } catch (Exc) { console.log('aaaa') }
}

function SET_NAME(state, payload) {
    var t = currentUsers.getters.GET_BY_ID.call('s', currentUsers.state).call('s', payload)
   
    return t;
}
export default {
    state,
    getters,
    actions,
    mutations
}
