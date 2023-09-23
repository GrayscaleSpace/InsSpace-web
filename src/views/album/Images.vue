<template>
  <div class="album-images">
    <div class="album-image-header">
      <div class="album-actions">
        <el-button type="primary" icon="Back" @click="() => $router.back()">返回</el-button>
      </div>
      <div class="album-actions-footer">
        <el-button v-if="showActionBar" type="primary" icon="DocumentCopy" size="small" @click="handleAction('copy')">复制链接</el-button>
      </div>
      <div class="images">
        <img :src="detail.data.url" alt="">

      </div>
      <div class="album-title">{{ detail.name }}</div>
      <div class="album-desc">{{ detail.desc }}</div>
      <div class="album-meta">
        <div class="album-meta-line">
          <span>
            <el-icon><Calendar /></el-icon>
            创建于 {{ detail.createdAt }}
          </span>
          <span class="divider">|</span>
          <span>
            <el-icon><RefreshLeft /></el-icon>
            更新于 {{ detail.updatedAt }}
          </span>
        </div>
<!--        <div class="album-meta-line">-->
<!--          <span>-->
<!--            <el-icon><Picture /></el-icon>-->
<!--            图片数量: {{list.total }}张-->
<!--          </span>-->
<!--        </div>-->
      </div>
    </div>
<!--    <div class="album-image-content">-->
<!--      <div class="album-image-filter">-->
<!--        <div class="filter-input">-->

<!--        </div>-->
<!--        <div class="filter-tags" v-if="tags.length >= 2">-->
<!--          <span>标签搜索:</span>-->
<!--          <span-->
<!--            v-for="(tag, index) in tags"-->
<!--            :key="'filter-tag-' + index"-->
<!--            :class="['filter-tag-item', tag === list.filters.tag ? 'active' : '']"-->
<!--            @click="changeTag(tag)">{{ tag }}</span>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="album-image-list" v-loading="list.loading">-->

<!--      </div>-->

<!--    </div>-->
    <!-- 图片弹窗 -->
    <detail-dialog
      v-if="item.detail"
      v-model="item.detail"
      :show-album="false"
      :detail="item.data"
      @submit="listGet"/>
    <!-- 标签编辑 -->
    <tag-dialog
      v-if="item.edit"
      v-model="item.edit"
      :detail="item.data"
      @submit="() => { getTags();listGet(); }" />
  </div>
</template>

