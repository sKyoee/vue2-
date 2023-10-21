<template>
  <div class="abcd" id="collector-wrapper" v-loading="isLoading">
    <ul>
      <li v-for="(s, index) in subscribers" :key="index">
        <div id="avator">
          <img v-lazy="s.avatarUrl + '?param=300y300'" @click="toUserDetail(s.userId)"/>
        </div>
        <div id="user-info">
          <div id="nickName">
            <div id="user-nickName" @click="toUserDetail(s.userId)">
              <span>{{ s.nickname }}</span>
            </div>
            <div class="gender" id="man" v-if="s.gender == 1">
              <i>♂</i>
            </div>
            <div class="gender" id="women" v-if="s.gender == 2">
              <i>♀</i>
            </div>
          </div>
          <div id="signature" v-if="s.signature">
            <span>{{ s.signature }}</span>
          </div>
        </div>
      </li>
    </ul>
    <div id="paging">
      <el-pagination
        background
        :page-size="60"
        layout="prev, pager, next"
        :total="total"
        @current-change="currentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import backTop from "../../api/backTop"
export default {
  data() {
    return {
      queryInfo: {
        limit: 60,
        offset: 0,
      },
      subscribers: [],
      total: 0,
      isLoading: false,
    };
  },
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  methods: {
    // 跳转用户详情页面
    toUserDetail(id){
      this.$router.push(`/userdetail/${id}`)
    },
    // 获取收藏者
    async getCollector(id, { limit, offset }) {
      this.isLoading = true;
      const res = await axios.get("/playlist/subscribers", {
        params: { id, limit, offset: offset * limit },
      });
      if (res.data.code !== 200) return;
      console.log(res.data);
      this.subscribers = Object.freeze(res.data.subscribers);
      this.total = res.data.total;
      this.isLoading = false;
    },
    // 分页跳转
    currentChange(val) {
      this.isLoading = true;
      this.queryInfo.offset = val - 1;
      this.getCollector(this.id, this.queryInfo);
      backTop(this.$parent.$refs.scroll)
    },
    // 封装跳转到页面顶部函数
    /* backTop() {
      let height = 0
      this.timer = setInterval(() => {
        if (this.$parent.$refs.scroll.scrollTop <= 0) {
          clearInterval(this.timer);
          return;
        } else {
          height += 6
          // 是父组件在滚动
          this.$parent.$refs.scroll.scrollTop -= height
          console.log(1)
        }
      }, 10);
    }, */
  },
  created() {
    this.getCollector(this.id, this.queryInfo);
  },
};
</script>

<style lang="less" scoped>
#collector-wrapper {
  margin-bottom: 50px;
  ul {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    li {
      display: flex;
      width: 280px;
      align-items: center;
      margin-bottom: 30px;
      margin-left: 10px;
      #avator {
        height: 100px;
        width: 100px;
        cursor: pointer;
        img {
          height: 100%;
          border-radius: 50%;
        }
      }
      #user-info {
        flex: 1;
        margin-left: 14px;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        #nickName {
          font-size: 14px;
          height: 30px;
          line-height: 30px;
          display: flex;
          align-items: center;
          color: #373737;
          #user-nickName {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            cursor: pointer;
            &:hover {
              color: #000;
            }
          }
          .gender {
            width: 18px;
            height: 18px;
            line-height: 18px;
            text-align: center;
            border-radius: 50%;
            margin-left: 5px;
            font-size: 12px;
            user-select: none;
          }
          #man {
            color: #359ccf;
            background-color: #c0f3ff;
          }
          #women {
            color: #e64887;
            background-color: #ffcde8;
          }
        }
        #signature {
          line-height: 30px;
          height: 30px;
          user-select: none;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
  #paging {
    display: flex;
    justify-content: center;
  }
}
</style>