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
        return async (id) => {

            const req = state.m.get(id)
            if (typeof req != "undefined") {
              
                let promise = new Promise((resolve, reject) => {
                    
                       return resolve({
                           data:{
                               userName:{
                                   firstName:req.firstName,
                                   secondName:req.secondName
                               }
                           }
                       })
                    
                })
            
                return promise 
            }
            
            const response = makeResponse(id)
            response.then(answ => {              
                state.m.set(id, {
                    firstName: answ.data.firstName, //response.data.userName.firstName,
                    secondName: answ.data.secondName //response.data.userName.secondName
                })
            }

            )
            return response

           
           


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
    try{
    return await Axios.get('https://websuck1t.herokuapp.com/users/' + id)
    }catch(exc){return makeResponse(id)}
}