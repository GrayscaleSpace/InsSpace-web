<template>
  <!-- 下拉刷新区域 -->
  <div ref="refresh" class="refresh" @scroll="handleScroll">
    <div class="refresh-content">
      <div
          class="playlists"
          ref="playlists"
      >
        <div
            class="top-play-list-card"
            v-if="topPlaylist.id"
        >
        </div>
        <div class="playlist-cards">
          <ImgList
              :img="item.url"
              :key="index"
              :name="item.title"
              v-for="(item,index) in imglists"
          />
          <!-- 加载动画，根据需要显示或隐藏 -->
          <div v-if="isLoading" class="loading">Loading...</div>
        </div>
      </div>
    </div>
    <!-- 分页器 -->
    <!--    <el-pagination-->
    <!--        background-->
    <!--        @size-change="handleSizeChange"-->
    <!--        @current-change="handleCurrentChange"-->
    <!--        :current-page="page.currentPage"-->
    <!--        :page-sizes="[5, 10, 20, 50]"-->
    <!--        :page-size="page.pageSize"-->
    <!--        layout="total, sizes, prev, pager, next"-->
    <!--    :total="page.total"-->
    <!--        :total-text="`${page.total} 条记录`"-->
    <!--    >-->
    <!--    </el-pagination>-->
  </div>
</template>

<script type="text/ecmascript-6">
import ImgList from "../components/ImgList.vue";
import axios from "axios";

const imgUse = axios.create({
  baseURL: '/api', // 使用代理路径
});
const PAGE_SIZE = 50;

export default {
  components: {ImgList},

  data() {
    return {
      imglists: [],
      isLoading: false,
      refreshThreshold: 60,
      startY: 0,
      page: {
        pageSize: 25,
        currentPage: 1,
        total: 0
      },
      activeTabIndex: 0,
      currentPage: 0,
      total: 0,
      topPlaylist: {}
    };
  },

  created() {
    this.PAGE_SIZE = PAGE_SIZE;
  },
  mounted() {
    // 在组件进入时加载数据
    this.loadInitialData();
  },
  methods: {
    // /*分页*/
    // handleSizeChange(val) {
    //   console.log(`每页 ${val} 条`);
    //   this.page.pageSize = val;
    //   this.getImgList();
    // },
    // handleCurrentChange(val) {
    //   //console.log(`当前页: ${val}`);
    //   this.page.currentPage = val;
    //   this.getImgList();
    // },
    // // 模拟异步加载新数据的函数
    // async fetchData() {
    //   return new Promise((resolve) => {
    //     // 模拟异步操作，延迟1秒钟
    //     setTimeout(() => {
    //       // 生成一组新数据，每个数据项表示一个新的项目
    //       const newData = Array.from({ length: this.pageSize }, (_, index) => {
    //         const response = imgUse.get('/img.json', {
    //           params: {
    //             limit: PAGE_SIZE,
    //             offset: this.$utils.getPageOffset(10, PAGE_SIZE),
    //           },
    //         });
    //         const data = response.data;
    //         this.imglists = data.slice(
    //             (this.page.currentPage - 1) * this.imglists.length,
    //             this.page.currentPage * this.imglists.length
    //         );
    //         this.page.total = data.length;
    //
    //       });
    //       // 解析 Promise，并传递新数据数组作为解析值
    //       // 打印下拉加载的数据
    //       console.log('下拉加载的数据：', this.imglists.length );
    //       resolve(newData);
    //     }, 1000); // 1秒延迟，模拟加载时间
    //   });
    // },
    // 模拟异步加载新数据的函数
    async fetchData() {
      try {
        // 模拟异步操作，延迟1秒钟
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1秒延迟，模拟加载时间

        // 发起数据请求
        const response = await imgUse.get('/img.json', {
          params: {
            limit: PAGE_SIZE,
            offset: this.$utils.getPageOffset(10, PAGE_SIZE),
          },
        });

        // 处理响应数据
        const data = response.data;
        this.imglists = data.slice(25, 30);
        // 更新总条数
        this.page.total = this.imglists.length;

        // 打印下拉加载的数据
        console.log('下拉加载的数据：', this.imglists.length+5);
        console.log('下拉加载的数据：', this.imglists);

        // 解析 Promise，并传递新数据数组作为解析值
        return this.imglists;
      } catch (error) {
        console.error('加载数据失败', error);
        throw error; // 抛出错误以便调用方处理
      }
    },


    async loadMoreData() {
      if (this.isLoading) return;
      this.isLoading = true;

      // 模拟异步加载更多数据的过程
      setTimeout(async () => {
        // 请求新数据
        const newData = await this.fetchData();
        this.imglists = this.imglists.concat(newData); // 将新数据追加到列表
        this.isLoading = false;
      }, 1000); // 模拟加载时间

      // 重置下拉刷新状态
      this.startY = 0;
      this.$refs.refresh.scrollTop = 0;
    },
    loadInitialData() {
      // 在组件进入时加载初始数据
      this.fetchData()
          .then(() => {
            // 数据加载完成后，可以执行其他操作
            this.loadImgLists(); // 调用新的方法来加载图片列表
          })
          .catch((error) => {
            console.error('加载数据失败', error);
          });
    },

    async loadImgLists() {
      try {
        const response = await imgUse.get('/img.json', {
          params: {
            limit: PAGE_SIZE,
            offset: this.$utils.getPageOffset(10, PAGE_SIZE),
          },
        });
        const data = response.data;
        this.imglists = data.slice(
            (this.page.currentPage - 1) * this.page.pageSize,
            this.page.currentPage * this.page.pageSize
        );
        this.page.total = data.length;
      } catch (error) {
        console.error('加载图片列表失败', error);
      }
    },

    // 滚动事件处理函数
    handleScroll(event) {
      // 获取触发滚动事件的目标元素，即包含下拉刷新内容的容器
      const target = event.target;
      // 判断用户是否下拉到了超过阈值的距离
      if (target.scrollTop - this.startY >= this.refreshThreshold) {
        // 更新上一次记录的滚动位置为当前的滚动位置
        this.startY = target.scrollTop;
        // 打印下拉的距离，用于调试和监测
        console.log('超过阈值的距离：',this.refreshThreshold);
        // 触发加载更多数据的操作
        this.loadMoreData();
      }
    },
  },
};
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
