<template>
  <div id="scroll">
    <div id="video-wrapper">
      <!-- 视频 or MV -->
      <div id="tabSwitch">
        <div
          class="video"
          :class="{ active: tab == 'video' }"
          @click="tab = 'video'"
        >
          视频
        </div>
        <div class="MV" :class="{ active: tab == 'MV' }" @click="tab = 'MV'">
          MV
        </div>
      </div>
      <!-- 视频 -->
      <div id="video" v-if="tab == 'video'">
        <div id="tag-row">
          <!-- 标签弹出按钮 -->
          <div id="all-tag">
            <button id="click" @click="showTagList">
              {{ tag }}<i class="el-icon-arrow-right"></i>
            </button>
            <!-- 弹出层 -->
            <div id="show-tag" v-show="isShow" ref="allTags">
              <div id="inner-box">
                <div id="all-video">
                  <button
                    style="width: auto; padding: 0 10px"
                    :class="{ active: tag == '全部视频' }"
                    @click="clickTag('全部视频', 0)"
                  >
                    全部视频
                  </button>
                </div>
                <div id="line"></div>
                <div id="tags">
                  <ul>
                    <li v-for="t in tagList">
                      <button
                        :class="{ active: tag == t.name }"
                        @click="clickTag(t.name, t.id)"
                      >
                        {{ t.name }}
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div id="hot-tag">
            <ul>
              <li v-for="t in hotTag">
                <button
                  @click="clickTag(t.name, t.id)"
                  :class="{ active: tag == t.name }"
                >
                  {{ t.name }}
                </button>
              </li>
            </ul>
          </div>
        </div>

        <VideoList
          :list="videoList"
          :more="isMore"
          @loadMore="load"
        ></VideoList>
      </div>
    </div>
    <el-backtop target="#scroll"></el-backtop>
  </div>
</template>

<script>
import { get } from "../request/index";
import VideoList from "../components/List/VideoList.vue";
export default {
  components: { VideoList },
  data() {
    return {
      tab: "video",
      tag: "全部视频",
      hotTag: [],
      tagList: [],
      tagId: 0,
      offset: 0,
      isShow: false,
      videoList: [],
      isMore: false,
      isFirst: true,
    };
  },
  watch: {
    tagId(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.videoList = [];
        this.isFirst = true;
      }
    },
  },
  methods: {
    // 获取全部标签
    async getTagList() {
      const res = await get("/video/group/list");
      console.log(res);
      this.tagList = Object.freeze(res.data);
    },
    // 获取热门标签
    async getTagCategory() {
      const res = await get("/video/category/list");
      console.log(res);
      this.hotTag = Object.freeze(res.data);
    },
    // 获取相应标签的视频
    async getVideo() {
      if (!this.tagId) {
        const res = await get("/video/timeline/all", { offset: this.offset });
        console.log("video", res);
        if (this.isFirst) {
          this.isFirst = false;
          this.videoList = res.datas;
          if (this.videoList.length == 0) {
            this.$message.error("暂无推荐视频，请稍后再试");
          }
        } else {
          this.videoList.push(...res.datas);
        }
        this.isMore = res.hasmore;
      } else {
        console.log(1);
        const res = await get("/video/group", {
          id: this.tagId,
          offset: this.offset,
        });
        console.log("tagsVideo", res);
        if (this.isFirst) {
          this.videoList = res.datas;
          this.offset += 1;
          const res2 = await get("/video/group", {
            id: this.tagId,
            offset: this.offset,
          });
          console.log('res2',res2)
          this.videoList.push(...res2.datas);
          this.isFirst = false;
        } else {
          this.videoList.push(...res.datas);
        }
        this.isMore = res.hasmore;
      }
    },
    // 触发无限滚动的回调函数
    load() {
      this.offset += 1;
      if (this.isMore) this.getVideo();
    },
    // 标签点击
    clickTag(name, id) {
      this.tag = name;
      this.tagId = id;
      this.isShow = false;
      this.getVideo();
    },
    // 展示全部标签
    showTagList() {
      if (!this.isShow) {
        this.isShow = true;
        setTimeout(() => {
          window.addEventListener("click", this.offShow);
        }, 10);
      }
    },
    // 取消展示
    offShow(e) {
      if (!this.$refs.allTags) return;
      let res = this.$refs.allTags.contains(e.target);
      if (!res) {
        this.isShow = false;
        window.removeEventListener("click", this.offShow);
      }
    },
  },
  created() {
    this.getTagList();
    this.getTagCategory();
    this.getVideo();
  },
};
</script>

<style lang="less" scoped>
#scroll {
  height: 100%;
  width: 100%;
  overflow-y: scroll;
}
#video-wrapper {
  width: 1200px;
  margin: 0 auto;
  #tabSwitch {
    margin-top: 20px;
    font-size: 16px;
    display: flex;
    align-items: center;
    div {
      margin-right: 40px;
      color: #373737;
      cursor: pointer;
      &:hover {
        color: #000;
      }
      &.active {
        font-weight: bold;
        font-size: 20px;
        &::after {
          content: "";
          display: block;
          width: 90%;
          margin: 0 auto;
          margin-top: 2px;
          height: 3px;
          background-color: #ec4141;
        }
      }
    }
  }

  #video {
    margin-top: 20px;
    #tag-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      #all-tag {
        position: relative;
        #click {
          border: 1px solid #d8d8d8;
          background-color: rgba(0, 0, 0, 0);
          height: 32px;
          width: 100px;
          font-size: 14px;
          border-radius: 15px;
          cursor: pointer;
          &:hover {
            background-color: #f2f2f2;
          }
        }
        #show-tag {
          height: 500px;
          width: 650px;
          box-shadow: 0 0 5px #e6e6e6;
          position: absolute;
          z-index: 999;
          background-color: #fff;
          top: 40px;
          border-radius: 10px;
          overflow-y: scroll;
          #inner-box {
            width: 610px;
            margin: 0 auto;
            button {
              border: none;
              width: 100px;
              height: 32px;
              font-size: 12px;
              background-color: rgba(0, 0, 0, 0);
              border-radius: 16px;
              cursor: pointer;
              &:hover {
                color: #ec4141;
              }
              &.active {
                color: #ec4141;
                background-color: #fcebeb;
              }
            }
            #all-video {
              margin-top: 30px;
            }
            #line {
              width: 100%;
              height: 1px;
              background-color: #e5e5e5;
              margin-top: 15px;
            }
            #tags {
              margin-top: 20px;
              ul {
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                li {
                  width: 100px;
                  text-align: center;
                  height: 50px;
                }
              }
            }
          }
        }
      }
      #hot-tag {
        ul {
          display: flex;
          li {
            display: flex;
            &:not(:first-child)::before {
              content: "";
              display: block;
              height: 70%;
              width: 1px;
              margin: auto 5px;
              background-color: #e7e7e7;
            }
            button {
              border: none;
              background-color: rgba(0, 0, 0, 0);
              color: #676767;
              padding: 2px 10px;
              &:hover {
                color: #373737;
              }
              &.active {
                color: #ec4141;
                background-color: #fcebeb;
                border-radius: 15px;
              }
            }
          }
        }
      }
    }
  }
}
</style>