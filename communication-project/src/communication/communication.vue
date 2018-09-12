<template>
  <div class='wholeScr'>
    <v-header></v-header>
    <v-navbar></v-navbar>
    <div class="session">
      <component :is="session"></component>
    </div>
  </div>
</template>

<script>
  import header from './components/header/header'
  import navbar from './components/navbar/navbar'
  import chatBox from './components/chatBox/chatBox'
  import childList from './components/childList/childList'
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
    },
    created () {
      
    }
  }
</script>

<style scoped lang="stylus">
  .activeBG 
    background rgba(77,149,250,0.8)
  .wholeScr
    position absolute
    top 0
    left 0
    width 100vw
    height 100vh
    overflow hidden
    .session
      position absolute
      top 60px
      left 160px
      background #ddd
      height calc(100vh - 60px)
      width calc(100vw - 160px)
      overflow hidden
</style>
