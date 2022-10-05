<template>
  <div class="blog-header--login">
    <span @click="open('login')">登录</span>
    <i class="blog-header--split">|</i>
    <span @click="open('register')">注册</span>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('modal')
export default {
  name: 'UserLoginHead',
  data () {
    return {

    };
  },
  mounted () {

  },
  methods: {
    ...mapActions(['open'])
  },
};
</script>
<style lang="stylus" >
.blog-header--login span
  cursor pointer
.blog-header--split
  font-size 18px
  padding 0 4px
</style>
