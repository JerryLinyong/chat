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
    <nav>
      <p class="brandName">eco</p>
      <img src="./head1.jpg" alt="无法显示图片" class="userImg" @click="chatBox()">
      <button class="addUser" @click="addChild()">创建子账号</button>
      <p class="deviceItems">已有设备</p>
      <ul class="devices" @click="getUsers">
        <li v-for="device in devices" :key="device.wxId" :class='{activeBG:(wxId==device.wxId)?true:false}' class="deviceName">
          <div style='position:absolute;width:100%;height:100%' :deviceName="device.deviceName" :wxId="device.wxId" :wxIcon='device.wxIcon'></div>
          <img src="./head1.jpg" alt="#" style="margin:0 14px 0 0;width:40px;height:40px">
          <span>{{device.deviceName}}</span>
          <span class="redDot" :id='"msgRD"+device.wxId'></span>
        </li>
      </ul>
    </nav>
    <div class="insert">
      <component :is="session" :ryToken='ryToken' :wxUsers="wxUsers" :devices='devices' :wxIcon='wxIcon' :wxId='wxId' :deviceName='deviceName' :parentShortcutPhrase='parentShortcutPhrase'></component>
    </div>
  </div>
</template>

<script>
  import chatBox from './main/chatBox/index'
  import childList from './main/childList/index'
  export default {
    components: {
      'chatBox': chatBox,
      'childList': childList
    },
    data () {
      return {
        session: "chatBox" ,
        devices: [],
        token: '',
        ryToken: '',
        deviceIds: '',
        wxUsers: [],
        wxIcon: '',
        wxId: '',
        deviceName: '',
        parentShortcutPhrase: []
      }
    },
    methods: {
      getUsers: function (e) {
        this.wxIcon = e.target.getAttribute('wxIcon')
        this.wxId = e.target.getAttribute('wxId')
        this.wxUsers = []
        this.session = 'chatBox'
        document.querySelector('#msgRD' + this.wxId).style.display = 'none'
        document.querySelector('.sended').innerHTML = ''
        this.deviceName = e.target.getAttribute('deviceName')
        this.$http.get('http://192.168.1.223:8120/demo/api/v1/agent/'+e.target.getAttribute('wxId'),).then(function(res){
          console.log(res)
          for (var i=0;i<res.body.data.length;i++){
            this.wxUsers.push(res.body.data[i])
          }
        })
      },
      chatBox: function () {
        this.session = 'chatBox'
      },
      addChild: function () {
        console.log('2')
        this.session = "childList"
      },
      logIn: function () {
        this.session = 'logIn'
      }
    },
    mounted () { 
    },
    created () {
      function getCookie (cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i=0; i<ca.length; i++) {
          var c = ca[i].trim();
          if (c.indexOf(name)==0) return c.substring(name.length,c.length);
        }
        return "";
      }      
      this.masterFlag = getCookie('masterFlag')
      this.token = getCookie('token')
      this.ryToken = getCookie('ryToken')
      this.$http.get('http://192.168.1.223:8120/demo/api/v1/user/child/device/list',{headers: {accessToken:this.token}}).then(function(getRes){
        for (var i=0;i<getRes.body.data.length;i++) {
          this.devices.push(getRes.body.data[i])
        }
        console.log(getRes)
      })
      this.$http.get('http://192.168.1.223:8120/demo/api/v1/parentShortcutPhrase/list',{headers: {accessToken:this.token}}).then(function(getRes){
        for (var i=0;i<getRes.body.data.length;i++) {
          this.parentShortcutPhrase.push(getRes.body.data[i])
        }
        console.log(getRes)
      })
    }
  }
</script>

<style scoped lang="stylus">
  .activeBG 
    background rgba(77,149,250,0.8)

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
  nav 
    position: absolute
    top: 0
    left: 0
    width: 160px
    height: 100vh
    text-align: center
    background: #252830
    font-family: "Helvetica Neue", Helvetica, STHeiTi, sans-serif
    .devices
      margin-top 0
      .deviceName
        position relative
        .redDot
          position absolute
          top 10px
          left 64px
          width 10px
          height 10px
          border-radius 10px
          background red
    .deviceItems
      font-size 20px
      color white
      margin 0
      padding 16px
      border-bottom 1px solid #ddd
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
    .addUser
      width 100px
      background  white
      font-size 14px
      font-weight bold
      padding 10px
      border-radius 8px
      border none
      &:focus
        outline none
    ul 
      list-style none
      padding 0
      li 
        display flex
        align-items center
        color white
        padding 10px 18px
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
    overflow hidden
  
</style>
