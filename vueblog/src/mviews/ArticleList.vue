<template>
  <div class="blogm-list">
    <van-pull-refresh v-model="refreshing"
                      @refresh="onRefresh"><!-- 下拉刷新事件 -->
      <van-list v-model="loading"
                :finished="finished"
                offset="100"
                finished-text="没有更多了"
                error-text="获取失败，点击重新加载"
                @load="onLoad"><!-- :immediate-check='true'默认初始化执行一次,若是没满屏幕再次触发 -->
        <router-link v-for="item in articleList"
                     :key="item.id"
                     :to="{name:'mArticle',params:{id:item.id}}">
          <ArticleItem :article="item" />

        </router-link>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>

import ArticleItem from '@/components/m/article/ArticleItem'
import QS from 'qs'
export default {
  name: 'ArticleList',
  components: { ArticleItem },
  props: {
    columnId: {
      type: String
    }
  },
  data () {
    return {
      articleList: [],
      columnArticleCache: {},
      loading: false,//是否在加载中,加载中,不能进行load
      finished: false,//是否完成
      refreshing: false,//是否加载中
      size: 4,
      page: 1,
      q: ''
    };
  },
  mounted () {
    this.$EventBus.$off('search-article', this.searchArticle)
    this.$EventBus.$on('search-article', this.searchArticle)
  },

  watch: {
    columnId (newId) {
      if (newId.trim().length === 0) {
        return false
      }
      //是否在缓存中
      if (this.columnArticleCache[newId]) {
        this.articleList = this.columnArticleCache[newId]
        return false
      }
      this.refreshing = true
      this.onRefresh()
    }
  },
  methods: {
    onLoad () {
      this.getArticles()
    },
    searchArticle (q) {
      this.q = q
      this.refreshing = true
      this.onRefresh()
    },
    onRefresh () {
      this.resetParams()
      this.onLoad()
    },
    resetParams () {
      this.page = 1
      this.finished = false
      this.loading = true
    },
    getQuery () {
      let column = this.columnId || undefined
      let q = this.q || undefined
      let query = JSON.parse(JSON.stringify({
        column, q
      }))
      return query
    },

    getArticles () {
      let data = { size: this.size, page: this.page }
      let query = this.getQuery()

      if (Object.entries(query).length > 0) {
        data.query = QS.stringify(query)
      }

      this.$api({ 'type': 'articles', data }).then(result => {
        if (this.refreshing) {
          this.articleList = [];
          this.refreshing = false;
        }
        if (this.articleList.length >= result.total) {
          this.finished = true//结束
          return
        }
        this.articleList.push(...result.list)
        this.cacheColumnList()
        this.loading = false
        this.page++
      }).catch(err => err)
    },
    cacheColumnList () {
      if (this.columnId) {
        this.columnArticleCache[this.columnId] = JSON.parse(JSON.stringify(this.articleList))
      }
    }
  }
};
</script>
