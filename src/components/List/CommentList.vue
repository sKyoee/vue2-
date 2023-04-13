<template>
  <div id="comment">
    <div id="add-comment">
      <el-input
        type="textarea"
        v-model="text"
        :rows="3"
        maxlength="140"
        show-word-limit
        resize="none"
      >
      </el-input>
      <div id="btn-wrapper">
        <button id="btn-comment" @click="addComment">评论</button>
      </div>
    </div>
    <div id="comment-list">
      <div id="hot-comment-wrapper" v-if="hotCommentList.length">
        <div id="comment-hot">精彩评论</div>
        <ul id="hot">
          <li v-for="(h, index) in hotCommentList" :key="index">
            <div id="avatar-img" @click="toUserDetail(h.user.userId)">
              <img v-lazy="h.user.avatarUrl + '?param=200y200'" />
            </div>
            <div id="comment-detail">
              <div id="user-comment">
                <span id="userName" @click="toUserDetail(h.user.userId)"
                  >{{ h.user.nickname }}：</span
                >
                <span id="content">{{ h.content }}</span>
              </div>

              <!-- 回复 -->
              <div id="replied" v-if="h.beReplied.length !== 0">
                <span
                  id="userName"
                  @click="toUserDetail(h.beReplied[0].user.userId)"
                  >@{{ h.beReplied[0].user.nickname }}：</span
                >
                <span id="content">{{ h.beReplied[0].content }}</span>
              </div>
              <div id="special">
                <div id="comment-time">
                  {{ h.time | timeFormat }}
                </div>
                <div id="icon" @click="giveLike">
                  <i class="iconfont icon-good"></i>
                  <span> {{ h.likedCount }}</span>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div id="comment-latest">最新评论</div>
      <ul id="latest">
        <li v-for="(c, index) in commentList" :key="index">
          <div id="avatar-img" @click="toUserDetail(c.user.userId)">
            <img :src="c.user.avatarUrl + '?param=100y100'" />
            <div id="identify" v-if="c.user.avatarDetail">
              <img
                :src="c.user.avatarDetail.identityIconUrl + '?param=100y100'"
              />
            </div>
          </div>
          <div id="comment-detail">
            <div id="user-comment">
              <span id="userName" @click="toUserDetail(c.user.userId)"
                >{{ c.user.nickname }}：</span
              >
              <span id="content">{{ c.content }}</span>
            </div>
            <!-- 回复 -->
            <div id="replied" v-if="c.beReplied.length !== 0">
              <span
                id="userName"
                @click="toUserDetail(c.beReplied[0].user.userId)"
                >@{{ c.beReplied[0].user.nickname }}：</span
              >
              <span id="content">{{ c.beReplied[0].content }}</span>
            </div>
            <div id="special">
              <div id="comment-time">
                {{ c.time | timeFormat }}
              </div>
              <div id="icon" @click="giveLike">
                <i class="iconfont icon-good" style="margin-right: 5px"></i
                >{{ c.likedCount }}
              </div>
            </div>
          </div>
        </li>
      </ul>
      <div id="paging">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="60"
          :total="totalComment"
          @current-change="changeCurrentPage"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import backTop from "../../api/backTop";
