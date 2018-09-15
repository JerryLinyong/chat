<template>
  <div class="sideBar">
    <input type="text" placeholder="搜索">
    <img src="./search.png" alt="#">
    <div class="sortPeople">
      <div class="allP" @click='sortUsers=1' :class="{activeBG:(sortUsers==1)?true:false}">当前会话</div>
      <div class="starP" @click='sortUsers=2' :class="{activeBG:(sortUsers==2)?true:false}">星标</div>
      <div class="blackP" @click='getAllF()' :class="{activeBG:(sortUsers==3)?true:false}">全部</div>
    </div>
    <ul class="userList" @click='startChat' v-if='sortUsers==1'>
      <li class="users" v-for='wxUser in wxUsers' :key='wxUser.ryTargetId' :id='"user"+wxUser.ryTargetId' :class='{activeBG:(target.id==wxUser.ryTargetId)?true:false}'>
        <div style='position:absolute;width:100%;height:100%' :targetWxId='wxUser.ryTargetId' :targetWxIcon='wxUser.ryIconUrl' :targetWxName='wxUser.ryName'></div>
        <img :src="wxUser.ryIconUrl" alt="#">
        <div>
          <div style='width:100px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap'>{{wxUser.ryName}}</div>
          <div style='position:absolute;top:6px;right:10px;white-space:nowrap;color:#777;font-size:12px'>{{wxUser.rySendTimeStr}}</div>
          <div style='width:120px;color:#777;font-size:14px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap'>{{wxUser.messageContent}}</div>
        </div>
        <span class="redDot" :id='"msgRD"+wxUser.ryTargetId'></span>
      </li>
    </ul>
    <ul class="userList" v-if='sortUsers==3' @click='startChat'>
      <li class="users" v-for='wxUser in allFrigs' :key='wxUser.ryTargetId' :id='"user"+wxUser.ryTargetId' :class='{activeBG:(target.id==wxUser.ryTargetId)?true:false}'>
        <div style='position:absolute;width:100%;height:100%' :targetWxId='wxUser.ryTargetId' :targetWxIcon='wxUser.customerIcon' :targetWxName='wxUser.customerNickName'></div>
        <img :src="wxUser.customerIcon" alt="#">
        <div>
          <div style='width:100px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap'>{{wxUser.customerNickName}}</div>
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
        sortUsers: '1',
        wxUsers: [],
        allFrigs: []
      }
    },
    computed: {
      target () {
        return this.$store.state.target
      },
      newMsg () {
        return this.$store.state.newMsg
      },
      deviceWxId () {
        return this.$store.state.deviceWxId
      }
    },
    watch: {
      newMsg: 'getNewMsg',
      deviceWxId (newWxId) {
        this.sortUsers=1
        this.$http.get('http://192.168.1.223:8090/wechat/v1/conversation?wxId='+newWxId).then((res)=>{
          console.log('会话列表 from leftbar',res)
          this.wxUsers = res.body.data.content
        }) // 获取会话列表
      }
    },
    methods: {
      getAllF () {
        this.sortUsers=3
        this.$http.get('http://192.168.1.223:8090/api/v1/user/child/getAgentInfoList?deviceWxId='+this.deviceWxId).then((res)=>{
          console.log('用户列表 from leftbar',res)
          this.allFrigs = res.body.data
        }) // 获取用户列表
      },
      startChat: function (e) {
        let target = {name:e.target.getAttribute('targetWxName'),id:e.target.getAttribute('targetWxId'),icon:e.target.getAttribute('targetWxIcon')}
        this.$store.commit('changeTarget',target) 
        document.querySelector('#msgRD'+e.target.getAttribute('targetWxId')).style.display = 'none'
      },
      getNewMsg () {
        let targetId = this.newMsg.ryTargetId
        var _this = this
        if(!(document.querySelector('#user'+ targetId))){this.$store.commit('addUser',_this.newMsg)}
        let parent = document.querySelector('.userList')
        setTimeout(function(){
          let child = document.querySelector('#user'+ targetId)
          parent.insertBefore(child,parent.firstChild)
          if(targetId !== _this.target.id){
            document.querySelector('#msgRD'+targetId).style.display = 'block'
        }   

        },200)
           
      }
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
      position relative
      height 28px
      margin 20px auto 30px auto
      padding-left 10px
      display block
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
      position relative
      width 100%
      display flex
      font-size 14px
      div
        position relative
        width 50px
        flex 1
        text-align center
        border-bottom: 2px solid white
        border-radius 6px
        &:hover 
          border-bottom: 2px solid #4d95fa
    .userList
      position relative
      padding 0
      list-style none
      overflow auto
      .users
        position relative
        height 54px
        margin 6px 0px
        display flex
        border-radius 10px
        align-items center
        overflow hidden
        img 
          position relative
          height 30px
          width 30px
          margin 0 18px 0 10px
          border-radius 15px
        .redDot 
          position absolute
          top 10px
          left 42px
          width 10px
          height 10px
          display none
          border-radius 10px
          background red
</style>
