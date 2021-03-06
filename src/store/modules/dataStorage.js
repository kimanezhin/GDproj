
import Axios from 'axios'

import _ from "lodash";
import currentUsers from './currentUsers'
export { makeRequest }

const state = {
    id: '',
    userImgId: '',
    isDataFetched: false,
    isUserDataFetched: false,
    isNotLast: true,
    currentChannel: 1,
    m: new Map(),
    messages: ['s'],
    tagCompletions: null,
    values: [],
    URL: "https://valera-denis.herokuapp.com",
    posts: [
    ],
    foundPosts:[],
    userPosts: [],
    channels: [

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
    GET_USER_POSTS(state) { return state.userPosts },
    GET_TOKEN(state) { return state.token; },
    GET_USER(state, getters, rootstate, rootgetters) { return rootstate.users },
    GET_FULL_NAME: (state) => (id) => { },
    GET_ID(state) { return parseInt(state.id) },
    GET_URL(state) { return state.URL },
    GET_MAP(state) { return state.m },
    GET_COMPLETIONS(state) { return state.values },
    GET_IMG_ID(state) { return state.userImgId },
    GET_FOUND_POSTS(state){return state.foundPosts},

    GET_IMG(state) {
        return (id) => {

            let prom = new Promise((resolve, reject) => {
                if (id == 22723) {
                    state.userImgId = require("../../../img/" + id + ".png");
                    resolve();
                }
                else
                    if (!state.m || !state.m.get(id)) {
                        console.log(id)
                        Axios.post(state.URL + '/users', [id], { withCredentials: true }).then((response) => {

                            let user = state.m.get(id);
                            console.log(user)
                            let userID = user.faculty.campusCode
                            console.log(userID)
                            state.userImgId = require("../../../img/" + userID + ".png");
                            resolve();
                        })
                    }
                    else {
                        let user = state.m.get(id).faculty.campusCode
                        state.userImgId = require("../../../img/" + user + ".png");
                        resolve();
                    }
            })
            console.log(state.userImgId)


        }
    }


}

const actions = {

    async FETCH_DATA(context, payload) {
        context.state.isNotLast = true;
        return new Promise((resolve, reject) => {
            if (!payload) {
                context.state.posts = []
                payload = null
            }
            Axios
                .post(context.state.URL + "/posts/last",
                    {
                        direction: 'backward',
                        limit: 10,
                        exclusiveFrom: payload,
                        request: []
                    }
                    , {
                        withCredentials: true
                    }
                )
                .then(response => {
                    let tt = new Map(Object.entries(response.data.users));
                    context.commit('SET_MAP', tt)
                    if (response.data.response.length == 0)
                        context.rootState.channelsData.isNotLast = false;
                    for (var item of response.data.response) {
                        makeRequest(context.state, item, context.state.posts)
                    }
                }).then(() => {
                    // context.state.isDataFetched = true;
                    resolve();
                }).catch(() => {
                    reject();
                });
        })
    },

    FIND_POSTS(context, payload) {
        let request = {
            "direction": "backward",
            "limit": 20,
            "exclusiveFrom": null,
            "request": {
                "people": [],
                "tags": payload
            }
        }
        context.state.foundPosts = []
        Axios.post(context.state.URL + '/channels/getAnonymous',request,{withCredentials:true})
        .then((response)=>{
            
             let tt = new Map(Object.entries(response.data.users));
                    context.commit('SET_MAP', tt)
                    if (response.data.response.length == 0)
                        context.rootState.channelsData.isNotLast = false;
                    for (var item of response.data.response) {
                        makeRequest(context.state, item, context.state.foundPosts)
                        console.log(item)
                    }
        })
    },

    UPDATE_USER(context, payload) {
        return new Promise((resolve, reject) => {
            Axios.post(context.state.URL + '/users/update', payload, { withCredentials: true }).then(() => {
                resolve();
            })
                .catch((err) => {
                    console.log(err)
                    reject()
                })
        })
    },

    async GET_TAG_COMPLETIONS(context) {
        Axios.get(context.state.URL + '/tags/completions').then((response) => {
            context.state.tagCompletions = response.data;
        })
    },
    GET_COMPLETION(context, payload) {
        return new Promise((resolve, reject) => {
            let tree = payload[0] || context.state.tagCompletions;
            let word = payload[1]
            if (word === "") {
                context.state.values = getValues(tree.subtree)

                resolve(transformTags(context.state.values));
            }
            let character = word[0];

            if (!tree.subtree[character]) {
                context.state.values = []
                resolve();
            }
            else {
                context.dispatch('GET_COMPLETION', [tree.subtree[character], _.drop(word.split('')).join('')]).then((response) => {
                    //    console.log(response)
                    resolve(response);
                });
            }
        })
    },
    async FETCH_USER_DATA(context, payload) {


        context.state.userPosts = []
        await Axios
            .post(context.state.URL + "/posts/forUser",
                {
                    direction: 'backward',
                    limit: 50,
                    exclusiveFrom: null,
                    request: payload
                },
                {
                    withCredentials: true
                }
            )
            .then(response => {
                let tt = new Map(Object.entries(response.data.users));
                context.commit('SET_MAP', tt)
                console.log(response)
                for (var item of response.data.response) {
                    makeRequest(context.state, item, context.state.userPosts)
                }

            }).then(() => {

                context.state.isUserDataFetched = true;
            });
    },


    SET_ID(context, payload) {

        context.state.id = payload;
    }


}
const mutations = {
    async UPDATER(state, payload) {
        makeRequest(state, payload, state.posts)
    },
    SET_TOKEN(state, payload) { state.token = payload },
    SET_MAP(state, payload) {
        if (!state.m) {
            state.m = new Map(Array.from(payload).map(x => [parseInt(x[0]), x[1]]))
        }
        else {
            let arr = Array.from(payload).map(x => [parseInt(x[0]), x[1]])
            for (let i of arr)
                state.m.set(parseInt(i[0]), i[1])
        }
    },
    async PUSH_POST(state, payload) {

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
        // vm.$connect(socketURL, { store: self });
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
async function makeRequest(state, payload, array) {
    
    let id = payload.authorId;
    let localMap = state.m.get(id)
    array.push({
        name: localMap.firstName + " " + localMap.lastName,
        postId: payload.id,
        postBody: payload.body[0].markdown,
        authorId: id,
        num: state.columnToAdd,
        middleName: payload.middleName,
        timeCreated: payload.updated,
        tags: payload.tags
    })
    state.columnToAdd = state.columnToAdd == 0 ? 1 : 0;
    // console.log(state.posts)
}

function getValues(tree) {
    //    console.log(tree)
    let out = []
    for (let i of Object.entries(tree)) {
        if (i[1] && i[1].value)
            out.push(i[1].value)

        if (i[1])
            out.push(getValues(i[1].subtree))
        else
            out.push(getValues(i.subtree))
    }
    return _.flattenDeep(out)
}

async function makeUserRequest(item, context) {
    SET_NAME(context.state, item.authorId).then((name) => {
        context.state.columnToAdd = context.state.columnToAdd == 0 ? 1 : 0;
        context.state.userPosts.push({
            name: name.data[0].firstName + " " + name.data[0].secondName,
            postId: item.id,
            postBody: item.body[0].markdown,
            authorId: item.authorId,
            num: context.state.columnToAdd
        });
    })

}

function transformTags(array) {
    array = array.map(x => x = {
        name: x,
        code: x,
    })
    return array;
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
