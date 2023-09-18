<template>
  <!-- 下拉刷新区域 -->
  <div class="el-img" >
    <div class="playlists" >
      <!-- 顶部播放列表卡片，根据条件是否渲染 -->
<!--      <div class="top-play-list-card" v-if="topPlaylist.id"></div>-->
      <div class="playlist-cards" v-infinite-scroll="loadData"  :infinite-scroll-disabled="disabled">
        <!-- 使用ImgList组件渲染图片列表 -->
        <ImgList
            :id="item.pid"
            :img="item.thumbnail"
            :key="item.pid"
            :name="item.name"
            v-for="item in imglists"
            :datasrc="item.thumbnail"
        />
      </div>

      <!-- 加载中提示 -->
      <p v-if="imgLoading">加载中...</p>
      <!-- 没有更多数据提示 -->
      <p v-if="noMore">没有更多了</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, onUnmounted, ref} from 'vue';
import ImgList from "../components/ImgList.vue";
import axios from 'axios';

const imgUse = axios.create({
  baseURL: '/api',
});


const PAGE_SIZE = 15;
// 使用响应式变量来存储数据和状态
const count = ref(0); // 用于计数已加载页数的变量，初始为1
const imgLoading = ref(false); // 用于控制加载状态的变量
const imglists = ref([]); // 用于存储图片列表的变量
const topPlaylist = ref({}); // 顶部播放列表

// 计算是否没有更多数据
const noMore = computed(() => count.value >= 10)
const disabled = computed(() => imgLoading.value || noMore.value)

// 从服务器获取图片数据的异步函数，传入页面号作为参数
// 加载更多的处理函数
const loadData = () => {
  console.log("Loading data..."); // 添加这一行
  imgLoading.value = true;
  setTimeout(async () => {
    const res = await imgUse('/wall/smallPage', {
      params: {
        pageNum: count.value += 1,
        pageSize: PAGE_SIZE,
      },
    });
    console.log("Response:", res.data); // 添加这一行
    const data = res.data.records;
    imglists.value = [...imglists.value, ...data];
    imgLoading.value = false;
  }, 2000);
};
// 定义一个方法来检查滚动位置
// const checkScroll = () => {
//   const container = document.querySelector(".playlist-cards");
//   console.log(container)
//   if (container) {
//     // 获取容器的滚动位置
//     const scrollLeft = container.scrollLeft;
//     const containerWidth = container.clientWidth;
//     const scrollWidth = container.scrollWidth;
//
//     // 如果滚动到右侧底部
//     if (scrollLeft + containerWidth >= scrollWidth) {
//       // 调用加载数据的方法
//       loadData();
//     }
//   }
// };
</script>


<style lang="scss" scoped>
.playlists {
  padding: 12px;
  display: flex;
  align-items: center;
  flex-direction: column;

  .top-play-list-card {
    margin-bottom: 16px;
  }

  .playlist-cards {
    display: flex;
    flex-wrap: wrap;
    width: 80%;
    height: 720px;
    overflow-x: auto; /* 启用水平滚动 */
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 36px;
  }
}

/* 样式规则用于设置下拉刷新区域和加载动画的样式 */
.refresh {
  height: 100vh; /* 设置下拉刷新区域的高度，确保占满整个屏幕 */
  overflow-y: auto; /* 添加垂直滚动条 */
}

.refresh-content {
  padding: 10px;
}

.item {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
}

.loading {
  text-align: center;
  padding: 10px;
  display: block; /* 默认隐藏加载动画 */
}

/* 在屏幕宽度小于768px时应用的样式 */
@media (max-width: 767px) {
  .playlists {
    padding: 12px;
    display: flex;
    align-items: center;
    flex-direction: column;

    .top-play-list-card {
      margin-bottom: 16px;
    }

    .playlist-cards {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
    }

  }
}
</style>
