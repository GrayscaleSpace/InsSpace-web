<template>
  <div class="container">
    <div class="wrapper">
      <div class="header">
        <div class="search-bar">
          <input type="text"
                 v-model="list.filters.name"
                 placeholder="请输入名称搜索"
                 :suffix-icon="'Search'"
                 clearable
                 @input="handleInput">
        </div>

        <div class="user-settings">
<!--          <img class="user-img"-->
<!--               src="https://images.unsplash.com/photo-1587918842454-870dbd18261a?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=943&q=80"-->
<!--               alt="">-->
<!--          <div class="user-name">排行</div>-->
<!--          <svg viewBox="0 0 492 492" fill="currentColor">-->
<!--            <path-->
<!--                d="M484.13 124.99l-16.11-16.23a26.72 26.72 0 00-19.04-7.86c-7.2 0-13.96 2.79-19.03 7.86L246.1 292.6 62.06 108.55c-5.07-5.06-11.82-7.85-19.03-7.85s-13.97 2.79-19.04 7.85L7.87 124.68a26.94 26.94 0 000 38.06l219.14 219.93c5.06 5.06 11.81 8.63 19.08 8.63h.09c7.2 0 13.96-3.57 19.02-8.63l218.93-219.33A27.18 27.18 0 00492 144.1c0-7.2-2.8-14.06-7.87-19.12z"></path>-->
<!--          </svg>-->
          <div class="notify">
            <div class="notification"></div>
            <svg viewBox="0 0 24 24" fill="currentColor" @click="about">
              <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M18.707 8.796c0 1.256.332 1.997 1.063 2.85.553.628.73 1.435.73 2.31 0 .874-.287 1.704-.863 2.378a4.537 4.537 0 01-2.9 1.413c-1.571.134-3.143.247-4.736.247-1.595 0-3.166-.068-4.737-.247a4.532 4.532 0 01-2.9-1.413 3.616 3.616 0 01-.864-2.378c0-.875.178-1.682.73-2.31.754-.854 1.064-1.594 1.064-2.85V8.37c0-1.682.42-2.781 1.283-3.858C7.861 2.942 9.919 2 11.956 2h.09c2.08 0 4.204.987 5.466 2.625.82 1.054 1.195 2.108 1.195 3.745v.426zM9.074 20.061c0-.504.462-.734.89-.833.5-.106 3.545-.106 4.045 0 .428.099.89.33.89.833-.025.48-.306.904-.695 1.174a3.635 3.635 0 01-1.713.731 3.795 3.795 0 01-1.008 0 3.618 3.618 0 01-1.714-.732c-.39-.269-.67-.694-.695-1.173z"/>
            </svg>
          </div>
        </div>
      </div>
      <div class="main-container">
        <img-header></img-header>
<!--        <div class="main-header anim" style="&#45;&#45;delay: 0s">-->
<!--          <ul>-->
<!--            <li>1</li>-->
<!--          </ul>-->
<!--        </div>-->
        <el-backtop :bottom="100">
          <div
              style="
        height: 100%;
        width: 100%;
        border-radius: 50%;
        background-color: var(--el-bg-color-overlay);
        box-shadow: var(--el-box-shadow-lighter);
        text-align: center;
        line-height: 40px;
        color: #1989fa;
      "
          >
            👆
          </div>
        </el-backtop>
        <div class="small-header anim" style="--delay: .3s">壁纸（{{list.total}}）</div>
        <div class="videos" v-if="list.data.length"
             v-infinite-scroll="load"
             :infinite-scroll-disabled="disabled">
          <img-item
              v-for="(item, index) in list.data"
              :data="item"
              :key="index"
              :images="list.data.map(item => item.url)"
              @reload="listGet"
          >
          </img-item>
        </div>
        <div class="empty-data" v-else>
          <el-empty description="暂无数据"></el-empty>
        </div>
        <p v-if="loadData" style="text-align: center;padding: 20px;">Loading...</p>
      </div>
    </div>

  </div>
