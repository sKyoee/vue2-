<template>
  <div class="outermost">
    <router-view/>
  </div>
</template>

<script>
export default {
};
</script>

<style>
html,body{
  height: 100%;
  overflow-y: hidden;
}
.outermost{
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
}
</style>
