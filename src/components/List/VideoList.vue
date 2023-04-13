<template>
  <div id="video-list">
    <!-- 无限滚动 -->
    <ul v-infinite-scroll="load" infinite-scroll-disabled="disabled" infinite-scroll-distance='1'>
      <li v-for="i in list">
        <!-- 其他视频 -->
        <template v-if="i.type !== 2">
          <div id="img" @click="toVideoDetail(i.data.vid)">
            <div id="playcount">
              <i class="iconfont icon-24gl-play"></i
              >{{ i.data.playTime | playCountFormat }}
            </div>
            <img v-lazy="i.data.coverUrl + '?param=320y180'"/>
            <div id="duration">{{ i.data.durationms | timeFormat }}</div>
          </div>
          <div id="title" @click="toVideoDetail(i.data.vid)">{{ i.data.title }}</div>
          <div id="artist">
            by<span @click="toUserDetail(i.data.creator.userId)">{{
              i.data.creator.nickname
            }}</span>
          </div>
        </template>
        <!-- mv需要单独设置，数据格式不同 -->
        <template v-else-if="i.type == 2">
          <div id="img" @click="toMVDetail(i.data.id)">
            <div id="playcount">
              <i class="iconfont icon-24gl-play"></i
              >{{ i.data.playCount | playCountFormat }}
            </div>
            <img v-lazy="i.data.coverUrl + '?param=320y180'"/>
            <div id="duration">{{ i.data.duration | timeFormat }}</div>
          </div>
          <div id="title" @click="toMVDetail(i.data.id)">{{ i.data.name }}</div>
          <div id="artist">
            <div id="mvLogo" style="display: inline-block">MV</div>
            <span @click="toArtistDetail(i.data.artists[0].id)">{{
              i.data.artists[0].name
            }}</span>
          </div>
        </template>
      </li>
    </ul>
    <div id="middle">
      <p v-if="loading">加载中...</p>
      <p v-if="noMore">没有更多了</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0,
      loading: false,
    };
  },
  props: {
    list: {
      type: Array,
      required: true,
    },
    more: {
      type: Boolean,
      required: true,
    },
  },
  /* watch:{
    list(){
      this.loading = false
    }
  }, */
  computed: {
    noMore() {
      return !this.more;
    },
    disabled() {
      return this.loading || this.noMore;
    },
  },
  filters: {
    playCountFormat(val) {
      if (val > 10000) {
        return Math.floor(val / 10000) + "万";
      } else {
        return val;
      }
    },
    timeFormat(val) {
      let date = new Date(val);
      let min = date.getMinutes();
      let sec = date.getSeconds();
      min = min < 10 ? "0" + min : min;
      sec = sec < 10 ? "0" + sec : sec;
      return `${min}:${sec}`;
    },
  },
  methods: {
    load() {
      console.log('load')
      this.loading = true;
      // this.$emit("loadMore");
      setTimeout(() => {
        this.$emit("loadMore");
        this.loading = false
      }, 2000);
    },
    toUserDetail(id) {
      this.$router.push(`/userdetail/${id}`);
    },
    toArtistDetail(id) {
      this.$router.push(`/artistdetail/${id}`);
    },
    toMVDetail(id) {
      this.$router.push(`/mvdetail/${id}`);
    },
    toVideoDetail(id){
      this.$router.push(`/videodetail/${id}`)
    }
  },
};
</script>

<style lang="less" scoped>
#video-list {
  margin-top: 20px;
  ul {
    width: 95%;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    li {
      width: 260px;
      margin-right: 20px;
      margin-bottom: 30px;
      #img {
        width: 260px;
        height: 150px;
        cursor: pointer;
        position: relative;
        z-index: 99;
        #playcount {
          position: absolute;
          z-index: 2;
          right: 5px;
          top: 5px;
          color: rgb(230, 230, 230);
          text-shadow: 0 0 1px #000;
          i {
            font-size: 12px;
            margin-right: 3px;
          }
        }
        img {
          height: 100%;
          width: 100%;
          border-radius: 5px;
          border: 1px solid #ddd;
          object-fit: cover;
        }
        #duration {
          position: absolute;
          right: 5px;
          bottom: 5px;
          color: rgb(255, 255, 255);
          text-shadow: 0 0 1px #000;
        }
      }
      #title {
        margin-top: 5px;
        color: #373737;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        cursor: pointer;
        &:hover {
          color: #000;
        }
      }
      #artist {
        margin-top: 3px;
        color: #cfcfcf;
        user-select: none;
        #mvLogo {
          border: 1px solid #ec4141;
          font-weight: bold;
          transform: scale(0.8);
          color: #ec4141;
          padding: 0 1px;
          border-radius: 1px;
        }
        span {
          margin-left: 5px;
          cursor: pointer;
          &:hover {
            color: #9f9f9f;
          }
        }
      }
    }
  }
  #middle{
    width: 100%;
    text-align: center;
    font-size: 16px;
  }
}
</style>