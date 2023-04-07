const mutations = {
    getAccount(state,value) {
        state.account = value
    },
    getProfile(state, value) {
        state.profile = value
    },
    setIsLogin(state, value) {
        state.isLogin = value
        if (state.isLogin) {
            window.sessionStorage.setItem('isLogin',true)
        } else {
            window.sessionStorage.removeItem('isLogin')
        }
    },
    logOut(state, value=null) {
        state.isLogin = value
        state.profile = value
        state.account = value
        window.sessionStorage.removeItem('isLogin')
    },
    setAccount(state, value) {
        state.account = value.account
        state.profile = value.profile
    },
    // 存储热搜
    setHotSearch(state, value) {
        state.hotSearch = value
    }
}

export default mutations