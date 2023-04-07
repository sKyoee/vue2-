<template>
  <div id="artisalbum-wrapper">
    <div id="img-wrapper">
      <slot></slot>
    </div>
    <div id="song-list">
      <div id="title">
        <span style="user-select: none">热门50首</span>
        <div id="play-collect">
          <i class="el-icon-video-play"></i>
          <i class="el-icon-folder-add"></i>
        </div>
      </div>
      <div id="songs">
        <el-table
          :data="songList"
          style="width: 100%"
          empty-text="当前没有音乐哦"
          size="mini"
          :show-header="false"
          tooltip-effect="light"
        >
          <el-table-column width="40">
            <template slot-scope="item">
              <div style="text-align: center; color: #909399; cursor: default">
                {{
                  item.$index < 9 ? "0" + (item.$index + 1) : item.$index + 1
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column width="30">
            <template>
              <div id="like-music" style="text-align: center">
                <i class="iconfont icon-aixin"></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="音乐标题" show-overflow-tooltip>
            <template slot-scope="item">
              <span style="cursor: default;color:#343434">{{ item.row.name }}</span>
              <span
                v-if="item.row.fee == 1"
                id="tag"
                style="color: #fe672e; border-color: #fe672e"
                >VIP</span
              >
              <span v-if="item.row.sq" id="tag">SQ</span>
              <span v-if="item.row.mv !== 0" id="mv"
                >MV<i class="el-icon-caret-right"></i
              ></span>
            </template>
          </el-table-column>

          <el-table-column label="时长" >
            <template slot-scope="item">
              <div style="color: #909399; user-select: none">
                {{ item.row.dt | dtFormat }}
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div id="show-all" @click="showAll" v-if="!isShow && songs.length > 10" >
          <span>查看全部{{songs.length}}首></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShow:false
    }
  },
  props: {
    songs: {
      type: Array,
      required: true,
    },
  },
  computed:{
    songList(){
      if(!this.isShow){
        return this.songs.slice(0,10)
      } else {
        return this.songs
      }
    }
  },
  methods: {
    showAll(){
      this.isShow = true
    }
  },
  filters: {
    dtFormat(val) {
      let duration = new Date(val);
      let min = duration.getMinutes();
      let sec = duration.getSeconds();
      min = min < 10 ? "0" + min : min;
      sec = sec < 10 ? "0" + sec : sec;
      return min + ":" + sec;
    },
  },
};
</script>

<style lang="less" scoped>
::v-deep .el-table {
  .cell {
    padding: 0 5px;
  }
  tbody {
    tr {
      &:nth-child(odd) {
        background-color: #f9f9f9;
      }
      &:hover > td {
        background-color: #f0f1f2;
        transition: 0s;
      }
      td {
        border: none;
        #like-music {
          i {
            color: #909399;
            cursor: pointer;
            &:hover {
              color: #000;
            }
          }
        }
        .el-tooltip {
          #tag,
          #mv {
            display: inline-block;
            font-size: 12px;
            transform: scale(0.9);
            line-height: 1;
            color: #ec4141;
            border: 1px solid #ec4141;
            padding: 0 2px;
            border-radius: 2px;
            margin-left: 5px;
            cursor: default;
          }
          #mv {
            cursor: pointer;
            &:hover {
              opacity: 0.8;
            }
          }
        }
      }
      #artists {
        cursor: pointer;
        &::after {
          display: inline;
          margin: 3px;
          content: "/";
        }
        &:last-child::after {
          content: "";
        }
        &:hover {
          color: #000;
        }
      }
      #albums {
        cursor: pointer;
        &:hover {
          color: #000;
        }
      }
    }
  }
}

#artisalbum-wrapper {
  display: flex;
  margin-top: 20px;
  width: 100%;
  margin-bottom: 50px;
  #img-wrapper {
    min-width: 0;
    width: 200px;
    img {
      height: auto;
      max-width: 100%;
      border-radius: 6px;
      border: 1px solid #ddd;
    }
  }
  #song-list {
    margin-left: 60px;
    width: 100%;
    #title {
      font-size: 16px;
      font-weight: bold;
      display: flex;
      width: 100%;
      span {
        color: #373737;
      }
      #play-collect {
        margin-left: 20px;
        font-size: 20px;
        color: #666;
        display: flex;
        i {
          cursor: pointer;
        }
        i:first-child {
          display: flex;
        }
        i:first-child::after {
          content: "";
          display: block;
          margin: auto 10px;
          width: 1px;
          height: 50%;
          background-color: #e6e6e6;
        }
      }
      
    }
    #songs{
      margin-top: 10px;
      width: 100%;
      #show-all{
        width: 100%;
        height: 30px;
        background-color: #f9f9f9;
        text-align: right;
        line-height: 30px;
        color: #9b9b9b;
        cursor: pointer;
        span{
          margin-right: 30px;
        }
        &:hover{
          color: #656565;
        }
      }
    }
  }
}
</style>