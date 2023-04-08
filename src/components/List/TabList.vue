<template>
  <div id="btns">
    <button
      v-for="(str, index) in tabList"
      @click="switchTab(index)"
      :class="{ active: (tabIndex == index) }"
    >
      {{ str }}
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabIndex: 1,
    };
  },
  props: {
    tabList: {
      type: Array,
      request: true,
    },
  },
  methods: {
    switchTab(val) {
      this.tabIndex = val;
      this.$emit("tabClick", val);
    },
  },
};
</script>

<style lang="less" scoped>
    #btns{
        margin-top: 40px;
        button{
            border:none;
            background-color: rgba(0, 0, 0, 0);
            font-size: 14px;
            cursor: pointer;
            &:not(:first-child){
                margin-left: 20px;
            }
            &.active{
                font-weight: bold;
                &::after{
                    content: '';
                    display: block;
                    width: 80%;
                    height: 3px;
                    background-color: #ec4141;
                    border-radius: 2px;
                    margin: 0 auto;
                    margin-top: 4px;
                }
            }
        }
    }
</style>