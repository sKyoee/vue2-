<template>
  <div id="playlist-wrapper">
    <!-- 顶部精品歌单 -->
    <div id="boutique-show" v-if="hasHighQuality">
      <img id="background" :src="highQualityInfo.coverImgUrl" />
      <img id="front" :src="highQualityInfo.coverImgUrl+'?param=300y300'" />
      <div id="info-wrapper">
        <div id="high-icon">
          <button>
            <i class="iconfont icon-huiyuanhuangguanguanjun-xianxing"></i>
            精品歌单
          </button>
        </div>
        <div id="highInfo">
          <span>{{ highQualityInfo.name }}</span>
        </div>
      </div>
    </div>
    <!-- 中间标签导航 -->
    <div id="playlist-filtrate">
      <div id="label-selector">
        <!-- 标签选择按钮 -->
        <button @click="showCats" id="cats-btn">
          <span>{{ currentCat }}</span>
          <i class="el-icon-arrow-right"></i>
        </button>
        <!-- 标签选择页面 -->
        <div id="cats-wrapper" v-show="isShow" ref="catsBtn">
          <div id="quanbu">全部歌单</div>
          <div
            id="category-wrapper"
            v-for="(item, index) in allCats"
            :key="index"
          >
            <div id="category">
              <template v-if="index == 0">
                <div><i class="iconfont icon-diqiuquanqiu"></i>语种</div>
              </template>
              <template v-if="index == 1">
                <div><i class="iconfont icon-fengge"></i>风格</div>
              </template>
              <template v-if="index == 2">
                <div><i class="iconfont icon-kafei"></i>场景</div>
              </template>
              <template v-if="index == 3">
                <div><i class="iconfont icon-xiaolian1"></i>情感</div>
              </template>
              <template v-if="index == 4">
                <div><i class="iconfont icon-caidan"></i>主题</div>
              </template>
            </div>
            <ul id="cat-list">
              <li v-for="(c, i) in item" :key="i">
                <button
                  id="btn"
                  :class="{ active: c.name == currentCat }"
                  @click="clickCat(c.name)"
                >
                  {{ c.name }}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div id="hotcats-wrapper">
        <ul>
          <li v-for="(h, index) in hotCats" :key="index">
            <button
              id="hotcat-btn"
              :class="{ active: h.name == currentCat }"
              @click="clickCat(h.name)"
            >
              {{ h.name }}
            </button>
          </li>
        </ul>
      </div>
    </div>
    <!-- 歌单展示列表 -->
    <div id="albums-wrapper">
      <HomePageAlbumsVue v-loading="isLoading" :list="playlist"> </HomePageAlbumsVue>
    </div>
    <!-- 分页 -->
    <div id="page-selector">
      <el-pagination
        id="pages"
        background
        layout="prev, pager, next"
        :total="pageInfo.total"
        :current-page="pageInfo.currentPage"
        @current-change="changePage"
      >
      </el-pagination>
    </div>
  </div>
</template>
  </div>
</template>

<script>
import axios from "axios";
import HomePageAlbumsVue from "../components/HomePageAlbums/HomePageAlbums.vue";
export default {
  components: { HomePageAlbumsVue },
  data() {
    return {
      // 热门标签
      hotCats: [],
      // 所有标签
      allCats: [],
      // 当前选择的标签
      currentCat: "华语",
      // 标签是否展示
      isShow: false,
      // 筛选条件
      queryInfo: {
        cat: "华语",
        limit: 50,
        offset: 0,
        order: "hot",
      },
      // 当前标签的歌单数量，和所在页数
      pageInfo:{
        total:0,
        currentPage:1
      },
      // 歌单列表
      playlist: [],
      // 当前标签的精品歌单信息
      highQualityInfo: {},
      // 当前标签是否具有精品歌单
      hasHighQuality: true,
      // 是否处于加载状态
      isLoading:false
    };
  },
  methods: {
    // 设置页签跳转事件
    changePage(val){
      this.pageInfo.currentPage = val
      this.queryInfo.offset = (val-1)*50
      this.getPlayList(this.queryInfo)
      document.getElementById('route-area').scrollTop = 0
    },
    // 设置标签列表失去焦点隐藏
    offShow(e) {
      if (!this.$refs.catsBtn) return;
      let res = this.$refs.catsBtn.contains(e.target);
      if (!res) {
        this.isShow = false;
        window.removeEventListener("click", this.offShow);
      }
    },
    // 设置标签按钮展示标签列表
    showCats() {
      if (this.isShow) return;
      this.isShow = true;
      setTimeout(() => {
        window.addEventListener("click", this.offShow);
      }, 10);
    },
    // 设置标签点击事件
    clickCat(cat) {
      this.currentCat = cat;
      this.queryInfo.cat = cat;
      this.queryInfo.offset = 0
      this.pageInfo.currentPage = 1
      this.isShow = false;
      this.getPlayList(this.queryInfo);
      this.getHighQualityPlayList(1, this.currentCat);
      window.removeEventListener("click", this.offShow);
    },
    // 获取热门标签
    async getHotCats() {
      const res = await axios.get("/playlist/hot");
      if (res.data.code !== 200) return console.log("err", res.data);
      this.hotCats = Object.freeze(res.data.tags);
    },
    // 获取当前标签歌单列表
    async getPlayList({ order, cat, limit, offset }) {
      this.isLoading = true
      const res = await axios.get("/top/playlist", {
        params: { order, cat, limit, offset },
      });
      if (res.data.code !== 200) return console.log("err", res.data);
      console.log(res)
      this.pageInfo.total = res.data.total
      this.playlist = Object.freeze(res.data.playlists);
      this.isLoading = false
    },
    // 获取当前标签精品歌单的第一个歌单，用于展示在页面顶端
    async getHighQualityPlayList(limit, cat) {
      const res = await axios.get("/top/playlist/highquality", {
        params: { limit, cat },
      });
      if (res.data.code !== 200) return console.log("err", res.data);
      if (res.data.playlists.length == 0) {
        this.highQualityInfo = {};
        this.hasHighQuality = false;
      }
      this.highQualityInfo = Object.freeze(res.data.playlists[0]);
      this.hasHighQuality = true;
    },
    // 获取所有标签
    async getAllCats() {
      const res = await axios.get("/playlist/catlist");
      if (res.data.code !== 200) return console.log("err", res.data);
      // 给不同种类的标签分类
      this.allCats = [];
      for (let i = 0; i < 5; i++) {
        /* let cats = [];
        console.log('@')
        res.data.sub.forEach((item) => {
          if (item.category == i) {
            console.log(2)
            cats.push(item);
          }
        });
        this.allCats.push(cats); */
        this.allCats.push(
          Object.freeze(res.data.sub.filter((item) => item.category == i))
        );
      }
    },
  },
  created() {
    this.getPlayList(this.queryInfo);
    this.getHotCats();
    this.getHighQualityPlayList(1, this.queryInfo.cat);
    this.getAllCats();
  },
};
</script>

