<template>
    <el-card class="blog-editor">
      <h3 class="blog-editor-title">标题</h3>
      <el-input ref="title"
                v-model="title"
                class="blog-editor-input"
                size="medium"
                placeholder="文章标题"></el-input>

      <h3 class="blog-editor-title">内容</h3>
      <div id="blog-editor-textarea">
        
      </div>
      <div class="modalpic" v-if="show">
        <div class="inser">
          <VueCropper ref="cropper" :img="pic" :autoCrop="true"></VueCropper>
        </div>
        <div class="inserother"><el-button id="submit">确定</el-button><el-button @click="close">取消</el-button></div>
      </div>
      <div class="blog-editor-tags">
        <h3 class="blog-editor-title">分类选择</h3>
        <el-radio-group v-model="column">
          <el-radio-button v-for="(item) in columns"
                           :key="item.id"
                           :label="item.id">{{item.name}}</el-radio-button>
        </el-radio-group>
      </div>

      <div class="blog-editor-button">
        <el-button type="primary"
                   @click="submitEditor">提交</el-button>
        <el-button type="primary"
                   @click="cancelEditor">重置</el-button>
      </div>
    </el-card>
</template>

<script>
import wangEditor from 'wangeditor'
import { VueCropper }  from 'vue-cropper'
export default {
  name: 'PageEditor',
  props: {
    columnId: {
      type: String
    }
  },
  data () {
    return {
      editor: null,
      title: '',
      content: '',
      columns: [],
      column: '',
      pic:'',
      show:false
    };
  },
  components: {
    VueCropper
  },
  created () {
    this.getColumns()

  },
  mounted () {
    let that=this
    const editor = new wangEditor(`#blog-editor-textarea`)

    editor.config.onchange = (newHtml) => {
      this.content = newHtml
    }
    editor.config.uploadImgServer = process.env.VUE_APP_FILE_UPLOAD_PATH
    editor.config.uploadImgMaxSize = 8 * 1024 * 1024
    editor.config.uploadImgAccept = ['jpg', 'jpeg', 'png', 'gif', 'bmp']
    editor.config.uploadImgMaxLength = 10
    editor.config.uploadFileName = 'file'
    editor.config.uploadImgHeaders = {
      'Authorization': `Bearer ${this.$store.state.token}`,
    }
editor.config.uploadImgHooks = {
    // 上传图片之前
    before: function(a,b,c) {
      that.show=true
    },
    // 图片上传并返回了结果，图片插入已成功
    success: function(xhr) {
        console.log('success', this.pic)
    },
    // 图片上传并返回了结果，但图片插入时出错了
    fail: function(xhr, editor, resData) {
        console.log('fail', resData)
    },
    // 上传图片出错，一般为 http 请求的错误
    error: function(xhr, editor, resData) {
        console.log('error', xhr, resData)
    },
    // 上传图片超时
    timeout: function(xhr) {
        console.log('timeout')
    },
    // 图片上传并返回了结果，想要自己把图片插入到编辑器中
    // 例如服务器端返回的不是 { errno: 0, data: [...] } 这种格式，可使用 customInsert
    customInsert: function(insertImgFn, result,a) {
        that.pic=result.data[0]
        document.addEventListener("click", function(e){
          if(e.target.id==='submit'|e.target.innerText==='确定'){
            that.sub(insertImgFn)
          }
        })
    }
}
    editor.create()
    this.editor = editor
  },
  methods: {
    sub(callback){
      this.$refs.cropper.getCropData(data => {
      this.pic=data
      this.show=false 
      callback&&callback(this.pic)
      this.postImg(this.pic)
    })
    },
    close(){
      this.show=false
    },
    async postImg(img) {
      try {
        await this.$api({ type: 'uploadArticle',data:img}) 
      } catch (err) {
        this.$message.error({
          message: err.message
        })
      }
    },
    async getColumns () {
      try {
        let columns = await this.$api({ type: 'columns' })
        this.columns = columns.list.map(item => {
          return {
            id: item.id,
            name: item.name
          }
        })
        if (this.columnId) {
          this.column = this.columnId
          return
        }
        this.column = this.columns[0].id
        this.$refs.title.focus()
      } catch (err) {
        this.$message.error({
          message: err.message
        })
      }
    },
    submitEditor () {
      if (!this.validateEditor()) {
        return
      }
      this.postEditorData()
    },
    cancelEditor () {
      this.editor.txt.clear()
    },
    validateEditor () {
      if (this.title.trim().length === 0) {
        this.$message.error({
          message: '请填写标题'
        })
        this.$refs.title.focus()
        return false
      }
      if (this.content.trim().length === 0) {
        this.$message.error({
          message: '内容不能为空'
        })
        return false
      }
      return true
    },
    async postEditorData () {
      let postData = {
        title: this.title,
        content: this.content,
         
        column: this.column,
        cover: this.content.match(/<img src="([^"']*)"/)?.[1] || undefined
      }

      try {
        this.$api({
          type: 'postArticle', data: JSON.parse(JSON.stringify(postData))
        })
        this.$message.success({
          message: '文章提交成功'
        })
        this.$router.push('/index')
      } catch (err) {
        this.$message.error({
          message: '提交失败'
        })
      }

    }
  },
  beforeDestroy () {
    this.editor.destroy()
    this.editor = null
  }
};
</script>

<style lang="stylus" >
.blog-editor-title
  padding 12px 0
  font-size 16px
.el-input--medium.blog-editor-input
  font-size 18px
  line-height 38px
  height 38px
.blog-editor-tags
  margin 20px 0
  & .el-tag+.el-tag
    margin-left 12px
.blog-editor-button
  padding-top 20px
  display flex
  justify-content space-around
  & button
    flex 1
    line-height 22px
    font-size 18px
.modalpic
    position absolute;
    width 100%
    height 100%
    z-index 99999
    top 0
    right 0
    background-color rgba(0,0,0,.2)
.inser
  position absolute;
  width 300px
  height 300px
  top 30%
  left 50%
  margin-left -150px
  margin-top -150px
.inserother
  position absolute;
  width 200px
  top 50%
  left 50%
  margin-left -90px
</style>