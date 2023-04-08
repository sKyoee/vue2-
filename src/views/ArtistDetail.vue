<template>
  <div id="scroll">
    <div id="artist-wrapper" v-if="isShow">
      <div id="artist-info">
        <!-- 图片 -->
        <div id="img-wrapper">
          <img v-if="homepage" v-lazy="userInfo.avatarUrl + '?param=240y240'" />
          <img v-else v-lazy="artistDetail.cover + '?param=240y240'" />
        </div>
        <!-- 信息 -->
        <div id="detail-info">
          <div id="head">
            <div id="name">{{ artistDetail.name }}</div>
            <!-- 别名 -->
            <div id="alias" v-if="artistDetail.alias.length !== 0">
              {{ artistDetail.alias.join("；") }}
            </div>
          </div>
          <div id="middle">
            <div id="collect">
              <button><i class="el-icon-folder-add"></i> 收藏</button>
              <!-- 
              <span v-if="!isSub"><i class="el-icon-folder-add"></i> 收藏</span>
              <span v-else><i class="el-icon-folder-checked"></i> 已收藏</span> -->
            </div>
            <div id="personal-page" v-if="homepage">
              <button @click="toUser(userInfo.userId)">
                <i class="el-icon-user"></i>个人主页
              </button>
            </div>
          </div>
          <div id="foot">
            <span>单曲数：{{ artistDetail.musicSize }}</span>
            <span class="margin-left"
              >专辑数：{{ artistDetail.albumSize }}</span
            >
            <span class="margin-left">MV数：{{ artistDetail.mvSize }}</span>
          </div>
        </div>
      </div>
      <TabList
        :tabList="['专辑', 'MV', '歌手详情', '相似歌手']"
        @tabClick="tabClick"
      />
      <template v-if="component == 'album'">
        <TopF :songs="top50">
          <img src="../assets/img/top50.png" />
        </TopF>
        <div id="album-list" v-if="hotAlbums.length !== 0">
          <AlbumList v-for="item in hotAlbums" :id="item.id"></AlbumList>
        </div>
      </template>
      <template v-if="component == 'MV'">
        <MVList :id="this.id"></MVList>
      </template>
      <template v-if="component == 'detail'">
        <div id="artist-des" v-if="artistDes.length !== 0">
          <div class="text-wrapper" v-for="(i, index) in artistDes">
            <div class="title">{{ i.ti }}</div>
            <p class="text" v-for="p in i.txt">{{p}}</p>
          </div>
        </div>
        <div id="no-description" v-else>
          暂无介绍
        </div>
      </template>
      <template v-if="component == 'similar-singer'">
        
      </template>
    </div>
  </div>
</template>

<script>
import TabList from "../components/List/TabList.vue";
import TopF from "../components/ArtistAlbum/TopFif.vue";
import AlbumList from "../components/ArtistAlbum/AlbumList.vue";
import MVList from "../components/List/MVList.vue";
import HomePageAlbums from '../components/HomePageAlbums/HomePageAlbums.vue';
import { get } from "../request/index";

export default {
  components: { TabList, TopF, AlbumList, MVList,HomePageAlbums },
  data() {
    return {
      artistDetail: {},
      artistDes: [],
      homepage: false,
      userInfo: {},
      component: "similar-singer",
      isShow: true,
      top50: [],
      hotAlbums: [],
      isLoading: false,
    };
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
  },
  watch:{
    artistDes() {
      this.artistDes.forEach((item)=>{
        item.txt = item.txt.split('\n')
      })
    },
  },
  filters: {
    txtFormat(val) {
      let p = val.join("\n");
      for (i in p) {
      }
    },
  },
  methods: {
    // 歌手详情
    async getArtistDetail(id) {
      this.isShow = false;
      const res = await get("/artist/detail", { id });
      if (res.code !== 200) return;
      console.log("Detail", res.data);
      this.artistDetail = Object.freeze(res.data.artist);
      if (res.data.user) {
        this.homepage = true;
        this.userInfo = Object.freeze(res.data.user);
      }
      this.isShow = true;
    },
    // 歌手描述
    async getArtistDes(id) {
      const res = await get("/artist/desc", { id });
      if (res.code !== 200) return;
      console.log("Desc", res);
      this.artistDes = Object.freeze(res.introduction);
    },
    // 跳转个人主页
    toUser(id) {
      this.$router.push(`/userdetail/${id}`);
    },
    // 自定义事件回调
    tabClick(val) {
      switch (val) {
        case 0:
          this.component = "album";
          break;
        case 1:
          this.component = "MV";
          break;
        case 2:
          this.component = "detail";
          break;
        case 3:
          this.component = "similar-singer";
          break;
        default:
          console.log("未匹配");
      }
    },
    // 获取歌手热门50首歌曲
    async getArtistTopSong(id) {
      const res = await get("/artist/top/song", { id });
      if (res.code !== 200) return;
      console.log("top50", res);
      this.top50 = Object.freeze(res.songs);
    },
    // 获取歌手专辑
    async getArtistAlbum(id, offset = 0, limit = 100) {
      const res = await get("/artist/album", { id, limit, offset });
      if (res.code !== 200) return;
      console.log("artistAlbum", res);
      this.hotAlbums.push(...Object.freeze(res.hotAlbums));
      if (res.more) {
        offset += 100;
        this.getArtistAlbum(this.id, offset);
      }
    },
  },
  created() {
    this.getArtistDetail(this.id);
    this.getArtistDes(this.id);
    this.getArtistTopSong(this.id);
    this.getArtistAlbum(this.id);
  },
};
</script>

<style lang="less" scoped>
#scroll {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  #artist-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    #artist-info {
      display: flex;
      margin-top: 30px;
      #img-wrapper {
        width: 180px;
        height: 180px;
        img {
          height: 100%;
          border-radius: 10px;
          border: 1px solid #d3d3d3;
        }
      }
      #detail-info {
        margin-left: 20px;
        width: 100%;
        #head {
          #name {
            font-size: 20px;
            font-weight: bold;
          }
          #alias {
            margin-top: 8px;
            font-size: 14px;
          }
        }
        #middle {
          display: flex;
          margin-top: 8px;
          font-size: 14px;
          button {
            border: 1px solid #ddd;
            background-color: rgba(0, 0, 0, 0);
            padding: 6px 15px;
            border-radius: 20px;
            cursor: pointer;
            &:hover {
              background-color: #f2f2f2;
            }
          }
          #personal-page {
            margin-left: 10px;
          }
        }
        #foot {
          margin-top: 10px;
          font-size: 14px;
          user-select: none;
          .margin-left {
            margin-left: 20px;
          }
        }
      }
    }

    #artist-des {
      margin-top: 20px;
      font-size: 14px;
      line-height: 30px;
      .text-wrapper {
        margin-bottom: 20px;
        .title {
          font-weight: bold;
        }
        .text {
          text-indent: 2em;
          color: #676767;
        }
      }
    }
    #no-description{
      height: 100px;
      line-height: 100px;
      text-align: center;
    }
  }
}
</style>