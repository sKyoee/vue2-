import VueRouter from "vue-router";
import DiscoverMusic from '../views/DiscoverMusic.vue'
import PersonalReacom from '../views/PersonalRecom.vue'
import Login from '../views/Login.vue'
import Layout from '../views/Layout.vue'
import PlayList from '../views/PlayList.vue'
import RankingList from '../views/RankingList.vue'
import SingerList from '../views/SingerList.vue'
import NewMusic from '../views/NewMusic.vue'
import PlayListDetail from '../views/PlayList/PlayListDetail.vue'
import UserDetail from "../views/UserDetail.vue"
import Album from "../views/Album.vue"

const router = new VueRouter({
    mode: 'hash',
    routes: [
        {
            path: '/',
            component: Layout,
            redirect: '/discovermusic',
            children: [
                {
                    path: '/discovermusic',
                    component: DiscoverMusic,
                    redirect: '/discovermusic/personalrecom',
                    children: [
                        { path: 'personalrecom', component: PersonalReacom, meta: { title: '个性推荐' } },
                        { path: 'playlist', component: PlayList, meta: { title: '歌单' } },
                        { path: 'ranking', component: RankingList, meta: { title: '排行榜' } },
                        { path: 'singer', component: SingerList, meta: { title: '歌手' } },
                        { path: 'latestmusic',component:NewMusic, meta: { title: '最新音乐' } },
                    ]
                },
                {
                    path: '/playlistdetail/:id',
                    component: PlayListDetail,
                    meta:{title:'歌单'}
                },
                {
                    path: '/userdetail/:id',
                    component: UserDetail,
                    meta:{title:'用户详情'}
                },
                {
                    path: 'album/:id',
                    component: Album,
                    meta:{title:'专辑'}
                },
                {
                    path: '/artistdetail/:id',
                    component: () => import(/* webpackChunckName:'artistDetail' */'../views/ArtistDetail.vue'),
                    meta:{title:'歌手'}
                },
                {
                    path: '/mvdetail/:id',
                    component: () => import(/* webpackChunckName:'mvDetail'*/'../views/MVDetail.vue'),
                    props:true,
                    meta:{title:'MV'}
                },
                {
                    path: '/vedio',
                    component: () => import(/* webpackChunckName:'video'*/'../views/Video.vue'),
                    meta:{title:'视频'}
                },
                {
                    path: '/videodetail/:id',
                    component: () => import(/*webpackChunckName:'videodetail'*/'../views//VideoDetail.vue'),
                    props:true,
                    meta:{title:'视频'}
                }
            ]
        },
        {
            path: '/login',
            component: Login
        }
    ]
})

// 配置全局路由后置守卫，设置路由器标题
router.afterEach((to, from) => {
    if (to.meta.title) {
        document.title = to.meta.title
    }
})



export default router