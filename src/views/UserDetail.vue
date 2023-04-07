<template>
  <div id="scroll">
    <div id="userdetail-wrapper" v-if="isLoading">
      <div id="user-info">
        <!-- 头像 -->
        <div id="user-avator">
          <img :src="userDetail.profile.avatarUrl + '?param=300y300' " />
        </div>
        <!-- 头像右侧信息 -->
        <div id="netease-info">
          <!-- 昵称、等级、性别 -->
          <div id="specific-info">
            <div id="nickname">
              <span>{{ userDetail.profile.nickname }}</span>
            </div>
            <div id="level-gender">
              <div id="flex-left">
                <div id="level">
                  <span>Lv{{ userDetail.level }}</span>
                </div>
                <div
                  class="gender"
                  id="man"
                  v-if="userDetail.profile.gender == 1"
                >
                  <i>♂</i>
                </div>
                <div
                  class="gender"
                  id="women"
                  v-if="userDetail.profile.gender == 2"
                >
                  <i>♀</i>
                </div>
              </div>
              <div id="flex-right">
                <div v-if="account.id == id">
                  <button class="btn btn-white" @click="toUserEdit">
                    <i class="el-icon-edit"></i>编辑个人信息
                  </button>
                </div>
                <div v-else>
                  <button class="btn btn-white">
                    <i class="el-icon-message"></i> 发私信
                  </button>
                  <button class="btn btn-white mleft-10" @click="follow">
                    <template v-if="!followed">
                      <i class="el-icon-plus"></i> 关注
                    </template>
                    <template v-else>
                      <i class="el-icon-check"></i> 已关注
                    </template>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- 动态、关注、粉丝 -->
          <div id="netease-cloud">
            <div id="count">
              <div id="number">{{ userDetail.profile.eventCount }}</div>
              <div id="text">动态</div>
            </div>
            <div id="count">
              <div id="number">{{ userDetail.profile.follows }}</div>
              <div id="text">关注</div>
            </div>
            <div id="count">
              <div id="number">{{ userDetail.profile.followeds }}</div>
              <div id="text">粉丝</div>
            </div>
          </div>
          <div id="introduction">
            <div id="location" v-if="userArea">
              所在地区:
              <span>{{ userArea }}</span>
            </div>
            <div id="self-intro">
              个人介绍:
              <span v-if="userDetail.profile.signature">{{
                userDetail.profile.signature
              }}</span>
              <span v-else>暂无介绍</span>
            </div>
          </div>
        </div>
      </div>
      <div id="switch">
        <button
          :class="{ isActive: tabClick == 'created' }"
          @click="clickBtn('created')"
        >
          创建的歌单
        </button>
        <button
          :class="{ isActive: tabClick == 'collected' }"
          @click="clickBtn('collected')"
        >
          收藏的歌单
        </button>
      </div>
      <div id="playlist-area">
        <HomePageAlbums
          v-if="tabClick == 'created' && createdList.length != 0"
          :list="createdList"
        ></HomePageAlbums>
        <HomePageAlbums
          v-else-if="tabClick == 'collected' && collectList.length != 0"
          :list="collectList"
        ></HomePageAlbums>
      </div>
      <div
        id="reminder"
        v-if="tabClick == 'created' && createdList.length == 0"
      >
        用户没有创建的歌单或已隐藏
      </div>
      <div
        id="reminder"
        v-if="tabClick == 'collected' && collectList.length == 0"
      >
        用户没有收藏的歌单或已隐藏
      </div>
    </div>
    <el-backtop target="#scroll"></el-backtop>
  </div>
</template>

