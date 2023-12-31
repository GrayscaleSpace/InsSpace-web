
import { PageReq } from '@/typings/req-res';
import { AlbumInter } from '@/typings/interface'
import http from '@/api'

// 筛选条件
interface Filter extends PageReq {
  uid?: string
  id?: string
  desc?: string
  name?: string
  tag?: string
}

/**
 * =========== 壁纸 ===========
 * 用于创建自己的壁纸
 * ==============================
 */
export default class Album {
  // 新建
  create (params: AlbumInter) {
    return http('/album/create', params)
  }
  // 删除
  delete (id: string) {
    return http('/album/delete', { id })
  }
  // 更新
  update (params: AlbumInter) {
    return http('/album/update', params)
  }
  // 查询
  async find (params: Filter) {
    return http('/small/page', params)
  }
  // 详情
  detail (only: string) {
    return http('/raw/detail', { only })
  }
  // 图片列表
  images(params: { name: any; pageSize: number; zid: any; tag: any; pageNum: number }) {
    return http('/small/page', params)
  }
  // 标签列表
  tags (id: string) {
    return http('/album/tags', { id })
  }
}