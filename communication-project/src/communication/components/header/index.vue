<template>
  <div>
    <div class="header">
      <div class="controlItems">
        <div class="control">控制台</div>
        <div class="selfCenter">个人中心</div>
        <div class="myself">
          <img src="./head1.jpg" alt="无法显示图片" class="userImg">
          <span>我</span>
          <ul class="selfInfo">
            <li>修改信息</li>  
            <li>安全管理</li>
            <li><a href="/logIn">退出</a></li>
          </ul> 
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
      }
    },
    methods: {
    }
  }
</script>

<style scoped lang="stylus">
  .header 
    position absolute
    left 160px
    top: 0
    width calc(100vw - 160px)
    height: 60px
    .controlItems 
      display flex
      float right
      margin-right: 100px
      div 
        display flex
        width 100px
        height 30px
        padding 18px 0 8px 0
        border-bottom 4px white solid
        justify-content center
        align-items center
        transition .5s
        &:hover 
          border-bottom 4px #4d95fa solid
      img 
        width: 30px
        height: 30px
        margin-right: 10px
      .myself
        position relative
        text-align center
        .selfInfo
          display none
          position absolute
          z-index 2
          top 60px
          width 100px
          padding 0
          margin 0
          background white
          list-style none 
          box-shadow 0 0 4px 2px #ddd 
          a
            text-decoration none
            color black
        &:hover
          .selfInfo
            display block 
            li 
              padding 10px 0
              &:hover
                background #4d95fa
</style>
