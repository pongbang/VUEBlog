<template>
  <div class="blogm-page">

    <Header />
    <div class="blogm-content">
        <router-view></router-view>
    </div>
    <FootBar />
    <BaseDialog />
  </div>
</template>

<script>
import Header from '@/mviews/MHeader'
import FootBar from '@/mviews/FootBar'
import BaseDialog from '@/components/m/BaseDialog'
import {mapActions } from 'vuex'
export default {
  name: 'MHome',
  components: {
    Header,
    FootBar,
    BaseDialog
  },
  data () {
    return {

    }
  },
  create (){
    let isLogin = this.$store.state.token
    let nikname = this.userInfo?.nikname
    if (isLogin && !nikname) {
      this.getUserInfo()
    }
  },
  methods:{
    ...mapActions(['getUserInfo']),
  }
}
</script>
<style lang="stylus" >
.blogm-content
  overflow hidden
  overflow-y auto
  height calc(100vh - 105px)
  background-color #f1f1f1
</style>
