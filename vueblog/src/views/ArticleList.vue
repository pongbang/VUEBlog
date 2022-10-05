<template>
  <div class="article-wrap">
    <div v-if="hasArticle">
      <el-card
        class="blog-content--item"
        v-for="item in articles"
        :key="item.id"
      >
        <router-link :to="{ name: 'article', params: { id: item.id } }">
          <ArticleItem :article="item" />
        </router-link>
      </el-card>
    </div>
    <article v-else class="blog-content--item blog-content-never">
      <h3 class="blog-item--title">很遗憾 没有找到对应的文章</h3>
      <el-button type="primary" @click="routeEditor">去写一篇吧</el-button>
    </article>
  </div>
</template>

<script>
import ArticleItem from '@/components/article/ArticleItem.vue'
import QS from 'qs'
export default {
  name: "ArticleList",
  data() {
    return {
      articles: [],
      page: 1,
      size: 4,
      q: "",
    };
  },
  inject: ['closeLoadClock'],
  props: {
    loading: {
      type: Boolean
    },
    columnId: {
      type: String
    },
    searchVal: {
      type: String
    }
  },
  components: {
    ArticleItem
  },
  computed: {
    hasArticle() {
      return this.articles.length > 0;
    },
  },
  created() {
    if(this.searchVal){
      this.searchArticle(this.searchVal)
      return
    }
    this.getArticles();
  },
  mounted () {
    this.$EventBus.$off('search', this.searchArticle)
    this.$EventBus.$on('search', this.searchArticle)
  },
  watch: {
    loading (load) {
      if (load && !this.searchVal) {
        this.getArticles()
      }
    },
    $route () {
      this.resetArticles ()
      this.getArticles()
    },
  },
  methods: {
    routeEditor () {
      let columnId = this.columnId
      this.$router.push({ name: 'editor', query: { columnId } })
    },
    searchArticle (q) {
      this.q = q
      this.resetArticles()
      this.getArticles()
    },
    resetArticles () {
      this.articles = []
      this.page = 1
    },
    getQuery () {
      let column = this.columnId
      let q = this.q || undefined
      let query = JSON.parse(JSON.stringify({
        column, q
      }))
      return query
    },
    getArticles() {
      let data = { size: this.size, page: this.page};
      let query = this.getQuery()
      if (Object.entries(query).length > 0) {
        data.query = QS.stringify(query)
      }
      this.$api({ type: "articles", data })
        .then((result) => {
          if (this.articles.length >= result.total) {
            return; 
          }
          this.articles.push(...result.list);
          this.closeLoadClock()
          this.page++;
        })
        .catch((err) => {
          this.$message.success({
            message: err.message,
          });
        });
    },
    search() {
      let data = { q:this.q };
      this.$api({ type: "search", data })
        .then((result) => {
          this.articles.push(...result.list);
        })
        .catch((err) => {
          this.$message.success({
            message: err.message,
          });
        });
    },
  },
};
</script>

<style lang="stylus" >

</style>

