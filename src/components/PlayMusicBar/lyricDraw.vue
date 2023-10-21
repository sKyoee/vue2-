<template>
  <div class="container">
    <div class="top">
      <i class="el-icon-arrow-down" @click="$emit('close')"></i>
    </div>
    <div class="lyric-content">
      <div class="title">
        <div class="m-name">{{ musicDetail.musicName }}</div>
        <div class="m-artist">{{ musicDetail.artistName }}</div>
      </div>
      <div class="lyric-wrap">
        <div class="img-wrap">
          <img
            class="changzheng"
            src="../../assets/img/changzhen.png"
            @click="handleActive"
            :class="{ active: isActive }"
          />
          <div class="border" ref="border">
            <img
              class="picUrl"
              :class="{ active: isActive }"
              :src="musicDetail.musicPic || picUrl"
            />
          </div>
        </div>
        <div class="lyric">
          <ul>
            <li
              v-for="(item, i) in lyric"
              :key="item.time"
              class="liLyric"
              :class="{ liActive: index == i }"
            >
              {{ item.lyric }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { mapState } from "vuex";
export default {
  //   props: ["musicDetail"],
  props: {
    musicDetail: {
      default: [],
    },
    lyric: {
      default: [],
    },
    musicTime: {
      default: 0,
    },
  },
  emits: ["close"],
  watch: {
    musicTime(newValue, oldValue) {
      console.log(newValue, oldValue);
      this.lyric.forEach((item, index) => {
        if (item.time <= newValue + 0.5) {
          this.index = index;
          requestAnimationFrame(() => {
            let li = document.querySelector(".liActive");
            li.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          });
        } else {
          item.active = false;
        }
      });
    },
  },
  methods: {
    show() {
      console.log(this.musicDetail);
    },
    handleActive() {
      this.isActive = !this.isActive;
    },
  },
  // computed: {
  //   ...mapState({
  //     lyrics: (state) => state.presentLyric,
  //   }),
  // },
  data() {
    return {
      picUrl: "/img/music.jpg",
      isActive: false,
      index: -1,
    };
  },
};
</script>

<style lang="less" scoped>
.container {
  padding: 10px 30px;
  box-sizing: border-box;
  background-color: rgba(248, 246, 247, 1);
  .top {
    height: 30px;
    line-height: 30px;
    cursor: pointer;
    i {
      font-size: 20px;
    }
  }
  .lyric-content {
    box-sizing: border-box;
    padding: 0 20%;
    overflow: auto;
    margin-top: 20px;
    .title {
      text-align: center;
      .m-name {
        font-size: 30px;
        margin-bottom: 10px;
      }
      .m-artist {
        font-size: 16px;
      }
    }

    .lyric-wrap {
      display: flex;
      .img-wrap {
        position: relative;
        .changzheng {
          position: absolute;
          width: 120px;
          left: 48%;
          cursor: pointer;
          transition: all 0.5s;
          transform-origin: 12px 10px;

          &.active {
            transform: rotate(25deg);
          }
        }
        .border {
          margin-top: 50px;
          height: 260px;
          width: 260px;
          border-radius: 50%;
          background-color: rgb(40, 40, 40);
          display: flex;
          justify-content: center;
          align-items: center;
          box-sizing: border-box;
          border: 6px solid rgba(#c4c4c4, 1);
        }
        .picUrl {
          height: 200px;
          width: 200px;
          border-radius: 50%;
          &.active {
            animation: rotate 20s linear infinite;
          }
          @keyframes rotate {
            0% {
              transform: rotate(0);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        }
      }

      .lyric {
        text-align: center;
        ul {
          width: 600px;
          height: 400px;
          margin-top: 40px;
          margin-left: 40px;
          overflow: auto;
          font-size: 14px;
          color: rgb(130, 130, 130);
          li {
            height: 40px;
            line-height: 30px;
            transition: all 0.3s;
            &.liActive {
              font-size: 20px;
              color: black;
              font-weight: bold;
            }
          }
        }
      }
    }
  }
}
</style>
