<template>
  <div class="login-page">
    <div id="login-box">
      <div id="title">二维码登录</div>
      <div id="netnease">
        打开
        <a href="https://music.163.com/#/download" target="_blank"
          >网易云音乐手机端</a
        >
        扫码登录
      </div>
      <div id="qr-wrapper">
        <img :src="imgSrc" />
        <div id="overdue" @click="getKey" v-show="code == 800">
          <i class="el-icon-refresh-right"></i>
        </div>
      </div>
      <div id="state">
        <span>状态：{{ message }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      imgSrc: "",
      message: "",
      key: "",
      code: "",
    };
  },
  methods: {
    async getKey() {
      const res = await axios.get("/login/qr/key", {
        params: { timestamp: Date.now() },
      });
      if (res.status !== 200) return;
      this.key = res.data.data.unikey;
      this.createQr(res.data.data.unikey);
    },
    async createQr(key, qrimg = true) {
      const res = await axios.get("/login/qr/create", {
        params: { key, qrimg, timestamp: Date.now() },
      });
      if (res.status !== 200) return;
      this.imgSrc = res.data.data.qrimg;
      this.checkQr(this.key);
    },
    async checkQr(key) {
      const res = await axios.get("login/qr/check", {
        params: { key, timestamp: Date.now() },
      });
      this.message = res.data.message;
      this.code = res.data.code;
      if (res.data.code == 801 || res.data.code == 802) {
        this.timer = setTimeout(() => {
          this.checkQr(this.key);
        }, 5000);
      } else if (res.data.code == 803) {
        this.message = res.data.message;
        this.$store.commit("setIsLogin",true)
        this.$router.push("/");
      } else if(res.data.code == 800){
        clearInterval(this.timer)
      }
      console.log(res);
    },
  },
  created() {
    this.getKey();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>

<style lang="less" scoped>
.login-page {
  width: 100%;
  height: 100%;
  background-image: url("../assets/img/login.jpg");
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  #login-box {
    width: 500px;
    height: 600px;
    background-color: #fff;
    border-radius: 10px;
    padding: 65px 55px 54px 55px;
    #title {
      font-size: 30px;
      text-align: center;
      padding-bottom: 70px;
      margin-top: 100px;
    }
    #netnease {
      text-align: center;
      font-size: 14px;
      a {
        color: blue;
      }
    }
    #qr-wrapper {
      width: 200px;
      height: 200px;
      margin: 2px auto;
      position: relative;
      img {
        width: 100%;
      }
      #overdue {
        position: absolute;
        font-size: 40px;
        font-weight: bold;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        display: flex;
        width: 100%;
        height: 100%;
        background-color: rgba(87, 86, 86, 0.8);
        color: #000;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
    }
    #state {
      text-align: center;
    }
  }
}
</style>
