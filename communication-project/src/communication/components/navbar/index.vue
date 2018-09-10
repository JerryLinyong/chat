<template>
  <div>
    <nav>
      <p class="brandName">eco</p>
      <img src="./head1.jpg" alt="无法显示图片" @click="$store.commit('changeSession','chatBox')">
      <button class="addUser" @click="$store.commit('changeSession','childList')">创建子账号</button>
      <p class="deviceItems">已有设备</p>
      <ul class="devices" @click="getUsers">
        <li v-for="device in devices" :key="device.wxId" :class='{activeBG:(wxId==device.wxId)?true:false}' class="deviceName">
          <div style='position:absolute;width:100%;height:100%' :deviceName="device.deviceName" :wxId="device.wxId"></div>
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
        devices: []
      }
    },
    methods: {
      getUsers: function (e) {
        this.$store.commit('changeSession','chatBox')
        this.$store.commit('userList','[]')
        this.$store.commit('changeDevice',e.target.getAttribute('deviceName'))
        document.querySelector('#msgRD' + this.wxId).style.display = 'none'
        this.$http.get('http://192.168.1.226:8090/wechat/v1/conversation').then((res)=>{
          console.log(res)
          let wxUsers = []
          for (var i=0;i<res.body.data.length;i++){
            wxUsers.push(res.body.data[i])
          }
          this.$store.commit('userList',wxUsers)
        })
      },
    },
    created () {
      // 测试
      this.$http.get('http://192.168.1.226:8090/wechat/v1/conversation').then((res)=>{
        console.log(res)
        let wxUsers = []
        for (var i=0;i<res.body.data.length;i++){
          wxUsers.push(res.body.data[i])
        }
        this.$store.commit('userList',wxUsers)
      })
      console.log(this.$store.wxUsers)
      //
      function getCookie (cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i=0; i<ca.length; i++) {
          var c = ca[i].trim();
          if (c.indexOf(name)==0) return c.substring(name.length,c.length);
        }
        return "";
      } 
      this.$http.get('http://192.168.1.223:8120/demo/api/v1/user/child/device/list',{headers: {accessToken:getCookie('token')}}).then(function(getRes){
        for (var i=0;i<getRes.body.data.length;i++) {
          this.devices.push(getRes.body.data[i])
        }
        console.log(getRes)
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