<style lang="less" scoped>
#playlist-wrapper {
  width: 1200px;
  #boutique-show {
    height: 200px;
    display: flex;
    align-items: center;
    overflow: hidden;
    border-radius: 10px;
    background-color: rgba(0, 0, 0, 0);
    position: relative;
    #background {
      position: absolute;
      width: 100%;
      top: -400px;
      left: 0;
      bottom: 0;
      right: 0;
      filter: blur(45px);
      z-index: 1;
    }
    #front {
      height: 80%;
      margin: 0 20px;
      border-radius: 6px;
      z-index: 2;
    }

    #info-wrapper {
      z-index: 2;
      #high-icon {
        button {
          display: block;
          height: 30px;
          border-radius: 15px;
          border: 1px solid #e7aa5a;
          background-color: rgba(0, 0, 0, 0);
          padding: 0 16px;
          color: #e7aa5a;
        }
      }
      #highInfo {
        margin-top: 10px;
        color: rgb(177, 177, 177);
      }
    }
  }

  #playlist-filtrate {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    #label-selector {
      position: relative;
      #cats-btn {
        height: 30px;
        background-color: rgba(0, 0, 0, 0);
        border: 1px solid #d8d8d8;
        font-size: 12px;
        border-radius: 15px;
        padding: 0 30px;
        cursor: pointer;
        &:hover {
          background-color: #eeeeee;
        }
      }
      #cats-wrapper {
        position: absolute;
        width: 720px;
        top: 40px;
        left: 0;
        background-color: #fff;
        z-index: 999;
        border-radius: 10px;
        box-shadow: 0 0 8px #e5e5e5;
        #quanbu {
          line-height: 80px;
          padding-left: 20px;
          font-size: 14px;
          border-bottom: 1px solid #e0e0e0;
        }
        #category-wrapper {
          display: flex;
          font-size: 14px;
          margin: 20px 0;
          #category {
            width: 120px;
            height: 26px;
            color: #c2c2c2;
            margin: 0 40px 0 20px;
            i {
              margin-right: 5px;
            }
          }
          ul {
            display: flex;
            flex-wrap: wrap;
            width: 500px;
            li {
              width: 100px;
              height: 26px;
              line-height: 26px;
              #btn {
                cursor: pointer;
                padding: 3px 8px;
                background-color: rgba(0, 0, 0, 0);
                color: #676767;
                outline: 0;
                border: 0;
                margin: 0;
                &:hover {
                  color: #ec4141;
                }
                &.active {
                  background-color: #fdf5f5;
                  color: #ec4141;
                  border-radius: 13px;
                }
              }
            }
          }
        }
      }
    }

    #hotcats-wrapper {
      ul {
        display: flex;
        li {
          height: 26px;
          line-height: 26px;
          padding: 0 10px;
          #hotcat-btn {
            padding: 5px 5px;
            outline: 0;
            border: 0;
            background-color: rgba(0, 0, 0, 0);
            cursor: pointer;
            &.active {
              background-color: #fdf5f5;
              color: #ec4141;
              border-radius: 13px;
            }
          }
        }
      }
    }
  }

  #page-selector {
    display: flex;
    justify-content: center;
  }
}
</style>