</template>
<script lang="ts" setup>
import {useCopyText, useCtxInstance, useDeleteConfirm, useListFilter} from '@/hooks/global';
import Bucket from '@/types/Bucket';
import Image from '@/types/Image';
import {BucketInter, ImageInter, ListInter} from '@/typings/interface';
import {PageResponse} from '@/typings/req-res';
import {computed, onActivated, reactive, Ref, ref, watch} from 'vue';
import GalleryItem from './gallery-item.vue'
import {useFormat} from '@/hooks/date-time';
import DetailDialog from './DetailDialog.vue'
import {useRoute, useRouter} from 'vue-router';
import ImgItem from "@/views/template/img-item.vue";
import ImgHeader from "@/views/template/img-header.vue";
import { ElLoading } from 'element-plus'

/**
 * 实例
 */
const bucket = new Bucket()
const image = new Image()
const ctx = useCtxInstance()
const route = useRoute()
const router = useRouter()


/**
 * 变量
 */
// 列表数据
const list: ListInter<ImageInter> = reactive({
  page: 1,
  size: 36,
  total: 0,
  loading: true,
  filters: {
    img_name: '',
    bucket_id: '', // 图床
    user_id: 0, // 全部
    sort: 'updatedAt',
    order: 'desc'
  },
  data: []
})

const listGet = () => {
  // 使用 image.find 方法获取数据
  image.find({
    pageNum: list.page, // 传递当前页数
    pageSize: list.size, // 传递每页数据条数
    ...list.filters // 传递筛选条件
  }).then((res) => {
    // 设置总数据条数
    list.total = res.total;

    // 使用 useFormat 函数格式化记录的 createTime
    // const formattedCreateTime = useFormat(res.records.createTime);

    // 设置列表数据为获取到的记录，包括格式化后的 createTime
    list.data = res.records.map(record => ({
      ...record,
      createTime: useFormat(record.createTime)
    }));

    // 标记加载完成
    list.loading = false;
  });
}
listGet()
//免责声明
const about = () => {
  router.push({
    path: '/about/img-about',
  });
}
// 搜索
const handleInput = () => {
  setTimeout(() => {
    listGet()
  }, 1000)
}

const loadData = ref(false)

const load = () => {
  console.log("Loading data..."); // 添加这一行
  loadData.value = true;
  setTimeout(async () => {
    const page = list.page + 1; // 增加页数
    console.log(page)
    const size = list.size; // 保持每页数据条数不变
    image.find({
      pageNum: page, // 传递当前页数
      pageSize: size, // 传递每页数据条数
      ...list.filters // 传递筛选条件
    }).then((res) => {
      const data = res.records;
      list.data.push(...data);
      loadData.value = false;
      list.page ++;
    })
  }, 2000);
};

</script>

<style lang="scss" >
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap");

* {
  outline: none;
  box-sizing: border-box;
}

html {
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
}

img {
  max-width: 100%;
}

:root {
  --body-font: "Inter", sans-serif;
  --theme-bg: #1f1d2b;
  --body-color: #808191;
  --button-bg: #353340;
  --border-color: rgb(128 129 145 / 24%);
  --video-bg: #252936;
  --delay: 0s;
}


.container {
  //background-color: var(--theme-bg);
  //max-width: 1240px;
  //max-height: 900px;
  height: 100vh;
  display: flex;
  justify-content: center;
  overflow: hidden;
  width: 100%;
  border-radius: 20px;
  font-size: 15px;
  font-weight: 500;
  position: relative;
}

.sidebar {
  width: 220px;
  height: 100%;
  padding: 30px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition-duration: 0.2s;
  overflow-y: auto;
  overflow-x: hidden;

  .logo {
    display: none;
    width: 30px;
    height: 30px;
    background-color: #22b07d;
    flex-shrink: 0;
    color: #fff;
    align-items: center;
    border-radius: 50%;
    justify-content: center;

    &-expand {
      text-decoration: none;
      color: #fff;
      font-size: 19px;
      font-weight: 600;
      line-height: 34px;
      position: sticky;
      top: 0;

      &:before {
        content: "";
        position: absolute;
        top: -30px;
        left: 0;
        background: var(--theme-bg);
        width: 200px;
        height: 70px;
        z-index: -1;
      }
    }
  }

  &-link {
    &:hover,
    &.is-active {
      color: #fff;
      font-weight: 600;

      &:nth-child(2n + 1) {
        svg {
          background: #ff7551;
        }
      }

      &:nth-child(2n) {
        svg {
          background: #32a7e2;
        }
      }

      &:nth-child(2n + 3) {
        svg {
          background: #6c5ecf;
        }
      }
    }
  }

  &.collapse {
    width: 90px;
    border-right: 1px solid var(--border-color);

    .logo-expand,
    .side-title {
      display: none;
    }

    .logo {
      display: flex;
    }

    .side-wrapper {
      width: 30px;
    }

    .side-menu svg {
      margin-right: 30px;
    }
  }
}

