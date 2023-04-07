import Vue from "vue"
import axios from "axios"
import router from "../router"
const actions = {
    // 处理登出操作
    async toLogout(context, value) {
        if (!context.state.isLogin) return Vue.prototype.$message({ message: '当前未登录', type: 'warning' })
        Vue.prototype.$confirm("是否退出登录？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
        })
        .then(async () => {
            const res = await axios.get('/logout', { params: { timestamp: Date.now() } })
            if (res.status !== 200) return
            console.log(res)
            Vue.prototype.$message({
                type: "success",
                message: "登出成功",
            });
            context.commit('setIsLogin')
            context.commit('setAccount', { account: null, profile: null })
            router.push('/')
        })
            .catch((err) => {
            console.log(err)
            Vue.prototype.$message({
                type: "info",
                message: "已取消登出",
            });
        });
        // 用户登出需要更新的状态有：isLogin、account、profile，同时还要向服务器提交登出申请
        /* const res = await axios.get('/logout')
        if (res.status == 200) {
            context.commit('setIsLogin')
            context.commit('setAccount', { account: null, profile: null })
        } else {
            console.log(res.data)
            return
        } */
    },
    // 热搜
    async getHotSearch(context, value) {
        const res = await axios.get('/search/hot/detail', { params: { timestamp: Date.now() } })
        if (res.status !== 200) return
        console.log(res.data.data)
        context.commit('setHotSearch',res.data.data)
    }
}

export default actions