import { get } from "../../request/index";
export default {
  data() {
    return {
      queryCommentInfo: {
        limit: 40,
        offset: 0,
      },
      text: "",
      commentList: [],
      hotCommentList: [],
      totalComment: 0,
    };
  },
  props: {
    id: {
      required: true,
    },
    isLogin: {
      type: Boolean,
    },
    type: {
      type: String,
    },
  },
  methods: {
    // 获取歌单评论
    async getComment(id, { limit, offset }) {
      if (this.type == "album") {
        const res = await get("/comment/album", {
          id,
          limit,
          offset: offset * limit,
        });
        console.log("album", res);
        this.commentList = Object.freeze(res.comments);
        this.hotCommentList = Object.freeze(res.hotComments);
      } else if (this.type == "mv") {
        const res = await get("/comment/mv", {
          id,
          limit,
          offset: offset * limit,
        });
        console.log("mvComment", res);
        this.commentList = Object.freeze(res.comments);
        if (res.hotComments) {
          this.hotCommentList = Object.freeze(res.hotComments);
        }
        this.totalComment = res.total;
      } else if(this.type == 'video') {
        const res = await get('/comment/video',{
          id,
          limit,
          offset: offset * limit,
        })
        console.log('videoComment',res)
        this.commentList = Object.freeze(res.comments)
        if (res.hotComments) {
          this.hotCommentList = Object.freeze(res.hotComments);
        }
      } else {
        const res = await axios.get("/comment/playlist", {
          params: { id, limit, offset: offset * limit },
        });
        if (res.data.code !== 200) return;
        console.log('comment',res.data);
        this.commentList = Object.freeze(res.data.comments);
        this.totalComment = res.data.total;
      }
    },
    // 获取热门评论
    async getHotComment(id, type) {
      if (this.type == "album" || this.type == "mv" || this.type == 'video') {
        return;
      }
      const res = await axios.get("/comment/hot", {
        params: { id, type, limit: 10 },
      });
      if (res.data.code !== 200) return;
      console.log("hotComment", res.data);
      this.hotCommentList = Object.freeze(res.data.hotComments);
    },
    // 添加评论
    addComment() {
      if (!this.isLogin) {
        this.$message({
          message: "需要登录！",
          type: "error",
        });
        return;
      }
      if (!this.text.trim()) {
        this.$message({
          message: "写点东西吧，内容不能为空哦！",
          type: "warning",
        });
      }
    },
    // 评论分页
    changeCurrentPage(val) {
      this.queryCommentInfo.offset = val - 1;
      this.getComment(this.id, this.queryCommentInfo);
      backTop(this.$parent.$refs.scroll, 200);
    },
    // 点赞评论
    giveLike() {
      if (!this.isLogin) {
        this.$message({
          message: "需要登录！",
          type: "error",
        });
        return;
      }
    },
    // 跳转用户详情页面
    toUserDetail(id) {
      this.$router.push(`/userdetail/${id}`);
    },
  },
  filters: {
    timeFormat(val) {
      let date = new Date(val);
      let year = date.getFullYear();
      let month = date.getMonth() * 1 + 1;
      let day = date.getDate();
      let hour = date.getHours();
      let min = date.getMinutes();
      hour = hour < 10 ? "0" + hour : hour;
      min = min < 10 ? "0" + min : min;
      if (Date.now() - val < 86400000) {
        return "昨天 " + hour + ":" + min;
      } else {
        return `${year}年${month}月${day}日 ${hour}:${min}`;
      }
    },
  },
  created() {
    this.getComment(this.id, this.queryCommentInfo);
    this.getHotComment(this.id, 2);
  },
};
</script>

<style lang="less" scoped>
#comment {
  margin-top: 5px;
  #add-comment {
    #btn-wrapper {
      position: relative;
      margin-top: 10px;
      #btn-comment {
        position: absolute;
        right: 0;
        border: 1px solid #d8d8d8;
        border-radius: 30px;
        outline: none;
        background-color: rgba(0, 0, 0, 0);
        width: 60px;
        height: 30px;
        cursor: pointer;
        &:hover {
          background-color: #f2f2f2;
        }
      }
    }
  }

  #comment-list {
    margin-top: 40px;

    #replied {
      background-color: #f4f4f4;
      padding: 10px;
      border-radius: 5px;
      margin-bottom: 8px;
      line-height: 20px;
      #userName {
        color: #507daf;
        cursor: pointer;
      }
    }

    li {
      display: flex;
      padding: 20px 0;
      border-bottom: 1px solid #f2f2f2;
      #avatar-img {
        position: relative;
        cursor: pointer;
        width: 40px;
        height: 40px;
        img {
          height: 100%;
          border-radius: 50%;
          border: 1px solid #dddddd;
        }
        #identify {
          position: absolute;
          height: 35%;
          width: 35%;
          bottom: 0;
          right: 0;
          img {
            height: 100%;
          }
        }
      }
      #comment-detail {
        margin-left: 10px;
        width: 100%;
        #user-comment {
          margin-bottom: 8px;
          line-height: 20px;
          #userName {
            color: #507daf;
            cursor: pointer;
            &:hover {
              color: #0b58b0;
            }
          }
        }

        #special {
          display: flex;
          justify-content: space-between;
          align-items: center;
          #comment-time {
            height: 20px;
            color: #9f9f9f;
          }
          #icon {
            font-size: 12px;
            color: #666;
            cursor: pointer;
            &:hover {
              color: #333;
            }
          }
        }
      }
    }

    #comment-hot {
      font-size: 16px;
      margin: 10px 0;
      cursor: default;
    }

    #comment-latest {
      font-size: 16px;
      margin: 10px 0;
      cursor: default;
    }

    #paging {
      display: flex;
      justify-content: center;
      margin-top: 10px;
    }
  }
}
</style>