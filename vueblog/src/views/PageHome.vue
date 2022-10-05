<template>
  <el-container>
    <el-header class="blog-header">
      <BaseHeader />
    </el-header>
    <el-container class="blog-middle">
      <el-row
        class="blog-middle--wrap"
        type="flex"
        justify="flex-wrap"
        align="center"
      >
        <el-col :span="2"
                  v-if="circleMenuList.length > 0">
            <BaseCircleMenu :circleMenuList="circleMenuList" />
          </el-col>
        <el-col :span="24">
          <el-main class="blog-main">
            <VueScroll class="scroll" @handle-scroll="loadMore">
            <router-view :loading="loading"></router-view>
            </VueScroll>
          </el-main>
        </el-col>
        <el-col :span="6" v-if="$store.state.token" class="hidden-md-and-down">
          <BaseAside />
        </el-col>
      </el-row>
    </el-container>
    <BaseModal />
    <PageLive2D />
  </el-container>
</template>

<script>
import BaseHeader from "@/components/base/BaseHeader";
import BaseModal from "@/components/base/BaseModal";
import BaseAside from "@/components/base/BaseAside";
import BaseCircleMenu from "@/components/base/BaseCircleMenu";
import PageLive2D from '@/components/PageLive2d'

import circleMenuConfig from '@/config/circleMenu.config'
import _ from 'lodash'
import {mapActions } from 'vuex'
const TH = 200;
export default {
  name: "PageHome",
  data (){
    return {
      circleMenuList: [],
      loading: false,
    }
  },
  provide () {
    return {
      'closeLoadClock': this.closeLoadClock,
    }
  },
  components: {
    BaseHeader,BaseModal,BaseAside,BaseCircleMenu,PageLive2D
  },
  created () {
    let isLogin = this.$store.state.token
    let nikname = this.userInfo?.nikname
    if (isLogin && !nikname) {
      this.getUserInfo()
    }
    this.circleMenuList = circleMenuConfig['index']?.() || []
  },
  watch: {
    $route (to) {
      this.circleMenuList = circleMenuConfig[to.name]?.() || []
    }
  },
  methods:{
    ...mapActions(['getUserInfo']),
     closeLoadClock () {
      this.loading = false
    },
    loadMore: _.throttle(function (vertical, horizontal, nativeEvent) {
      this.scrollTop = vertical.scrollTop
      if (this.loading) {
        return
      }
      let st = vertical.scrollTop
      let sh = nativeEvent.srcElement.scrollHeight - nativeEvent.srcElement.clientHeight
      if (st + TH > sh) {
        this.loading = true
      }
    }, 500, false),
  }
};
</script>
<style lang="stylus" >
.blog-middle {
  padding: 20px;
  height: calc(100vh - 60px);
  background-color: #f1f1f1;
}

.el-main.blog-main {
  padding: 0 20px;
  height: 100%;
}

.blog-middle--wrap {
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
}
</style>