<script lang="ts" setup>
import { useFormat } from '@/hooks/date-time';
import { useCopyText, useCtxInstance, useDeleteConfirm, useListFilter } from '@/hooks/global';
import Album from '@/types/Album';
import Bucket from '@/types/Bucket';
import Image from '@/types/Image';
import { AlbumInter, BucketInter, ImageInter, ListInter } from '@/typings/interface';
import { PageResponse } from '@/typings/req-res';
import { computed, nextTick, onActivated, reactive, Ref, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DetailDialog from '@/views/gallery/DetailDialog.vue'
import TagDialog from './TagDialog.vue'
import GalleryItem from '@/views/gallery/gallery-item.vue'
import useConfigStore from '@/store/config';

/**
 * 实例
 */
const album = new Album()
const route = useRoute()
const router = useRouter()
const image = new Image()
const bucket = new Bucket()
const ctx = useCtxInstance()
const configStore = useConfigStore()


/**
 * 变量
 */
// 壁纸
const detail: Ref<AlbumInter> = ref({})
// 列表数据
const list: ListInter<ImageInter> = reactive({
  page: 1,
  size: 18,
  total: 0,
  loading: false,
  filters: {
    zid: route.query.id || '',
    tag: '全部',
    img_name: ''
  },
  data: []
})
// 是否显示操作栏
const showActionBar = computed(() => {
  return list.data.filter(el => el.checked).length
})
// 存储桶列表
const buckets: Ref<BucketInter[]> = ref([
  { name: '全部', id: '' }
])
const item = reactive({
  detail: false,
  data: null,
  edit: false
})
// 置顶数量
const tops = ref(0)
// 所有标签
const tags = ref(['全部'])

// 获取标签列表
const getTags = (callback: Function = () => {}) => {
  album.tags(route.query.id as string).then((res: string[]) => {
    tags.value = [
      '全部',
      ...res
    ]
    if (!tags.value.includes(list.filters.tag)) {
      list.filters.tag = '全部'
      callback()
    }
  })
}
// getTags()
// 壁纸详情获取
const getDetail = () => {
  console.log("进入方法")
  const id = route.query.id as string
  console.log(id)
  if (id) {
    album.detail(id).then((res: AlbumInter) => {
      res.createdAt = useFormat(res.createdAt, 'YYYY-MM-DD')
      res.updatedAt = useFormat(res.updatedAt, 'YYYY-MM-DD')
      detail.value = res
    })
  }
}
getDetail()
// 获取图片列表
const listGet = () => {
  list.loading = true
  tops.value = 0
  album.images({
    pageNum: list.page,
    pageSize: list.size,
    zid: list.filters.zid,
    name: list.filters.name,
    tag: list.filters.tag === '全部' ? '' : list.filters.tag
  }).then((res) => {
    list.total = res.total
    useFormat(res.records.createTime)
    list.data = res.records
    list.loading = false
  })
}
// listGet()
// 操作栏回调
function handleAction (type) {
  let ids = []
  switch (type) {
    case 'remove':
      ids = list.data.filter(item => item.checked).map(item => item.id)
      useDeleteConfirm('确定将图片移出该壁纸吗？').then(() => {
        ids.map((id, index) => {
          image.update({
            id: id,
            album_id: '',
            sort: 0,
            slient: true
          }).then(async (res) => {
            if (index === ids.length - 1) {
              ctx.$message({ message: '移除成功', duration: 1000, type: 'success' })
              listGet()
            }
          })
        })
      })
      break
    case 'copy':
      const copyText = list.data.filter(item => item.checked).map(item => item.img_preview_url).join('\n')
      useCopyText(ctx, copyText)
      break
    case 'delete':
      ids = list.data.filter(item => item.checked).map(item => item.id)
      useDeleteConfirm().then(() => {
        ids.map((id, index) => {
          image.delete(id).then(res => {
            if (index === ids.length - 1) {
              ctx.$message({ message: '删除成功', duration: 1000, type: 'success' })
              listGet()
            }
          })
        })
      })
      break
  }
}

/**
 * 回调函数
 */
// 点击
const handleClick = (index: number) => {
  ctx.$viewerApi({
    options: {
      initialViewIndex: index
    },
    images: list.data.map(item => item.img_preview_url)
  })
}
const handleItemSubmit = (e: { type: string, data: ImageInter }) => {
  switch (e.type) {
    case 'delete':
      useDeleteConfirm('确定删除吗?(由于对象存储几乎不要钱，故此处只是删除本条记录，不会删除对象存储上的原数据，所以删除后仍然能正常访问)').then(() => {
        image.delete(e.data.id).then(res => {
          ctx.$message({ message: '删除成功', type: 'success', duration: 1000 })
          getTags(listGet)
        })
      })
      break
    case 'remove':
      useDeleteConfirm('确定将图片移出该壁纸吗？').then(() => {
        image.update({
          id: e.data.id,
          album_id: '',
          sort: 0,
          slient: true
        }).then(async (res) => {
          ctx.$message({ message: '移除成功', type: 'success', duration: 1000 })
          listGet()
        })
      })
      break
    case 'detail':
      item[e.type] = true
      item.data = e.data
      break
    case 'top':
      image.update({
        id: e.data.id,
        slient: true,
        sort: tops.value + 1
      }).then(res => {
        listGet()
      })
      break
    case 'unTop':
      image.update({
        id: e.data.id,
        slient: true,
        sort: 0
      }).then(res => {
        listGet()
      })
      break
    case 'update':
      useListFilter(list, route.name, 'set')
      router.push({
        path: '/',
        query: {
          album_id: detail.value.id,
          img_id: e.data.id
        }
      })
      break    
  }
}
// 更新图片的标签
const editItemTag = (data: ImageInter) => {
  item.edit = true
  item.data = data
}
// 根据tag名称渲染类别
const getTagType = (tag) => {
  if (tag === '已完结') {
    return 'danger'
  }
  if (tag === '连载') {
    return 'success'
  }
  return 'default'
}
// 切换标签
const changeTag = (tag) => {
  list.filters.tag = tag
  listGet()
}
// 去上传
const goUpload = () => {
  useListFilter(list, route.name, 'set')
  router.push({
    path: '/',
    query: {
      album_id: detail.value.id
    }
  })
}


// 激活页
onActivated(() => {
  useListFilter(list, route.name, 'get', getBuckets)
})
</script>

<style lang="scss">
.album-images {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  .album-image-header {
    //width: calc(100% + 19px + 19px);
    height: 100%;
    flex-shrink: 0;
    background-color: #009688;
    background-size: 100% auto;
    background-position: center center;
    //margin-top: -19px;
    //margin-left: -19px;
    //padding: 20px 3%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    position: relative;
    color: #fff;
    box-shadow: 0px 1px 10px #0000001a;
    .album-actions {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 10px 20px;
    }
    .album-actions-footer {
      position: absolute;
      bottom: -35px;
      right: 0;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 100%;
      padding: 0 5px;
      .el-button {
        height: 30px;
      }
    }
    .album-title {
      font-size: 28px;
      margin-bottom: 0.2rem;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .album-desc {
      font-size: 18px;
      margin-bottom: 0.2rem;
      overflow: hidden;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      text-overflow: ellipsis;
      display: -webkit-box;
    }
    .album-meta-line {
      line-height: 2;
      font-size: 16px;
      display: flex;
      align-items: center;
      span {
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
        .el-icon {
          margin-right: 5px;
        }
        &.divider {
          width: 1px;
          margin: 0 10px;
        }
      }
    }
  }
  .album-image-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    .album-image-filter {
      flex-shrink: 0;
      margin: 40px 0 0px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .filter-input {
        width: 748px;
        .el-input__wrapper {
          box-shadow: 0 0 0 1px #409eff inset;
        }
        .el-input-group__append {
          background: #409eff;
          box-shadow: none;
          border: 1px solid #409eff;
          border-left: none;
          color: #fff;
        }
      }
      .filter-tags {
        width: 748px;
        font-size: 14px;
        margin-top: 8px;
        display: flex;
        flex-wrap: wrap;
        color: rgba($color: #000000, $alpha: 0.65);
        span:first-child {
          margin-right: 5px;
        }
        .filter-tag-item {
          padding: 0 8px;
          cursor: pointer;
          margin-bottom: 8px;
          &.active {
            background: #409eff;
            color: #fff;
            border-radius: 4px;
            font-size: 12px;
            padding: 2px 5px;
          }
        }
      }
    }
    .album-image-list {
      flex: 1;
      padding-top: 10px;
      .el-row {
        width: 100%;
        height: 100%;
        align-content: flex-start;
      }
      .el-col {
        padding: 10px;
      }
      .album-tags {
        position: absolute;
        left: 5px;
        bottom: 0;
        width: 100%;
        z-index: 3;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        .el-tag {
          margin-bottom: 5px;
          + .el-tag {
            margin-left: 5px;
          }
        }
        .tags-edit {
          display: none;
        }
      }
      .gallery-item:hover {
        .tags-edit {
          display: inline-flex;
        }
      }
    }
    .pagination {
      margin: 5px 0 10px;
    }
  }
  .empty-data {
    width: 100%;
    height: 100%;
    .el-empty {
      width: 100%;
      height: 100%;
    }
  }
}
</style>