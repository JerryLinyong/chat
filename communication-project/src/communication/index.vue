<template>
  <div>
    <div class="header">
      <div class="controlItems">
        <div class="control">控制台</div>
        <div class="selfCenter">个人中心</div>
        <div class="myself">
          <img src="./head1.jpg" alt="无法显示图片" class="userImg">
          <span>我</span>
        </div>
      </div>
    </div>
    <nav>
      <p class="brandName">eco</p>
      <img src="./head1.jpg" alt="无法显示图片" class="userImg">
      <p class="userId">18574545555</p>
      <ul class="items">
        <li>沟通</li>
        <li>部门管理</li>
        <li>推荐人员</li>
      </ul>
    </nav>
    <div class="insert">
      <component :is="session"></component>
    </div>
  </div>
</template>

<script>
  import chatBox from './main/chatBox/index'
  export default {
    components: {
    'chatBox': chatBox
    },
    data () {
    return {
      session: "chatBox" 
    }
  },
  }
</script>

<style scoped lang="stylus">
  .header 
    position absolute
    left 160px
    top: 0
    width calc(100vw - 160px)
    height: 60px
    overflow: hidden
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

  nav 
    position: absolute
    top: 0
    left: 0
    width: 160px
    height: 100vh
    text-align: center
    background: #252830
    font-family: "Helvetica Neue", Helvetica, STHeiTi, sans-serif
    .brandName 
      font-size: 50px;
      color: #4d95fa;
      letter-spacing: 8px
      margin: 0
    img 
      width 60px
      height 60px
      margin 20px 0
      border-radius 60px
      border 2px solid grey
    .userId 
      color white
      font-size 14px
      font-weight bold
      margin 10px
    ul 
      list-style none
      padding 0
      li 
        color white
        padding 12px
        padding-left 8px
        margin-left 4px 
        color #bebfc1
        font-weight bold
        font-size 14px
        border-left 4px #252830 solid
        transition .5s
        &:hover 
          border-left 4px #4d95fa solid
          background rgba(200,200,200,.4)
  
  .insert 
    position absolute
    top 60px
    left 160px
    background #ddd
    height calc(100vh - 60px)
    width calc(100vw - 160px)
  
</style>
