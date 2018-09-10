<template>
  <div class="sideBar">
    <input type="text" placeholder="搜索">
    <img src="./search.png" alt="#">
    <div class="sortPeople">
      <div class="allP" @click='sortUsers=1' :class="{activeBG:(sortUsers==1)?true:false}">全部</div>
      <div class="starP" @click='sortUsers=2' :class="{activeBG:(sortUsers==2)?true:false}">星标</div>
      <div class="blackP" @click='sortUsers=3' :class="{activeBG:(sortUsers==3)?true:false}">黑名单</div>
    </div>
    <ul class="userList" @click='startChat' v-if='sortUsers==1'>
      <li class="users" v-for='wxUser in wxUsers' :key='wxUser.ryTargetId' :id='"user"+wxUser.ryTargetId' :class='{activeBG:(targetWxId==wxUser.ryTargetId)?true:false}'>
        <div style='position:absolute;width:100%;height:100%' :targetWxId='wxUser.ryTargetId' :targetWxIcon='wxUser.ryIconUrl' :targetWxName='wxUser.ryName'></div>
        <img :src="wxUser.ryIconUrl" alt="#">
        <div>
          <div style='width:100px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap'>{{wxUser.ryName}}</div>
          <div style='position:absolute;top:6px;right:10px;white-space:nowrap;color:#777;font-size:12px'>{{wxUser.rySendTime}}</div>
          <div style='width:120px;color:#777;font-size:14px;text-overflow:ellipsis;overflow:hidden'>{{wxUser.messageContent}}</div>
        </div>
        <span class="redDot" :id='"msgRD"+wxUser.ryTargetId'></span>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        sortUsers: '1'
      }
    },
    computed: {
      wxUsers () {
        return this.$store.state.wxUsers
      },
      targetWxId () {
        return this.$store.state.targetWxIcon
      },
      newMsg () {
        return this.$store.state.newMsg
      }
    },
    watch: {
      newMsg: 'getNewMsg'
    },
    methods: {
      startChat: function (e) {
        let target = {name:e.target.getAttribute('targetWxName'),id:e.target.getAttribute('targetWxId'),icon:e.target.getAttribute('targetWxIcon')}
        this.$store.commit('changeTarget',target) 
        document.querySelector('#msgRD'+e.target.getAttribute('targetWxId')).style.display = 'none'
      },
      getNewMsg () {
        var _this = this
        if(!(document.querySelector('#user'+ this.newMsg.ryTargetId))){this.$store.commit('addUser',this.newMsg)}
        let parent = document.querySelector('.userList')
        setTimeout(function(){
          let child = document.querySelector('#user'+ _this.newMsg.ryTargetId)
          parent.insertBefore(child,parent.firstChild)
          if(_this.newMsg.ryTargetId !== _this.targetWxId){
            document.querySelector('#msgRD'+_this.newMsg.ryTargetId).style.display = 'block'
        }   

        },200)
           
      }
    },
    mounted () {
    }
  }
</script>

<style scoped lang="stylus">
  .activeBG 
    background rgba(77,149,250,0.4)

  .sideBar
    position relative
    width 240px
    height 100%
    border-right 1px #ddd solid
    overflow auto
    background white
    input 
      display block
      height 28px
      margin 20px auto 30px auto
      padding-left 10px
      border none
      border-radius 10px
      background #d6e6fc
      &:focus
          outline none
    >img 
      position absolute
      top 22px
      left 176px
      width 24px
    .sortPeople 
      display flex
      width 100%
      font-size 14px
      div
        flex 1
        width 50px
        text-align center
        border-bottom: 2px solid white
        border-radius 6px
        &:hover 
          border-bottom: 2px solid #4d95fa
    .userList
      padding 0
      list-style none
      overflow auto
      .users
        position relative
        display flex
        height 54px
        margin 6px 0px
        border-radius 10px
        align-items center
        overflow hidden
        img 
          height 30px
          width 30px
          border-radius 15px
          margin 0 18px 0 10px
        .redDot 
          position absolute
          top 10px
          left 42px
          width 10px
          height 10px
          border-radius 10px
          background red
</style>
