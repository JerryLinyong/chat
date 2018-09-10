<template>
  <div>
    <v-header></v-header>
    <v-navbar></v-navbar>
    <div class="session">
      <component :is="session"></component>
    </div>
  </div>
</template>

<script>
  import header from './components/header'
  import navbar from './components/navbar'
  import chatBox from './components/chatBox'
  import childList from './components/childList'
  export default {
    components: {
      'v-header': header,
      'v-navbar': navbar,
      'chatBox': chatBox,
      'childList': childList
    },
    data () {
      return {
      }
    },
    computed: {
      session () {
        return this.$store.state.session
      }
    }
  }
</script>

<style scoped lang="stylus">
  .activeBG 
    background rgba(77,149,250,0.8)

  .session
    position absolute
    top 60px
    left 160px
    background #ddd
    height calc(100vh - 60px)
    width calc(100vw - 160px)
    overflow hidden
</style>
