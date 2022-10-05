<template>
  <div class="blogm-header">
    <component :is="headType"
               :title="title"
               :button="button"
               :handler="buttonHandler"></component><!-- 按钮内部点击触发(bus)buttonHandler -->
  </div>
</template>

<script>
import NavBar from '@/components/m/BaseNavBar'
import SearchBar from '@/components/m/BaseSearchBar'
export default {
  name: 'MHeader',
  components: {
    NavBar, SearchBar
  },
  data () {
    return {
      headType: 'SearchBar',
      title: '默认标题',
      button: '',
      buttonHandler: ''
    }
  },
  watch: {
    $route (to) {
      this.button = ''
      this.buttonHandler = ''
      Object.assign(this, to.meta)
    }
  },
};
</script>

