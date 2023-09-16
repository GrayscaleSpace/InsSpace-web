<template>
  <!-- 下拉刷新区域 -->
  <div class="el-img" v-infinite-scroll="loadData" :infinite-scroll-disabled="disabled">
    <div class="playlists" ref="scrollContainer">
      <!-- 顶部播放列表卡片，根据条件是否渲染 -->
      <div class="top-play-list-card" v-if="topPlaylist.id"></div>
      <div class="playlist-cards">
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
      <p v-if="loading">加载中...</p>
      <!-- 没有更多数据提示 -->
      <p v-if="noMore">没有更多了</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import ImgList from "../components/ImgList.vue";
import axios from 'axios';

const imgUse = axios.create({
  baseURL: '/api',
});

const PAGE_SIZE = 15; // 每页加载的图片数量
const MAX_PAGES = 2; // 最多加载的页数

const count = ref(1); // 用于计数已加载页数的变量，初始为1
const loading = ref(false); // 用于控制加载状态的变量
const imglists = ref([]); // 用于存储图片列表的变量
const page = ref({
  pageSize: PAGE_SIZE,
  currentPage: 1,
  total: 0,
});
const topPlaylist = ref({}); // 顶部播放列表

const noMore = computed(() => {
  return count.value >= MAX_PAGES; // 如果加载页数已达到最大页数，则表示没有更多数据
});

const disabled = computed(() => {
  return loading.value || noMore.value;
});

// 从服务器获取图片数据的异步函数，传入页面号作为参数
const fetchImg = async (pageNumber) => {
  loading.value = true;
  try {
    const res = await imgUse('/wall/small', {
      params: {
        page: pageNumber,
        pageSize: PAGE_SIZE,
      },
    });
    const data = res.data.data;
    imglists.value = [...imglists.value, ...data];
    console.log('总数据：', data.length);
    page.value.currentPage++;
  } catch (error) {
    console.error('获取图片数据失败：', error);
  } finally {
    loading.value = false;
  }
};

// 获取图片的异步函数
const getImg = async () => {
  if (loading.value || noMore.value) {
    return;
  }
  await fetchImg(page.value.currentPage + 1); // 加载下一页的数据
  count.value++;
};

// 加载更多的处理函数
const loadData = () => {
  if (loading.value || noMore.value) {
    return;
  }
  setTimeout(() => {
    getImg(); // 获取图片数据
  }, 1000);
};

// 使用 Intersection Observer 来监听滚动容器
const scrollContainer = ref(null);

const intersectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    console.log('entry:', entry.isIntersecting); // 检查scrollContainer的值是否为正确的DOM元素
    if (entry.isIntersecting && !noMore.value) {
      loadData(); // 滚动到容器底部时触发加载更多数据
    }
  });
});

onMounted(() => {
  // 初始化时加载第一页的数据
  loadData();

  // 将Intersection Observer绑定到滚动容器
  if (scrollContainer.value) {
    console.log('scrollContainer:', scrollContainer.value); // 检查scrollContainer的值是否为正确的DOM元素
    intersectionObserver.observe(scrollContainer.value);
  }
});

onUnmounted(() => {
  // 在组件销毁时断开Intersection Observer
  intersectionObserver.disconnect();
});
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
    width: 68%;
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
