import Vue from "vue";
//引入Vuex
import Vuex from 'vuex'

import actions from './actions'
import mutations from './mutations'

//应用Vuex插件
Vue.use(Vuex)

const state = {
    isLogin: window.sessionStorage.getItem('isLogin') == 'true' ? true : false,
    // 账号信息
    account: {},
    // 用户详情
    profile: {},
    hotSearch: {},
    musicPlayList: [],
    presentMusic: [],
    presentLyric:[],
    isPlay:false
}

const getters = {

}

export default new Vuex.Store({
    actions,
    mutations,
    state,
    getters
})