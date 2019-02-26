import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
Vue.use(Vuex)

//const m = new Map()

const state = {
    m: new Map()

}

const getters = {
    GET_BY_ID(state) {
        return (id) => {

            return new Promise((resolve, reject) => {

                // let req = getUser(id, state)
                getUser(id, state).then((response) => {
                  
                    var d = {
                        data: [{
                            response
                        }]
                    }

                    //  console.log(d)
                    resolve(d)
                }).catch(() => {
                    
                    let response = makeResponse(id)
                    response.then(answ => {
                        //  console.log(answ)
                        state.m._c.set(id, {
                            firstName: answ.data[0].firstName, //response.data.userName.firstName,
                            secondName: answ.data[0].secondName, //response.data.userName.secondName
                            id: answ.data[0].id
                        })

                    }).catch((error) => {
                        // console.log(id)
                    })
                    // console.log(response)
                    resolve(response)
                })
             //   if (typeof req !== "undefined") {
                    // var d = {
                    //     data: [{
                    //         req
                    //     }]
                    // }

                    // //  console.log(d)
                    // resolve(d)
               // }

                // const response = makeResponse(id)
                // response.then(answ => {
                //     //  console.log(answ)
                //     state.m.set(id, {
                //         firstName: answ.data[0].firstName, //response.data.userName.firstName,
                //         secondName: answ.data[0].secondName, //response.data.userName.secondName
                //         id: answ.data[0].id
                //     })

                // }).catch((error) => {
                //     // console.log(id)
                // })
                // // console.log(response)
                // resolve(response)
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
    return await Axios.post('https://valera-denis.herokuapp.com/users/', [id], { withCredentials: true })
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