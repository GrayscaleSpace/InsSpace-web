<template>
<!--  <banner/>-->
  <router-view></router-view>
</template>

<script lang="ts" setup>
import key from 'keymaster'

import {nextTick, watch} from 'vue';
import useUserStore from './store/user';
import Banner from "./views/index.vue";

/**
 * 实例
 */
const userStore = useUserStore()


/**
 * 监听器
 */
watch(() => userStore.user_habits.data.shortKey, (val) => {
  nextTick(() => {
    // // 回调函数返回 false 以阻止浏览器默认事件行为
    // key('control + a', () => {
    //   console.log('绑定成功额')
    //   return false
    // })

    val && val.forEach(item => {
      console.log(item.value.toLowerCase())
      key(item.value.toLowerCase(), () => {
        console.log('绑定成功额')
        return false
      })
    })
  })
}, {
  immediate: true,
  deep: true
})
</script>

<style lang="scss">

:root {
  --body-font: "Inter", sans-serif;
  --theme-bg: #1f1d2b;
  --body-color: #808191;
  --button-bg: #353340;
  --border-color: rgb(128 129 145 / 24%);
  --video-bg: #252936;
  --delay: 0s;
}


body {
  font-family: var(--body-font);
  color: var(--body-color);
  //background-image: url("https://images.unsplash.com/photo-1445251836269-d158eaa028a6?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1951&q=80");
  //background-image: url(https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1950&q=80);
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-blend-mode: color-dodge;
  background-color: rgba(18, 21, 39, 0.86);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 1em 2em;
  width: 100%;
  height: 100vh;
  overflow: hidden;

  &:before {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
            163deg,
            rgba(31, 29, 43, 1) 21%,
            rgba(31, 29, 43, 0.3113620448179272) 64%
    );
    opacity: 0.4;
    content: "";
  }
}
// @import 'reset.css';
//@import '@/styles/font.scss';

html {
  box-sizing: border-box;
}

*, *:before, *:after {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

p, h1, h2, h3, h4, h5, h6 {
  margin: 0;
}

.container {
  width: 100%;
  height: 100%;
  overflow: auto;
  //background: $bgcolor-main;
  // padding: 10px;
}

.user-info-popover {
  top: 1px !important;
  right: -5px !important;
}
</style>