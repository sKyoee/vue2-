<template>
  <div class="bottom">
    <!-- 左边 -->
    <div class="img-name">
      <img v-show="!presentMusic.musicPic" src="../../assets/img/music.jpg" />
      <img
        v-show="presentMusic.musicPic"
        :src="presentMusic.musicPic"
        @click="musicDrawer = true"
        alt=""
      />
      <div class="ml-10">
        <div class="font-14">{{ presentMusic.musicName || "未知歌名" }}</div>
        <!-- <marquee direction="left" width="150"><span class="font-14">{{presentMusic.musicName || '未知歌名'}}</span></marquee> -->
        <div class="artist-name">
          {{ presentMusic.artistName || "未知歌手名" }}
        </div>
      </div>
    </div>
    <!-- 中间 -->
    <div id="progress-bar">
      <div class="play-btn">
        <button><i class="iconfont icon-liebiaoshunxu"></i></button>
        <button><i class="iconfont icon-shangyishou"></i></button>
        <button class="play" @click="playMusic">
          <i v-if="!isPlay" class="iconfont icon-bofang"></i>
          <i v-else class="iconfont icon-zanting"></i>
        </button>
        <button><i class="iconfont icon-xiayishou"></i></button>
        <button @click="likeMusic"><i class="iconfont icon-aixin"></i></button>
      </div>
      <!-- 进度条 -->
      <div class="block">
        <div style="color: #9f9f9f">{{ musicTime | timeFormat }}</div>
        <el-slider
          v-model="musicTime"
          :show-tooltip="false"
          :disabled="disabled"
          :max="duration"
          @change="changeProgress"
        ></el-slider>
        <!-- 音频 -->
        <audio ref="audioRef" :src="presentMusic.musicUrl" autoplay></audio>
        <div style="color: #9f9f9f">{{ duration | timeFormat }}</div>
      </div>
    </div>
    <!-- 右边 -->
    <div id="setting">
      <button><i class="el-icon-download"></i></button>
      <button class="volume-control">
        <div class="volume-bar">
          <div class="block">
            <el-slider
              v-model="volume"
              :show-tooltip="false"
              vertical
              height="180px"
            >
            </el-slider>
          </div>
        </div>
        <i
          v-if="!isMuted"
          class="iconfont icon-shengyin"
          @click="clickToMute(false)"
        ></i>
        <i
          v-else
          class="iconfont icon-shengyinguanbi"
          @click="clickToMute(true)"
        ></i>
      </button>
      <button @click="drawer = true">
        <i class="iconfont icon-liebiaoshunxu"></i>
      </button>

      <el-drawer title="当前播放" :visible.sync="drawer">
        <div id="top">
          <div style="color: #cfcfcf">共0首</div>
          <div class="clear-playlist">清空列表</div>
        </div>
        <div class="line"></div>
        <div id="playList">
          <div class="no-song" style="color: #cfcfcf">
            你还没有添加任何歌曲！
          </div>
        </div>
      </el-drawer>
      <el-drawer
        direction="btt"
        :visible.sync="musicDrawer"
        size="100%"
        :show-close="false"
        :withHeader="false"
      >
        <lyricDraw
          :musicDetail="presentMusic"
          :lyric="presentLyric"
          @close="musicDrawer = false"
          :musicTime="musicTime"
        />
      </el-drawer>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import lyricDraw from './lyricDraw.vue'
