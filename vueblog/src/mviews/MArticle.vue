<template>
  <div class="blogm-article--wrap">
    <ArticleContent :article="article"
                    v-if="article.id" />
    <ArticleComment :comments="article.comments" />

    <van-action-sheet v-model="showComment"
                      title="评论">
      <div class="blogm-action--content">
        <van-divider />
        <van-field v-model="comment"
                   style="min-height:120px"
                   rows="2"
                   type="textarea"
                   size="large"
                   maxlength="100"
                   autosize
                   placeholder="请输入留言"
                   show-word-limit />
        <van-button type="info"
                    @click="onSubmitComment"
                    block>提交</van-button>
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
import ArticleContent from '@/components/m/article/ArticleContent'
import ArticleComment from '@/components/m/ArticleComment'
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('likes')
export default {
  name: 'MArticle',
  components: {
    ArticleContent, ArticleComment
  },
  data () {
    return {
      id: '',
      article: {},
      comment: '',
      showComment: false
    };
  },
  created () {
    this.id = this.$route.params.id
    this.getArticleById()

    this.$EventBus.$on('show-comment-action', this.showCommentAction)//header上的评论按钮点击触发
  },
  beforeDestroy () {
    this.$EventBus.$off('show-comment-action', this.showCommentAction)
  },
  methods: {
    async getArticleById () {
      try {
        this.article = await this.$api({ type: 'getArticleById', data: { id: this.id } })

        let likeUsers = this.article?.like_users || []
        let uid = this.$store.getters.userInfo?._id
        let aid = this.article?.id
        if (likeUsers.includes(uid)) {
          this.pushLike({ aid })
        }
      } catch (err) {
        this.$message.success({
            message: err.message,
        });
      }
    },
    showCommentAction () {
      if (!this.$store.state.token) {
        this.$message.success({
            message: "请先登录",
          });
        this.$EventBus.$emit('dialog-show', 'login')//弹出登录Dialog,第二个参数是from的type
        return false
      }
      this.showComment = true

    },
    async onSubmitComment () {
      if (!(this.comment.trim().length > 0)) {
        this.$message.warning({
          message: "请输入评论内容",
        });
      }
      try {
        await this.$api({ type: 'postComment', data: { aid: this.id, content: this.comment } })
        this.$message.success({
          message: "评论成功",
        });
        this.getArticleById()
      } catch (err) {
        this.$message.warning({
          message: "评论失败",
        });
      }
      this.resetComment()
    },
    resetComment () {
      this.showComment = false
      this.comment = ''
    },
    ...mapActions(['pushLike'])
  },
};
</script>
<style lang="stylus" >
.blogm-action--content
  padding 20px 10px 20px
</style>

