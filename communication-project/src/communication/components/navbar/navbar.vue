<template>
  <div>
    <nav>
      <p class="brandName">eco</p>
      <img src="./head1.jpg" alt="无法显示图片" @click="$store.commit('changeSession','chatBox')">
      <button class="addUser" @click="$store.commit('changeSession','childList')">创建子账号</button>
      <p class="deviceItems">已有设备</p>
      <ul class="devices" @click="getUsers">
        <li v-for="device in devices" :key="device.wxId" :class="{activeBG:(deviceWxId==device.wxId)?true:false}" class="deviceName">
          <div style='position:absolute;left:0;width:100%;height:100%' :deviceName="device.deviceName" :deviceWxId="device.wxId"></div>
          <img src="./head1.jpg" alt="#" style="margin:0 14px 0 0;width:40px;height:40px">
          <span>{{device.deviceName}}</span>
          <span class="redDot" :id='"msgRD"+device.wxId'></span>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        devices: [],
        deviceWxId: ''
      }
    },
    methods: {
      getUsers: function (e) {
        this.$store.commit('changeSession','chatBox') // 切换session
        this.$store.commit('changeDevice',{name:e.target.getAttribute('deviceName'),id:e.target.getAttribute('deviceWxId')}) // 获取设备名称
        this.deviceWxId = e .target.getAttribute('deviceWxId')  // 改变目标id
        document.querySelector('#msgRD' + this.deviceWxId).style.display = 'none' // 清除红点
      },
    },
    created () {
      // 测试
      this.$http.get('http://192.168.1.226:8090/wechat/v1/conversation').then((res)=>{
        console.log('会话列表 from navbar',res)
        let wxUsers = []
        for (var i=0;i<res.body.data.content.length;i++){
          wxUsers.push(res.body.data.content[i])
        }
        this.$store.commit('userList',wxUsers)
      })
      // 获取 cookie
      function getCookie (cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i=0; i<ca.length; i++) {
          var c = ca[i].trim();
          if (c.indexOf(name)==0) return c.substring(name.length,c.length);
        }
      }
      // 获取token
      let kfRyUserId = getCookie('kfRyUserId')
      let ryToken = getCookie('ryToken')
      let parentUserId = getCookie('parentUserId')
      this.$store.commit('setToken',{token:kfRyUserId,ryToken:ryToken,parentUserId:parentUserId})
      // 获取设备列表
      this.$http.get('http://192.168.1.202:8140/api/v1/user/child/device/list?kfRyUserId='+ kfRyUserId).then(function(res){
        this.devices = res.body.data
        console.log('设备列表 from navbar：',res)
      }) 
    }
  }
</script>

<style scoped lang="stylus">
  .activeBG 
    background rgba(77,149,250,0.8)

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
          display none
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
</style>