<script>
import axios from "axios";
const province = require("@/json/province.json");
const city = require("@/json/city.json");
import HomePageAlbums from "../components/HomePageAlbums/HomePageAlbums.vue";
import { mapState } from "vuex";
export default {
  components: { HomePageAlbums },
  data() {
    return {
      userDetail: [],
      userPlayList: [],
      tabClick: "created",
      isLoading: true,
    };
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
    followed(){
      return this.userDetail.profile.followed
    },
    userArea() {
      const p = this.userDetail.profile.province;
      const c = this.userDetail.profile.city;
      if (p && c) {
        return this.getArea(p, c);
      } else {
        return "";
      }
    },
    // 用户创建的歌单
    createdList() {
      return this.userPlayList.filter(
        (item) => item.userId == this.$route.params.id
      );
    },
    // 用户收藏的歌单
    collectList() {
      let arr = this.userPlayList.filter(
        (item) => item.userId != this.$route.params.id
      );
      return arr ? arr : [];
    },
    ...mapState(["isLogin","account"]),
  },
  methods: {
    // 获取用户信息
    async getUserDetail(uid) {
      this.isLoading = false;
      const res = await axios.get("/user/detail", { params: { uid } });
      if (res.data.code !== 200) return;
      console.log(res.data);
      this.userDetail = Object.freeze(res.data);
      this.isLoading = true;
    },
    // 获取用户歌单
    async getUserPlayList(uid, offset = 0, limit = 100) {
      console.log(uid);
      const res = await axios.get("/user/playlist", {
        params: { uid, offset: offset * limit, limit },
      });
      // if(res.data.code !== 200)
      console.log("playList", res.data);
      if (this.userPlayList.length == 0) {
        this.userPlayList = res.data.playlist;
      } else {
        this.userPlayList.push(...Object.freeze(res.data.playlist));
      }

      if (res.data.more) {
        offset += 1;
        this.getUserPlayList(uid, offset);
      } else {
        console.log("userPlayList", this.userPlayList);
      }
    },
    // 获取地区信息
    getArea(_province, _city) {
      const provinceObj = province.find((item) => item.c == _province);
      const cityObj = city.find((item) => item.c == _city);
      const specialProvince = [
        1000000, 110000, 120000, 500000, 310000, 810000, 820000, 710000,
      ];
      if (specialProvince.find((item) => item == provinceObj.c))
        return `${provinceObj.n}`;
      if (cityObj.n) return `${provinceObj.n} ${cityObj.n}`;
      // return `${provinceObj.n}`
    },
    // 关注
    async follow(){
      if(!this.isLogin) return this.$message.error('需要登录');
      const t = this.followed ? 0 : 1
      const res = await axios.get('/follow',{params:{id:this.id,t}})
      console.log(res)
      if (res.code !== 200) return this.$message.error(res?.data?.blockText || '操作失败')
      this.$message.success(this.followed ? '取关成功' : '关注成功')
      this.followed = !this.followed
    },
    // 切换
    clickBtn(str) {
      this.tabClick = str;
    },
  },
  created() {
    this.getUserDetail(this.$route.params.id);
    this.getUserPlayList(this.$route.params.id);
  },
};
</script>

<style lang="less" scoped>
::v-deep .el-backtop {
  color: #ec4141;
}

#scroll {
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  #userdetail-wrapper {
    width: 1200px;
    margin: 0 auto;
    #user-info {
      margin-top: 20px;
      display: flex;
      #user-avator {
        width: 190px;
        height: 190px;
        img {
          height: 100%;
          border-radius: 50%;
        }
      }
      #netease-info {
        margin-left: 40px;
        width: 100%;
        #specific-info {
          &::after {
            content: "";
            display: block;
            width: 100%;
            height: 1px;
            background-color: #e5e5e5;
          }
          #nickname {
            font-size: 20px;
            font-weight: bold;
          }
          #level-gender {
            display: flex;
            height: 36px;
            align-items: center;
            margin: 5px 0;
            justify-content: space-between;
            #flex-left{
              display: flex;
              #level {
              height: 18px;
              line-height: 18px;
              border-radius: 8px;
              background-color: #f0f0f0;
              span {
                display: block;
                font-size: 20px;
                transform: scale(0.5);
              }
            }
            .gender {
              width: 18px;
              height: 18px;
              line-height: 18px;
              text-align: center;
              margin-left: 5px;
              border-radius: 50%;
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
            #flex-right{
              button{
                background-color: rgba(0, 0, 0, 0);
                font-size: 14px;
                padding: 5px 10px;
                margin-left: 10px;
                border: 1px solid #ddd;
                border-radius: 14px;   
                cursor: pointer;   
                &:hover{
                  background-color: #f2f2f2;
                }          
              }
              .el-icon-plus{
                color: #ec4141;
              }
            }
            
          }
        }
        #netease-cloud {
          display: flex;
          text-align: center;
          margin-top: 15px;

          #count {
            padding: 0 30px;
            border-left: 1px solid #e5e5e5;
            &:first-child {
              padding-left: 0;
              border: none;
            }
            #number {
              font-size: 20px;
            }
            #text {
              color: #676767;
            }
          }
        }
        #introduction {
          margin-top: 10px;
          user-select: none;
          div {
            font-size: 14px;
            margin: 6px 0;
            span {
              color: #676767;
            }
          }
          #sns {
            display: flex;
          }
        }
      }
    }
    #switch {
      margin-top: 40px;
      margin-left: 20px;
      button {
        border: none;
        outline: none;
        background-color: rgba(0, 0, 0, 0);
        font-size: 14px;
        margin-right: 15px;
        cursor: pointer;
        &.isActive {
          font-size: 16px;
          font-weight: bold;
          margin-right: 13px;
          &::after {
            content: "";
            display: block;
            width: 90%;
            height: 2px;
            border-radius: 1px;
            background-color: #ec4141;
            margin: 0 auto;
          }
        }
      }
    }
    #playlist-area {
      margin-top: 20px;
    }
    #reminder {
      margin-left: 20px;
      font-size: 14px;
    }
  }
}
</style>