@keyframes bottom {
  0% {
    transform: translateY(100px);
    opacity: 0;
  }

  100% {
    opacity: 1;
    transform: none;
  }
}

.side-menu {
  display: flex;
  flex-direction: column;

  a {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: var(--body-color);

    & + a {
      margin-top: 26px;
    }
  }

  svg {
    width: 30px;
    padding: 8px;
    border-radius: 10px;
    background-color: var(--button-bg);
    flex-shrink: 0;
    margin-right: 16px;

    &:hover {
      color: #fff;
    }
  }
}

.side-title {
  font-size: 12px;
  letter-spacing: 0.07em;
  margin-bottom: 24px;
}

.side-wrapper {
  border-bottom: 1px solid var(--border-color);
  padding: 36px 0;
  width: 145px;

  & + & {
    border-bottom: none;
  }
}

.wrapper {
  max-width: 1220px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.header {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  padding: 30px;
}

.search-bar {
  height: 34px;
  display: flex;
  width: 100%;
  max-width: 450px;

  input {
    width: 100%;
    height: 100%;
    border: none;
    background-color: var(--button-bg);
    border-radius: 8px;
    font-family: var(--body-font);
    font-size: 14px;
    font-weight: 500;
    padding: 0 40px 0 16px;
    box-shadow: 0 0 0 2px rgba(134, 140, 160, 0.02);
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 56.966 56.966' fill='%23717790c7'%3e%3cpath d='M55.146 51.887L41.588 37.786A22.926 22.926 0 0046.984 23c0-12.682-10.318-23-23-23s-23 10.318-23 23 10.318 23 23 23c4.761 0 9.298-1.436 13.177-4.162l13.661 14.208c.571.593 1.339.92 2.162.92.779 0 1.518-.297 2.079-.837a3.004 3.004 0 00.083-4.242zM23.984 6c9.374 0 17 7.626 17 17s-7.626 17-17 17-17-7.626-17-17 7.626-17 17-17z'/%3e%3c/svg%3e");
    background-size: 14px;
    background-repeat: no-repeat;
    background-position: 96%;
    color: #fff;
  }
}

.user {
  &-settings {
    display: flex;
    align-items: center;
    padding-left: 20px;
    flex-shrink: 0;
    margin-left: auto;

    svg {
      width: 10px;
      flex-shrink: 0;
      @media screen and (max-width: 575px) {
        display: none;
      }
    }

    .notify {
      position: relative;

      svg {
        width: 20px;
        margin-left: 24px;
        flex-shrink: 0;
      }

      .notification {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #ec5252;
        position: absolute;
        right: 1px;
        border: 1px solid var(--theme-bg);
        top: -2px;
        @media screen and (max-width: 575px) {
          display: none;
        }
      }
    }
  }

  &-img {
    width: 30px;
    height: 30px;
    flex-shrink: 0;
    object-fit: cover;
    border-radius: 50%;
  }

  &-name {
    color: #fff;
    font-size: 14px;
    margin: 0 6px 0 12px;
    @media screen and (max-width: 575px) {
      display: none;
    }
  }
}

.main-container {
  display: flex;
  flex-direction: column;
  padding: 0 30px 30px;
  flex-grow: 1;
  overflow: auto;
}

.anim {
  animation: bottom 0.8s var(--delay) both;
}

.main-header {
  font-size: 30px;
  color: #fff;
  font-weight: 700;
  padding-bottom: 20px;
  position: sticky;
  top: 0;
  left: 0;
  background: linear-gradient(
          to bottom,
          #1f1d2b 0%,
          #1f1d2b 78%,
          rgb(31 29 43 / 0%) 100%
  );
  z-index: 11;
}

.small-header {
  font-size: 24px;
  font-weight: 500;
  color: #fff;
  margin: 30px 0 20px;
}

.main {
  &-blogs {
    display: flex;
    align-items: center;
  }

  &-blog__author {
    display: flex;
    align-items: center;
    padding-bottom: 10px;
    justify-content: space-around;

    &.tips {
      flex-direction: column-reverse;
      align-items: flex-start;
    }
  }

  &-blog__title {
    font-size: 25px;
    max-width: 12ch;
    font-weight: 600;
    letter-spacing: 1px;
    color: #fff;
    margin-bottom: 30px;
  }

  &-blog {
    //background-image: url("https://assets.codepen.io/3364143/skate-removebg-preview.png");
    background-size: 80%;
    background-position-x: 150px;
    background-color: #31abbd;
    display: flex;
    flex-direction: column;
    width: 65%;
    padding: 30px;
    border-radius: 20px;
    align-self: stretch;
    overflow: hidden;
    position: relative;
    transition: background 0.3s;
    background-repeat: no-repeat;

    & + & {
      margin-left: 20px;
      width: 35%;
      //background-image: url(https://c0.anyrgb.com/images/1020/945/venice-beach-2018-outdoors-sport-men-jumping-desert-sunset-extreme-sports-one-person-action.jpg);
      background-color: unset;
      background-position-x: 0;
      background-size: 139%;
      filter: saturate(1.4);

      .author-img {
        border-color: rgb(255 255 255 / 75%);
        margin-top: 14px;
      }

      .author-img__wrapper svg {
        border-color: #ffe6b2;
        color: #e7bb7d;
      }

      .author-detail {
        margin-left: 0;
      }
    }

    @media screen and (max-width: 905px) {
      &,
      & + .main-blog {
        width: 50%;
        padding: 30px;
      }
      & {
        background-size: cover;
        background-position-x: center;
        background-blend-mode: overlay;
      }
    }

    &__time {
      background: rgba(21, 13, 13, 0.44);
      color: #fff;
      padding: 3px 8px;
      font-size: 12px;
      border-radius: 6px;
      position: absolute;
      right: 20px;
      bottom: 20px;
    }
  }
}

.author {
  &-img {
    width: 52px;
    height: 52px;
    border: 1px solid rgb(255 255 255 / 75%);
    padding: 4px;
    border-radius: 50%;
    object-fit: cover;

    &__wrapper {
      position: relative;
      flex-shrink: 0;

      svg {
        width: 16px;
        padding: 2px;
        background-color: #fff;
        color: #0daabc;
        border-radius: 50%;
        border: 2px solid #0daabc;
        position: absolute;
        bottom: 5px;
        right: 0;
      }
    }
  }

  &-name {
    font-size: 15px;
    color: #fff;
    font-weight: 500;
    margin-bottom: 8px;
  }

  &-info {
    font-size: 13px;
    font-weight: 400;
    color: #fff;
  }

  &-detail {
    margin-left: 16px;
  }
}

.seperate {
  width: 3px;
  height: 3px;
  display: inline-block;
  vertical-align: middle;
  border-radius: 50%;
  background-color: #fff;
  margin: 0 6px;

  &.video-seperate {
    background-color: var(--body-color);
  }
}

.videos {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 20px;
  grid-row-gap: 20px;
  @media screen and (max-width: 980px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.video {
  position: relative;
  background-color: #252936;
  border-radius: 20px;
  overflow: hidden;
  transition: 0.4s;

  &-wrapper {
    position: relative;
  }

  &-name {
    color: #fff;
    font-size: 16px;
    line-height: 1.4em;
    padding: 12px 20px 0;
    overflow: hidden;
    background-color: var(--video-bg);
    z-index: 9;
    position: relative;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  &-view {
    font-size: 12px;
    padding: 12px 20px 20px;
    background-color: var(--video-bg);
    position: relative;
  }

  &-by {
    transition: 0.3s;
    padding: 20px 20px 0px;
    display: inline-flex;
    position: relative;

    &:before {
      content: "";
      background-color: #22b07d;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      position: absolute;
      top: 26px;
      right: 5px;
    }

    &.offline:before {
      background-color: #ff7551;
    }
  }

  &-time {
    position: absolute;
    background: rgba(21, 13, 13, 0.44);
    color: rgb(255 255 255 / 85%);
    padding: 3px 8px;
    font-size: 12px;
    border-radius: 6px;
    top: 10px;
    z-index: 1;
    right: 8px;
  }

  &:hover {
    video {
      transform: scale(1.6);
      transform-origin: center;
    }

    .video-time {
      display: none;
    }

    .video-author {
      bottom: -65px;
      transform: scale(0.6);
      right: -3px;
      z-index: 10;
    }

    .video-by {
      opacity: 0;
    }
  }

  &-author {
    position: absolute;
    right: 10px;
    transition: 0.4s;
    bottom: -25px;

    svg {
      background-color: #0aa0f7;
      color: #fff;
      border-color: var(--video-bg);
    }
  }
}


.stream-area {
  display: none;
  @media screen and (max-width: 940px) {
    flex-direction: column;
    .video-stream {
      width: 100%;
    }
    .chat-stream {
      margin-left: 0;
      margin-top: 30px;
    }
    .video-js.vjs-fluid {
      min-height: 250px;
    }
    .msg__content {
      max-width: 100%;
    }
  }
}

.show {
  .stream-area {
    display: flex;
  }

  .main-header,
  .main-blogs,
  .small-header,
  .videos {
    display: none;
  }
}

.video-stream {
  width: 65%;
  object-fit: cover;
  transition: 0.3s;

  &:hover .video-js .vjs-big-play-button {
    opacity: 1;
  }
}

.video-p {
  margin-right: 12px;
  object-fit: cover;
  flex-shrink: 0;
  border-radius: 50%;
  position: relative;
  top: 0;
  left: 0;

  .author-img {
    border: 0;
  }

  &-wrapper {
    display: flex;
    align-items: center;

    .author-img {
      border: 0;
    }

    svg {
      width: 20px;
      padding: 4px;
    }

    @media screen and (max-width: 650px) {
      flex-direction: column;
      .button-wrapper {
        margin: 20px auto 0;
      }
      .video-p-detail {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .video-p {
        margin-right: 0
      }
    }
  }

  &-sub {
    font-size: 12px;
  }

  &-title {
    font-size: 24px;
    color: #fff;
    line-height: 1.4em;
    margin: 16px 0 20px;
  }

  &-subtitle {
    font-size: 14px;
    line-height: 1.5em;
    max-width: 60ch;

    & + & {
      margin-top: 16px;
    }
  }

  &-name {
    margin-bottom: 8px;
    color: #fff;
    display: flex;
    align-items: center;

    &:after {
      content: "";
      width: 6px;
      height: 6px;
      background-color: #22b07d;
      border-radius: 50%;
      margin-left: 8px;
      display: inline-block;
    }

    &.offline:after {
      background-color: #ff7551;
    }
  }
}

.video-content {
  width: 100%;
}

.button-wrapper {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.like {
  display: flex;
  align-items: center;
  background-color: var(--button-bg);
  color: #fff;
  border: 0;
  font-family: var(--body-font);
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;

  &.red {
    background-color: #ea5f5f;
  }

  svg {
    width: 18px;
    flex-shrink: 0;
    margin-right: 10px;
    padding: 0;
  }

  & + & {
    margin-left: 16px;
  }
}

.video-stats {
  margin-left: 30px;
}

.video-detail {
  display: flex;
  margin-top: 30px;
  width: 100%;
}

.chat-header {
  display: flex;
  align-items: center;
  padding: 20px 0;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  position: sticky;
  top: 0;
  background-color: #252836;
  left: 0;
  z-index: 1;
  border-bottom: 1px solid var(--border-color);

  svg {
    width: 15px;
    margin-right: 6px;
    flex-shrink: 0;
  }

  span {
    margin-left: auto;
    color: var(--body-color);
    font-size: 12px;
    display: flex;
    align-items: center;
  }
}

.chat-stream {
  flex-grow: 1;
  margin-left: 30px;
}

.chat {
  background-color: #252836;
  border-radius: 20px;
  padding: 0 20px;
  max-height: 414px;
  overflow: auto;

  &-footer {
    display: flex;
    align-items: center;
    position: sticky;
    bottom: 0;
    left: 0;
    width: calc(100% + 20px);
    padding-bottom: 12px;
    background-color: #252836;

    input {
      width: 100%;
      border: 0;
      background-color: #2d303e;
      border-radius: 20px;
      font-size: 12px;
      color: #fff;
      margin-left: -10px;
      padding: 12px 40px;
      font-weight: 500;
      font-family: var(--body-font);
      background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg width='24' height='24' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill-rule='evenodd' clip-rule='evenodd' d='M2 12C2 6.48 6.47 2 12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10C6.47 22 2 17.52 2 12zm5.52 1.2c-.66 0-1.2-.54-1.2-1.2 0-.66.54-1.2 1.2-1.2.66 0 1.19.54 1.19 1.2 0 .66-.53 1.2-1.19 1.2zM10.8 12c0 .66.54 1.2 1.2 1.2.66 0 1.19-.54 1.19-1.2a1.194 1.194 0 10-2.39 0zm4.48 0a1.195 1.195 0 102.39 0 1.194 1.194 0 10-2.39 0z' fill='%236c6e78'/%3e%3c/svg%3e");
      background-repeat: no-repeat;
      background-size: 24px;
      background-position: 8px;

      &::placeholder {
        color: #6c6e78;
      }
    }

    &:before {
      content: "";
      position: absolute;
      background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg viewBox='0 0 24 24' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M21.435 2.582a1.933 1.933 0 00-1.93-.503L3.408 6.759a1.92 1.92 0 00-1.384 1.522c-.142.75.355 1.704 1.003 2.102l5.033 3.094a1.304 1.304 0 001.61-.194l5.763-5.799a.734.734 0 011.06 0c.29.292.29.765 0 1.067l-5.773 5.8c-.428.43-.508 1.1-.193 1.62l3.075 5.083c.36.604.98.946 1.66.946.08 0 .17 0 .251-.01.78-.1 1.4-.634 1.63-1.39l4.773-16.075c.21-.685.02-1.43-.48-1.943z'/%3e%3c/svg%3e");
      background-repeat: no-repeat;
      background-size: 14px;
      background-position: center;
      width: 18px;
      height: 18px;
      background-color: #6c5ecf;
      padding: 4px;
      border-radius: 50%;
      right: 16px;
    }
  }

  &-vid {
    &__title {
      color: #fff;
      font-size: 18px;
    }

    &__container {
      margin-top: 40px;
    }

    &__wrapper {
      display: flex;
      align-items: center;
      margin-top: 26px;
    }

    &__name {
      color: #fff;
      font-size: 14px;
      line-height: 1.3em;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      overflow: hidden;
      -webkit-box-orient: vertical;
    }

    &__img {
      width: 100px;
      height: 80px;
      border-radius: 10px;
      object-fit: cover;
      object-position: right;
      margin-right: 16px;
      transition: 0.3s;

      &:hover {
        transform: scale(1.02);
      }
    }

    &__content {
      max-width: 20ch;
    }

    &__by,
    &__info {
      color: var(--body-color);
      font-size: 13px;
    }

    &__by {
      margin: 6px 0;
    }

    &__button {
      background-color: #6c5ecf;
      border: 0;
      color: #fff;
      font-size: 13px;
      margin-top: 26px;
      display: flex;
      padding: 0 10px;
      align-items: center;
      justify-content: center;
      height: 40px;
      border-radius: 10px;
      cursor: pointer;
      transition: 0.3s;

      &:hover {
        background-color: #5847d0;
      }
    }
  }
}

.message {
  display: flex;
  align-items: center;
  margin-top: 18px;

  &:last-child {
    margin-bottom: 18px;
  }

  &-container .author-img__wrapper svg {
    width: 15px;
  }
}

.msg {
  &__name {
    font-size: 13px;
  }

  &__content {
    line-height: 1.4em;
    max-width: 26ch;
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}

//player

.video-js .vjs-control-bar {
  display: flex;
  align-items: center;
}

.vjs-poster {
  background-size: 150%;
}

.video-js .vjs-control-bar {
  width: 100%;
  position: absolute;
  bottom: 14px;
  padding-left: 36px;
  left: 14px;
  width: calc(100% - 28px);
  right: 0;
  border-radius: 10px;
  height: 4em;
  background-color: #2b333f;
  background-color: rgba(43, 51, 63, 0.7);
  @media screen and (max-width: 625px) {
    padding-left: 0;
  }
}

.video-js:hover .vjs-big-play-button {
  background-color: rgba(43, 51, 63, 0.5);
}

.video-js .vjs-big-play-button {
  transition: 0.3s;
  opacity: 0;
  border: 0;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  &:hover {
    background-color: rgba(43, 51, 63, 0.7);
    border-color: transparent;
  }
}

.vjs-play-control:after {
  content: "LIVE";
  position: absolute;
  left: -66px;
  top: 7px;
  background-color: #8941e3;
  height: 24px;
  font-family: var(--body-font);
  font-size: 10px;
  padding: 0 12px 0 26px;
  display: flex;
  font-weight: 700;
  letter-spacing: 0.03em;
  align-items: center;
  border-radius: 6px;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='%23fff' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-circle'%3e%3ccircle cx='12' cy='12' r='10'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-size: 6px;
  background-position: 12px;
  @media screen and (max-width: 625px) {
    display: none;
  }
}

.vjs-menu-button-inline .vjs-menu {
  top: 4px;
}

.video-js .vjs-control:before,
.video-js .vjs-time-control {
  line-height: 40px;
}

.video-js .vjs-tech {
  object-fit: cover;
}

button.vjs-play-control.vjs-control.vjs-button {
  margin-left: 40px;
  @media screen and (max-width: 625px) {
    margin-left: 0;
  }
}

.vjs-icon-fullscreen-enter:before,
.video-js .vjs-fullscreen-control:before {
  content: "";
  position: absolute;
  display: block;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg width='20' height='20' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill-rule='evenodd' clip-rule='evenodd' d='M2.54 0h3.38c1.41 0 2.54 1.15 2.54 2.561V5.97c0 1.42-1.13 2.56-2.54 2.56H2.54C1.14 8.53 0 7.39 0 5.97V2.561C0 1.15 1.14 0 2.54 0zm0 11.47h3.38c1.41 0 2.54 1.14 2.54 2.56v3.41c0 1.41-1.13 2.56-2.54 2.56H2.54C1.14 20 0 18.85 0 17.44v-3.41c0-1.42 1.14-2.56 2.54-2.56zM17.46 0h-3.38c-1.41 0-2.54 1.15-2.54 2.561V5.97c0 1.42 1.13 2.56 2.54 2.56h3.38c1.4 0 2.54-1.14 2.54-2.56V2.561C20 1.15 18.86 0 17.46 0zm-3.38 11.47h3.38c1.4 0 2.54 1.14 2.54 2.56v3.41c0 1.41-1.14 2.56-2.54 2.56h-3.38c-1.41 0-2.54-1.15-2.54-2.56v-3.41c0-1.42 1.13-2.56 2.54-2.56z' fill='%23fff'/%3e%3c/svg%3e");
  background-size: 11px;
  background-position: center;
  background-position-y: 14px;
  background-repeat: no-repeat;
  opacity: 0.6;
}

.vjs-playback-rate .vjs-playback-rate-value {
  font-size: 1.1em;
  line-height: 3.5em;
  opacity: 0.6;
  font-weight: 700;
  font-family: var(--body-font);
}

.video-js .vjs-playback-rate {
  width: 2.2em;
}

.video-js.vjs-fluid {
  border-radius: 20px;
  overflow: hidden;
  min-height: 414px;
}

@media screen and (max-width: 735px) {
  .main-blogs {
    flex-wrap: wrap;
  }
  .main-blog,
  .main-blog + .main-blog {
    width: 100%;
  }
  .videos {
    grid-template-columns: 1fr;
  }
  .main-blog + .main-blog {
    margin-left: 0;
    margin-top: 20px;
    background-size: cover;
  }
}

@media screen and (max-width: 475px) {
  .main-blog__title {
    font-size: 20px;
  }
  .author-name {
    font-size: 14px;
  }
  .main-blog__author {
    //flex-direction: column-reverse;
    align-items: flex-start;
  }
  .author-detail {
    margin-left: 0;
  }
  .main-blog .author-img {
    margin-top: 14px;
  }
  .main-container {
    padding: 0 20px 20px;
  }
  .header {
    padding: 20px;
  }
  .sidebar.collapse {
    width: 40px;
  }
  .sidebar {
    align-items: center;
  }
  body {
    padding: 0;
  }
  .container {
    height: 100vh;
    border-radius: 0;
    max-height: 100%;
  }
}


::-webkit-scrollbar {
  width: 6px;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background-color: rgb(21 20 26 / 63%);
  border-radius: 10px;
}
</style>