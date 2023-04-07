<template>
  <div class="header-bar">
    <div class="logo">
      <a href="/">
        <span class="iconfont icon-logView"></span>
      </a>
    </div>
    <!-- 前进后退和搜索框 -->
    <div id="history">
      <button id="back" @click="goBack">
        <i class="el-icon-arrow-left"></i>
      </button>
      <button id="forward" @click="goForward">
        <i class="el-icon-arrow-right history"></i>
      </button>
      <!-- 搜索框 -->
      <div id="search">
        <div id="search-box">
          <el-input
            @focus="getFocus"
            @blur="loseBlur"
            @input="handleInput"
            placeholder="搜索"
            prefix-icon="el-icon-search"
            v-model="keywords"
            clearable
          >
          </el-input>
        </div>
        <!-- 热搜 -->
        <transition name="el-fade-in">
          <div id="relevent" v-show="isHotSearch">
            <div id="hot-search" v-show="keywords == ''">
              <div id="hot-title">热搜榜</div>
              <div id="hotSearch-list">
                <ul>
                  <li
                    v-for="(item, index) in hotSearch"
                    :key="index"
                    :class="index < 3 ? 'top-three' : ''"
                    @click="inputHotSearch(item.searchWord)"
                  >
                    <div id="hot-number">{{ index + 1 }}</div>
                    <div id="hot-item">
                      <div id="hot-song">
                        <span id="word">{{ item.searchWord }}</span>
                        <span id="score">{{ item.score }}</span>
                      </div>
                      <div id="hot-content">{{ item.content }}</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <!-- 搜索建议 -->
            <div id="suggestInfo" v-if="keywords !== ''">
              <div id="searchKeywords">
                <span>搜'{{ keywords }}'相关的结果 ></span>
              </div>
              <div id="relevent-search">
                <SuggestList v-if="suggestInfo.songs">
                  <template #title>
                    <div>
                      <i class="iconfont icon-yinle"></i><span>单曲</span>
                    </div>
                  </template>
                  <template #item>
                    <ul>
                      <li v-for="s in suggestInfo.songs" :key="s.id">
                        {{ s.name }}-{{ s.artists[0].name }}
                      </li>
                    </ul>
                  </template>
                </SuggestList>
                <SuggestList v-if="suggestInfo.artists">
                  <template #title>
                    <div><i class="el-icon-user"></i> <span>歌手</span></div>
                  </template>
                  <template #item>
                    <ul>
                      <li v-for="s in suggestInfo.artists" :key="s.id">
                        {{ s.name }}
                      </li>
                    </ul>
                  </template>
                </SuggestList>
                <SuggestList v-if="suggestInfo.albums">
                  <template #title>
                    <div>
                      <i class="iconfont icon-zhuanji"></i>
                      <span>专辑</span>
                    </div>
                  </template>
                  <template #item>
                    <ul>
                      <li v-for="a in suggestInfo.albums" :key="a.id">
                        {{ a.name }}-{{ a.artist.name }}
                      </li>
                    </ul>
                  </template>
                </SuggestList>
                <SuggestList v-if="suggestInfo.playlists">
                  <template #title>
                    <div>
                      <i class="iconfont icon-gedan"></i>
                      <span>歌单</span>
                    </div>
                  </template>
                  <template #item>
                    <ul>
                      <li v-for="p in suggestInfo.playlists" :key="p.id">
                        {{ p.name }}
                      </li>
                    </ul>
                  </template>
                </SuggestList>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <!-- 用户头像和用户名(未登录) -->
    <div class="userLogo" v-if="!isLogin">
      <div class="avator" @click="toLogin">
        <i class="el-icon-user-solid"></i>
      </div>
      <div class="username">
        <i>{{ userName }}</i>
      </div>
    </div>
    <!-- 用户头像和用户名(已登录) -->
    <div class="userLogo" v-if="isLogin">
      <div class="avator">
        <el-avatar
          :size="26"
          icon="el-icon-user-solid"
          :src="profile.avatarUrl"
        ></el-avatar>
        <!-- <img :src="profile.avatarUrl" > -->
      </div>
      <div class="username" style="cursor: pointer">
        <el-button type="text" @click="toLogout" style="color: white">{{
          profile.nickname
        }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import SuggestList from "../SuggestList/SuggestList.vue";
import axios from "axios";
import { mapState } from "vuex";
export default {
  components: { SuggestList },
  data() {
    return {
      keywords: "",
      userName: "未登录",
      isHotSearch: false,
      suggestInfo: {},
      history:[]
    };
  },
  methods: {
    handleInput(val) {
      if(!val) return
      if(this.timer){
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(async () => {
        const res = await axios.get("/search/suggest", {
          params: { keywords: val },
        });
        if (res.status !== 200) return;
        console.log(res);
        this.suggestInfo = res.data.result;
      }, 500);
    },
    inputHotSearch(value) {
      this.keywords = value;
      // this.handleInput(value)
    },
    getFocus() {
      if (this.keywords == "") {
        this.$store.dispatch("getHotSearch");
        this.isHotSearch = true;
      } else {
        this.handleInput(this.keywords.trim());
        this.isHotSearch = true;
      }
    },
    loseBlur() {
      this.isHotSearch = false;
    },
    goBack() {
      this.$router.back();
    },
    goForward() {
      this.$router.forward();
    },
    toLogin() {
      // if(!isLogin){}
      this.$router.push("/login");
    },
    toLogout() {
      this.$store.dispatch("toLogout");
    },
    async getAccount() {
      if (!this.isLogin) return;
      const res = await axios.get("/user/account");
      if (res.status !== 200) return;
      this.$store.commit("getAccount", res.data.account);
      this.getUserDetail(res.data.account.id);
    },
    async getUserDetail(id) {
      const res = await axios.get("/user/detail", { params: { uid: id } });
      if (res.status !== 200) return;
      this.$store.commit("getProfile", res.data.profile);
      console.log(res);
    },
  },
  computed: {
    ...mapState(["isLogin", "profile", "hotSearch"]),
  },
  created() {
    this.getAccount();
  },
};
</script>

<style lang="less" scoped>
.header-bar {
  position: absolute;
  top: 0;
  left: 0;
  background-color: #ec4141;
  height: 60px;
  width: 100%;
  display: flex;

  .logo {
    line-height: 60px;
    .icon-logView {
      font-size: 48px;
      color: white;
    }
  }

  #history {
    display: flex;
    margin-left: 100px;
    align-items: center;

    #back,
    #forward {
      border-radius: 50%;
      border: 0;
      height: 26px;
      width: 26px;
      background-color: rgba(217, 59, 59, 0.5);
      box-shadow: inset #d93b3b;
      color: white;
      margin-left: 10px;
      cursor: pointer;
    }
  }

  #search {
    position: relative;
    #search-box {
      margin-left: 10px;
      /deep/ .el-input {
        line-height: 60px;
        color: #fff;
        width: 200px;
        .el-input__inner {
          border-radius: 16px;
          background-color: rgba(217, 59, 59, 0.5);
          border: 0;
          height: 30px;
          color: #fff;
          font-size: 14px;
        }
      }
    }
    #relevent {
      position: absolute;
      top: 50px;
      left: 10px;
      z-index: 9999;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 1px 1px 5px #bbbbbb;
      #hot-search {
        #hot-title {
          font-size: 14px;
          line-height: 14px;
          margin: 20px auto 10px 10px;
          color: #666;
        }
        #hotSearch-list {
          width: 340px;
          min-height: 340px;
          max-height: 420px;
          overflow-y: auto;
          li {
            display: flex;
            height: 50px;
            align-items: center;
            font-size: 12px;
            cursor: pointer;
            &:hover {
              background-color: #eeeeee;
            }
            #hot-number {
              width: 40px;
              text-align: center;
              color: #c2c2c2;
            }
            #hot-item {
              #hot-song {
                #score {
                  color: rgb(194, 193, 193);
                  margin-left: 10px;
                }
              }
              #hot-content {
                color: rgb(153, 153, 153);
              }
            }
          }
          .top-three {
            #hot-number {
              color: #e13e3e;
            }
            #hot-song {
              #word {
                font-weight: bold;
              }
            }
          }
        }
      }
      #suggestInfo {
        #searchKeywords {
          display: flex;
          cursor: pointer;
          font-size: 14px;
          line-height: 14px;
          margin: 20px auto 10px 10px;
          color: #666;
        }
        #relevent-search {
          width: 340px;
          max-height: 420px;
          overflow-y: auto;
          overflow-x: auto;
          li {
            display: flex;
            height: 28px;
            align-items: center;
            font-size: 12px;
            padding-left: 20px;
            cursor: pointer;
            &:hover {
              background-color: #f2f2f2;
            }
          }
        }
      }
    }
  }

  .userLogo {
    display: flex;
    align-items: center;
    margin-left: 10px;
    .avator {
      display: flex;
      background-color: #c0c4cc;
      height: 26px;
      width: 26px;
      border-radius: 50%;
      justify-content: center;
      align-items: center;
      color: white;
      cursor: pointer;
    }
    .username {
      color: white;
      margin-left: 5px;
      cursor: default;
    }
  }
}
</style>
