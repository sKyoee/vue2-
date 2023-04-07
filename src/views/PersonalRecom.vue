<template>
  <div id="presonalRecom">
    <!-- 轮播图 -->
    <div id="sideshow">
      <el-carousel :interval="4000" type="card" height="200px">
        <el-carousel-item v-for="item in imgUrlList" :key="item.imageUrl">
          <img :src="item.imageUrl"/>
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 热门推荐 -->
    <h2 id="hot-recom">
      热门推荐 <i class="iconfont icon-arrow-right"></i>
    </h2>
    <!-- 游客的推荐歌单 -->
    <div class="hot-recom-albums" v-if="!isLogin">
      <HomePageAlbums v-loading="isLoading" :list="dailyRecomAlbums"></HomePageAlbums>
    </div>
    <!-- 登录后用户的推荐歌单 -->
    <div class="personal-recom-albums" v-if="isLogin">
      <HomePageAlbums v-loading="isLoading" :list="personalRecomAlbums"></HomePageAlbums>
    </div>

  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
import HomePageAlbums from '../components/HomePageAlbums/HomePageAlbums.vue'
export default {
  data() {
    return {
      imgUrlList: [],
      dailyRecomAlbums:[],
      personalRecomAlbums:[],
      isLoading:false
    };
  },
  methods: {
    async getBanner() {
      const res = await axios.get("/banner");
      if (res.status !== 200) return;
      this.imgUrlList = res.data.banners;
    },
    async getDailyRecom(){
      if(this.isLogin) return
      this.isLoading = true
      const res = await axios.get('/personalized',{params:{limit:10}})
      if(res.status !== 200) return console.log('err',res)
      console.log(res)
      this.dailyRecomAlbums = res.data.result
      this.isLoading = false
    },
    async getPersonalRecom(){
      if(!this.isLogin) return
      this.isLoading = true
      const res = await axios.get('/recommend/resource')
      if(res.status !== 200) return console.log('err',res)
      console.log(res)
      this.personalRecomAlbums = res.data.recommend
      this.isLoading = false
    }
  },
  computed: {
    ...mapState(["isLogin"]),
  },
  created() {
    this.getBanner();
    this.getDailyRecom()
    this.getPersonalRecom()
  },
  components:{HomePageAlbums}

};
</script>

<style lang='less' scoped>
#presonalRecom {
  width: 1200px;
  #sideshow {
    width: 100%;
    img {
      border-radius: 10px;
      width: 100%;
      height: 100%;
    }
  }
  #hot-recom{
    cursor: pointer;
  }
}
</style>