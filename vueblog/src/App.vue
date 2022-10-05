<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import _isMobile from '@/util/isMobile'
export default {
  name: 'app',
  components: {
   
  },
  mounted () {
    _isMobile() && this.$router.replace('/m')
  },
}
</script>

<style>

</style>
