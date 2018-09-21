<template>
  <div class='chatSession'>
    <leftbar></leftbar>
    <mainBox></mainBox>
    <rightbar></rightbar>
  </div>
</template>

<script>
  import leftbar from './leftbar/leftbar'
  import mainBox from './mainBox/mainBox'
  import rightbar from './rightbar/rightbar'
  export default {
    components: {
      'leftbar': leftbar,
      'mainBox': mainBox,
      'rightbar': rightbar
    },
    computed: {
    },
    data () {
      return {
      }
    }
  }
</script>

<style scoped lang="stylus">
  .chatSession
    position absolute
    top 20px
    left 80px
    height 92%
    width 86%
    display flex
    user-select none
    overflow hidden
</style>
