<template>
  <div>
    <header><slot name="title"></slot></header>
    <div>
      <slot name="item"></slot>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
header {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding-left: 10px;
  height: 30px;
  font-size: 12px;
  background-color: #f5f5f7;
}

</style>