export default {
  components:{lyricDraw},
  data() {
    return {
      isMuted: false,
      musicTime: 0,
      volume: 30,
      v: 0,
      drawer: false,
      musicDrawer: false,
      disabled: true,
      duration: 0,
      timer: {},
    };
  },
  computed: {
    ...mapState(["isLogin", "musicPlayList", "presentMusic","presentLyric", "isPlay"]),
  },
  filters: {
    timeFormat(val) {
      if (val == 0) {
        return "00:00";
      } else {
        let time = new Date(val * 1000);
        let min = time.getMinutes();
        let sec = time.getSeconds();
        min = min < 10 ? "0" + min : min;
        sec = sec < 10 ? "0" + sec : sec;
        return `${min}:${sec}`;
      }
    },
  },
  watch: {
    volume(newValue) {
      if (newValue <= 0) {
        this.isMuted = true;
        this.$refs.audioRef.volume = 0;
      } else {
        this.isMuted = false;
        this.$refs.audioRef.volume = newValue / 100;
      }
    },
    isPlay(newValue) {
      this.disabled = false;
      if (newValue == true) {
        if (this.timer) {
          clearInterval(this.timer);
          this.timer = setInterval(() => {
            this.musicTime = +this.$refs.audioRef.currentTime.toFixed(2);
          }, 500);
        }
      } else if (newValue == false) {
        clearInterval(this.timer);
      }
    },
    musicTime(newValue) {
      if (newValue == this.duration) {
        this.$store.commit("setisPlay", false);
        clearInterval(this.timer);
      }
    },
  },
  methods: {
    likeMusic() {
      if (!this.isLogin) {
        this.$message.error("需要登录");
      }
    },
    // 音乐的播放与暂停
    playMusic() {
      if (this.presentMusic.musicUrl) {
        if (this.isPlay) {
          this.$refs.audioRef.pause();
          this.$store.commit("setisPlay", false);
        } else {
          this.$refs.audioRef.play();
          this.$store.commit("setisPlay", true);
        }
      }
    },
    // 音量的静音
    clickToMute(value) {
      if (value == false) {
        this.v = this.volume;
        this.volume = 0;
        this.isMuted = value;
      } else if (value == true) {
        this.volume = this.v;
        this.isMuted = value;
      }
    },
    //
    changeProgress(val) {
      clearInterval(this.timer);
      this.$refs.audioRef.currentTime = val;
      console.log(val)
      this.timer = setInterval(() => {
        this.musicTime = Math.ceil(this.$refs.audioRef.currentTime);
      }, 1000);
    },
    setTime(value) {
      this.musicTime = value
    }
  },
  mounted() {
    this.$refs.audioRef.volume = this.volume / 100;
    // this.duration = this.$refs.audioRef.Duration
    this.$refs.audioRef.oncanplay = (e) => {
      console.log(e.target.duration);
      this.duration = Math.ceil(e.target.duration);
    };
    
  },
};
</script>

<style lang="less" scoped>
button {
  border: none;
  outline: none;
  background-color: rgba(0, 0, 0, 0);
}
.bottom {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 80px;
  border-top: 1px solid #e0e0e0;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.img-name {
  height: 48px;
  margin-left: 20px;
  display: flex;
  align-items: center;
  img {
    height: 100%;
    border-radius: 5px;
  }
  .ml-10 {
    margin-left: 10px;
  }
  .font-14 {
    font-size: 14px;
    margin-bottom: 5px;
    width: 150px;
    white-space: nowrap;
    overflow: hidden;
    cursor: pointer;
  }
  .artist-name {
    cursor: pointer;
  }
}
#progress-bar {
  width: 450px;
  .play-btn {
    display: flex;
    justify-content: center;
    button {
      margin: 0 15px;
      cursor: pointer;
      &:hover {
        color: #ec4141;
      }
      &.play {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: #f4f4f4;
        &:hover {
          background-color: #e5e5e5;
        }
      }
      i {
        font-size: 16px;
      }
    }
  }
  .block {
    display: flex;
    align-items: center;
    user-select: none;
    ::v-deep .el-slider {
      width: 400px;
      margin: 0 10px;
      .el-slider__runway {
        height: 2px;
      }
      .el-slider__bar {
        height: 2px;
        background-color: #ec4141;
      }
      .el-slider__button-wrapper {
        width: 32px;
        height: 32px;
      }
      .el-slider__button {
        width: 10px;
        height: 10px;
        border: none;
        background-color: #ec4141;
      }
    }
  }
}
#setting {
  margin-right: 20px;
  button {
    margin: 0 10px;
    cursor: pointer;
    i {
      font-size: 24px;
    }
    &.volume-control {
      position: relative;
      &:hover .volume-bar {
        display: block;
      }
      .volume-bar {
        position: absolute;
        top: -200px;
        left: -40%;
        border: 1px solid #ddd;
        background-color: white;
        border-radius: 5px;
        display: none;
        &:hover {
          display: block;
        }
        .block {
          margin: 10px 0;
          ::v-deep .el-slider {
            .el-slider__runway {
              width: 6px;
            }
            .el-slider__bar {
              width: 6px;
              background-color: #ec4141;
            }
            .el-slider__button {
              width: 10px;
              height: 10px;
              border: none;
              background-color: #ec4141;
            }
          }
        }
      }
    }
  }
  ::v-deep .el-drawer {
    .el-drawer__header {
      font-size: 14px;
      span {
        user-select: none;
      }
    }
    #top {
      margin: 0 auto;
      width: 85%;
      display: flex;
      justify-content: space-between;
      cursor: default;
      .clear-playlist {
        cursor: pointer;
        color: #507daf;
        &:hover {
          color: #0b58b0;
        }
      }
    }
    .line {
      width: 85%;
      height: 1px;
      background-color: #f2f2f2;
      margin: 20px auto;
    }
    #playList {
      .no-song {
        height: 200px;
        line-height: 200px;
        width: 100%;
        font-size: 16px;
        text-align: center;
        user-select: none;
      }
    }
  }
}
</style>
